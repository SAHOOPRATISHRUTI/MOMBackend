// controllers/userController.js
const userService = require('../services/userService');

const generateOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = await userService.generateAndSaveOtp(email);
    res.json({ message: 'OTP generated successfully', otp });
  } catch (error) {
    res.status(429).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  try {
    await userService.verifyOtp(email, otp);
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const message = await userService.login(email, String(password));
    res.json({ message });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const message = await userService.signup(name, email, password);
    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, password, nwpassword } = req.body;

  try {
    const message = await userService.resetPassword(email, otp, password, nwpassword);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  generateOtp,
  verifyOtp,
  login,
  signup,
  resetPassword
};
