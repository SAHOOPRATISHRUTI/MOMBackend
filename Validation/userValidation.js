const Joi = require('joi');

const signupSchema = Joi.object({
 name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

module.exports = {
  signupSchema,
  loginSchema,
};
