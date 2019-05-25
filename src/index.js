/* eslint-disable import/first */
import express from 'express';

require('dotenv').config();

import api from './api';
import './api/interactions';
import interactionsController from './api/controllers/interactions';

const port = process.env.PORT || 3000;
const app = express();

app.use('/slack/actions', interactionsController);

app.use('/slack', api);
app.listen(port);
console.log('listenting on port', port);
