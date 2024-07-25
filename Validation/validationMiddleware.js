const { signupSchema, loginSchema } = require('./userValidation');

const validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(detail => detail.message) });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin
};