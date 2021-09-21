/**
 * @fileoverview Methods for querying data from the users collection.
 * @exports { createUser, authenticateUser }
 */
import { UserModel } from '../models/user.js';
import { logger } from '../middleware/index.js';
import { compare } from 'bcrypt';

/**
 * @description Authenticates a user given a name and a password
 * @param {object} input - name and password object
 * @return {object} isValid and id
 */
export const authenticateUser = async (input) => {
  try {
    const { email, password } = input;

    const user = await UserModel.findOne({ email });
    const userIsTrue = user && await compare(password, user.password);
    return userIsTrue ? { isValid: true, id: user._id } : { isValid: false, id: null };
  }
  catch (err) {
    logger.error(err.message);
  }
};

/**
 * @description Creates a user given a name and a password
 * @param {object} input - name and password object
 * @return {object} isValid and id
 */
export const createUser = async (input) => {
  try {
    const { name, password, email } = input;
    const user = await UserModel.create({ name, password, email });
    return user?._id ? { isCreated: true, id: user._id } : { isCreated: false, id: null };
  }
  catch (err) {
    logger.error(err.message);
  }
};