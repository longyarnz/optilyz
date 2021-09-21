/**
 * @fileoverview tokenParser is a middleware that extracts token bearer from the headers of a request. 
 * The token is parsed and piped to the next callback.
 * @exports tokenParser
 */
import JWT from 'jsonwebtoken';
import { logger } from './logger.js';

export const tokenParser = (req, res, next) => {
  const token = req.headers['authorization'];

  JWT.verify(token, process.env.SERVER_KEY, (err, decoded) => {
    if (err) {
      logger.error(err.message);
      res.status(401).json({ error: 'Unauthenticated User' });
    }
    else {
      req.userId = decoded.id;
      next();
    }
  });
};