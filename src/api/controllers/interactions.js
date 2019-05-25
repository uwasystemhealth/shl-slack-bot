import express from 'express';
import { interact } from '../services/slack';

const router = new express.Router();

router.use(interact.requestListener());

export default router;
