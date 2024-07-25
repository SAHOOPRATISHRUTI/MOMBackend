
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateSignup, validateLogin } = require('../Validation/validationMiddleware.js');

router.post('/signup', validateSignup, userController.signup);
router.post('/login', validateLogin, userController.login);
router.post('/generate-otp', userController.generateOtp); 
router.post('/verify-otp',  userController.verifyOtp);   

module.exports = router;
