import axios from 'axios';
import { web } from '../services/slack';
import { eotdSubmit } from '../templates/dialogs';

export default async (req, res) => {
  // let status = 200;
  // await slack.chat.postMessage(process.env.EOD_CHANNEL, req.body.text)
  //   .catch(() => {
  //     status = 503;
  //   });
  // console.log(req.body);
  switch (req.body.command) {
  case '/eotd':
    res.send();
    web.dialog.open({
      trigger_id: req.body.trigger_id,
      dialog: {
        ...eotdSubmit,
        elements: eotdSubmit.elements.map(el => (el.name === 'user' ? { ...el, value: req.body.user_id } : el)),
      },
    }).catch((error) => {
      console.error(JSON.stringify(error, null, 2));
      return axios.post(req.body.response_url, {
        text: `An error occurred while opening the dialog: ${error.message}`,
      });
    }).catch(console.error);
    break;
  default:
    res.status(200).send('Slash command completed.');
    break;
  }
};
