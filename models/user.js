/**
 * @fileoverview Creates a schema for the database.
 * @exports mongoose.model
 */
import { mongoose } from '../connection/database.js';

const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  email: String,
  password: String,
  date_created: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model('User', User);