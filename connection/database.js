/**
 * @fileoverview MongoDB Database configuration.
 * @exports mongoose
 */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
const { MONGO_URI } = process.env;

/**
 * @description Creates a connection to the MongoDB server
 */
export const connect = () => mongoose.connect(MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch((error) => {
    console.log('database connection failed. exiting now...');
    console.error(error);
  });

connect();

export { mongoose };