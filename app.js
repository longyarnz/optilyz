/**
 * @fileoverview Initializes express app and API endpoints.
 * @exports app
 */
import express from 'express';
import expressStatus from 'express-status-monitor';

/**
 * @description Creates an express application
 * @constant {object}
 */
export const App = express();

/**
 * @description Add middleware for parsing request body to text, json, url object or form data
 * @function EXPRESS_USE_MIDDLEWARE
 * @param {middleware} body-parser A middleware for parsing request body to functional data type
 */
const statusMonitor = expressStatus();
App.use(statusMonitor);
App.use(express.json());

/**
 * @description Test server connection
 */
App.get('/', statusMonitor.pageRoute);