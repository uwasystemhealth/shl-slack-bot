/* eslint-disable consistent-return */
import axios from 'axios';
import { interact, web } from '../services/slack';
import { eotdConfirm, eotdSubmit } from '../templates/eotd';
import { latexEotd } from '../services/latex';
import { twitterEotd } from '../services/twitter';
import { Eotd } from '../../models';

const validateEotdSubmission = (submission) => {
  const errors = [];
  if (!submission.latex.trim()) {
    errors.push({
      name: 'latex',
      error: 'The equation cannot be empty',
    });
  }
  if (!submission.title.trim()) {
    errors.push({
      name: 'title',
      error: 'The title cannot be empty',
    });
  }
  if (errors.length > 0) {
    return { errors };
  }
};

const genAttachment = submission => ({
  type: 'image',
  title: {
    type: 'plain_text',
    text: `Equation of the Day "${submission.title}" submitted by <@${submission.user}>`,
    emoji: true,
  },
  image_url: `https://slackbot.systemhealthlab.com/slack/eotd-image/${submission._id}?${(new Date(submission.updatedAt)).getTime()}`,
  alt_text: submission.title,
});

const getDate = (d = new Date()) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

interact.action('eotd_submit', (payload, res) => {
  // console.log(payload);
  const errors = validateEotdSubmission(payload.submission);
  if (errors) return errors;
  (async () => {
    let submission;
    if (payload.state) {
      submission = await Eotd.findById(payload.state);
      Object.keys(payload.submission).forEach((i) => { submission[i] = payload.submission[i]; });
    } else {
      submission = new Eotd({ ...payload.submission, owner: payload.user.id });
    }
    submission.image = await latexEotd(submission.title, submission.latex);
    submission = await submission.save();
    // console.log(submission);
    res(eotdConfirm(submission._id, [genAttachment(submission)]));
  })();
});

interact.action('eotd_confirm', async (payload, res) => {
  // console.log(payload);
  const [value, id] = payload.actions[0].value.split(':');
  const submission = await Eotd.findById(id);
  if (value === 'accept') {
    res({ text: 'Ok, Publish! (∩｀-´)⊃━☆ﾟ.*・｡ﾟ' });
    web.chat.postMessage({
      channel: process.env.EOTD_CHANNEL,
      text: `Equation of the Day "${submission.title}" submitted by <@${submission.user}> on ${getDate(new Date())}`,
      attachments: [await genAttachment(submission)],
    }).catch(error => axios.post(payload.response_url, {
      text: `An error occurred while opening the dialog: ${error.message}`,
    })).catch(console.error);
    twitterEotd(submission);
    submission.published = true;
    submission.save();
  } else if (value === 'deny') {
    try {
      res({ text: 'Ok, let\'s try again!' });
      web.dialog.open({
        trigger_id: payload.trigger_id,
        dialog: eotdSubmit(submission),
      }).catch(error => axios.post(payload.response_url, {
        text: `An error occurred while opening the dialog: ${error.message}`,
      })).catch(console.error);
    } catch (err) {
      console.error(err);
    }
  } else {
    res({ text: 'Ok, no worries!' });
    submission.delete();
  }
});
