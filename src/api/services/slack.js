import { WebClient } from '@slack/web-api';
import { createMessageAdapter } from '@slack/interactive-messages';

require('dotenv').config();

export const web = new WebClient(process.env.SLACK_ACCESS_TOKEN);
export const interact = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);
