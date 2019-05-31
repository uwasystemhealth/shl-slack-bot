import { connect } from 'mongoose';
import EotdModel from './eotd';

connect(process.env.MONGO_URI, { useNewUrlParser: true });

// eslint-disable-next-line import/prefer-default-export
export const Eotd = EotdModel;
