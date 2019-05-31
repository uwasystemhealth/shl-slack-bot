import { Schema, model } from 'mongoose';

const eotdSchema = new Schema({
  title: {
    type: String,
    maxLength: 128,
    required: true,
    trim: true,
  },
  latex: {
    type: String,
    maxLength: 3000,
    required: true,
    trim: true,
  },
  user: {
    type: String,
    maxLength: 128,
  },
  image: String,
  owner: {
    type: String,
    maxLength: 128,
  },
  published: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default model('eotd', eotdSchema);
