/* eslint-disable consistent-return */
import axios from 'axios';
import { interact, web } from '../services/slack';
import { eotdConfirm, eotdSubmit } from '../templates/dialogs';
import latexUrl from '../services/latex';

const userEotds = {};

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
  image_url: latexUrl(`
  \\begin{center}
  \\text{${submission.title}}\\\\
  ${submission.latex}
  \\end{center}`),
  alt_text: submission.title,
});

const getDate = (d = new Date()) => `${d.getDate() + 1}/${d.getMonth() + 1}/${d.getFullYear()}`;

interact.action('eotd_submit', (payload, res) => {
  const errors = validateEotdSubmission(payload.submission);
  if (errors) return errors;
  res({
    ...eotdConfirm,
    attachments: [genAttachment(payload.submission), ...eotdConfirm.attachments],
  });
  userEotds[payload.user.id] = payload.submission;
});

interact.action('eotd_confirm', (payload, res) => {
  // console.log(payload);
  const submission = userEotds[payload.user.id];
  if (payload.actions[0].value === 'accept') {
    res({ text: '' });
    web.chat.postMessage({
      channel: process.env.EOTD_CHANNEL,
      text: `Equation of the Day "${submission.title}" submitted by <@${submission.user}> on ${getDate(new Date())}`,
      attachments: [genAttachment(submission)],
    }).catch(error => axios.post(payload.response_url, {
      text: `An error occurred while opening the dialog: ${error.message}`,
    })).catch(console.error);
  } else if (payload.actions[0].value === 'deny') {
    try {
      res({ text: 'Ok, let\'s try again!' });
      web.dialog.open({
        trigger_id: payload.trigger_id,
        dialog: {
          ...eotdSubmit,
          elements: eotdSubmit.elements.map(el => ({ ...el, value: submission[el.name] })),
        },
      }).catch(error => axios.post(payload.response_url, {
        text: `An error occurred while opening the dialog: ${error.message}`,
      })).catch(console.error);
    } catch (err) {
      console.error(err);
    }
  } else {
    res({ text: 'Ok, no worries!' });
  }
  delete userEotds[payload.user.id];
});
