/**
 * @fileoverview validateInput is a middleware file that validates the inputs fields in the request object.
 * @exports validateRegister
 * @exports validateLogin
 */
const isNotString = input => {
  return typeof input !== 'string';
};

export const validateRegister = (req, res, next) => {
  /**
   * @description Destructures and extracts name and password from Request object
   */
  const { name, password, email } = req.body;

  /**
   * @description Tests for data validity
   */
  if (isNotString(name) || isNotString(password) || isNotString(email)) {
    res.status(400).json({ error: 'Invalid Inputs' });
  }
  else {
    next();
  }
};

export const validateLogin = (req, res, next) => {
  /**
   * @description Destructures and extracts name and password from Request object
   */
  const { password, email } = req.body;

  /**
   * @description Tests for data validity
   */
  if (isNotString(password) || isNotString(email)) {
    res.status(400).json({ error: 'Invalid Inputs' });
  }
  else {
    next();
  }
};