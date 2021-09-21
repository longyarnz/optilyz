/**
 * @fileoverview AuthRouteentication Route for server connection.
 * @exports router
 */
import express from 'express';
import JWT from 'jsonwebtoken';
import { hash } from 'bcrypt';
import { authenticateUser, createUser } from '../service/userService.js';
import { logger, tokenParser, validateRegister, validateLogin } from '../middleware/index.js';

export const AuthRoute = express.Router();

const registerNewUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const encryptedPassword = await hash(password, 10);

    const existingUser = await authenticateUser({ email, password });
    if (existingUser?.isValid) {
      throw new Error('Email is already signed up');
    }

    const user = await createUser({
      password: encryptedPassword,
      email,
      name
    });

    if (user.isCreated) {
      loginUser(req, res);
    }
    else {
      throw new Error('Unable to create user at this time');
    }
  }
  catch (err) {
    logger.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser({ email, password });

    if (user.isValid) {
      /**
       * @description Creates JWT token from the email and password
       */
      JWT.sign({ id: user.id }, process.env.SERVER_KEY, (err, token) => {
        if (err) {
          logger.error(err.message);
        }
        else {
          const message = {
            text: 'User log-in successful',
            token
          };

          /**
           * @description Returns user token
           */
          res.status(200).json(message);
        }
      });
    }
    else {
      throw new Error('Email and password does not exist');
    }
  }
  catch (err) {
    logger.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

/**
 * @description Registers a user into the Server
 * @param {string} route An API route to login
 * @param {middleware} validateRegister - Callback for post method to routes
 * @returns {Response} JSON
 */
AuthRoute.post('/register', validateRegister, registerNewUser);

/**
 * @description Logs a user into the Server
 * @param {string} route An API route to login
 * @param {middleware} validateLogin - Callback for post method to routes
 * @returns {Response} JSON
 */
AuthRoute.post('/login', validateLogin, loginUser);

/**
 * @description Log a user out of the Server
 * @param {string} route An API route to login
 * @returns {Response} JSON
 */
AuthRoute.get('/logout', tokenParser, (req, res) => {
  res.header['authorization'] = '';
  res.status(200).end();
});