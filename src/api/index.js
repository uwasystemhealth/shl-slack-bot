import express from 'express';
// import bodyParser from 'body-parser';
import commandsController from './controllers/commands';
import verificationMiddleware from './middleware/verification';
import eotdImageController from './controllers/eotd-image';

const router = new express.Router();

// router.use();

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());

router.use('/commands', verificationMiddleware(commandsController));

router.use('/eotd-image/:id', eotdImageController);

router.use('/', (req, res) => res.send('too far'));

export default router;
