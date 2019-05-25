import crypto from 'crypto';
import timingSafeCompare from 'tsscmp';
import getRawBody from 'raw-body';
import querystring from 'querystring';

// ripped from https://github.com/slackapi/node-slack-sdk/blob/master/packages/interactive-messages/src/http-handler.js

const errorCodes = {
  SIGNATURE_VERIFICATION_FAILURE: 'SLACKHTTPHANDLER_REQUEST_SIGNATURE_VERIFICATION_FAILURE',
  REQUEST_TIME_FAILURE: 'SLACKHTTPHANDLER_REQUEST_TIMELIMIT_FAILURE',
};

const parseBody = (body) => {
  const parsedBody = querystring.parse(body);
  if (parsedBody.payload) {
    return JSON.parse(parsedBody.payload);
  }

  return parsedBody;
};

const verifyRequestSignature = (signingSecret, requestHeaders, body) => {
  // Request signature
  const signature = requestHeaders['x-slack-signature'];
  // Request timestamp
  const ts = requestHeaders['x-slack-request-timestamp'];

  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);

  if (ts < fiveMinutesAgo) {
    console.error('request is older than 5 minutes');
    const error = new Error('Slack request signing verification failed');
    error.code = errorCodes.REQUEST_TIME_FAILURE;
    throw error;
  }

  const hmac = crypto.createHmac('sha256', signingSecret);
  const [version, hash] = signature.split('=');
  hmac.update(`${version}:${ts}:${body}`);

  if (!timingSafeCompare(hash, hmac.digest('hex'))) {
    console.error('request signature is not valid');
    const error = new Error('Slack request signing verification failed');
    error.code = errorCodes.SIGNATURE_VERIFICATION_FAILURE;
    throw error;
  }

  console.error('request signing verification success');
  return true;
};

export default fn => (req, res, next) => {
  getRawBody(req)
    .then((r) => {
      const rawBody = r.toString();

      if (verifyRequestSignature(process.env.SLACK_SIGNING_SECRET, req.headers, rawBody)) {
        req.body = parseBody(rawBody);
        Promise.resolve(fn(req, res, next))
          .catch(next);
      } else {
        res.sendStatus(403);
      }
    }).catch((error) => {
      if (error.code === errorCodes.SIGNATURE_VERIFICATION_FAILURE
        || error.code === errorCodes.REQUEST_TIME_FAILURE) {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    });
};
