/**
 * @fileoverview Logger Utility monitors and logs all output to info.log
 * for debugging and app control
 */
import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

/**
 * @constant {string} Format - This is the format fo logs piped into info.log
 */
const myFormat = printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`
});

/**
 * @description
 * Export the logger object to log outputs to `${info.log}
 * @exports Logger.createLogger
 */
export const logger = createLogger({
  level: 'verbose',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: 'error.log' }),
    new transports.Console()
  ],
  exceptionHandlers: [
    new transports.Console()
  ]
});