/**
 * @fileoverview validateTask is a middleware that validates the name field in the request object.
 * @exports validateTask
 */

import { logger } from './logger.js';

const isNotString = input => {
  return typeof input !== 'string'
}

const isNotDate = input => {
  if (isNotString(input)) return true;

  const date = new Date(input);
  return date.toString() === 'Invalid Date';
}

export const validateTask = (req, res, next) => {
  /**
   * @description Destructures and extracts name from the Request object
   */
  const { title, description, endTime, reminderTime } = req.body;

  /**
   * @description Tests for data input
   */
  if (isNotString(title) || isNotString(description) || isNotDate(endTime) || isNotDate(reminderTime)) {
    logger.error('Invalid Inputs');
    res.status(400).json({ error: 'Invalid Inputs' });
  }
  else {
    next();
  }
};

export const validateTaskUpdateInput = (req, res, next) => {
  /**
   * @description Destructures and extracts name from the Request object
   */
  const { title, description, endTime, reminderTime } = req.body;

  /**
   * @description Tests for data input
   */
  if (
    (title && isNotString(title)) ||
    (description && isNotString(description)) ||
    (endTime && isNotDate(endTime)) ||
    (reminderTime && isNotDate(reminderTime)) ||
    (!title && !description && !endTime && !reminderTime)
  ) {
    logger.error('Invalid Inputs');
    res.status(400).json({ error: 'Invalid Inputs' });
  }
  else {
    next();
  }
};