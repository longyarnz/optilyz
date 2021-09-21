/**
 * @fileoverview Port selection and server configuration.
 */
import * as dotenv from 'dotenv';
import { App } from './app.js';

dotenv.config();

/**
 * @constant {number} PORT
 */
const { PORT } = process.env;

/**
 * @description Let server listen on a dedicated PORT
 */
App.listen(PORT, () => {
  console.log(`Task Manager listening at http://localhost:${PORT}`);
});