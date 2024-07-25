const Users = require('../models/userModels');
const Otp = require('../models/otpModel');
const { sendOtpEmail } = require('../helper/userAuthenticate.js');
const bcrypt = require('bcrypt');

// Function to generate a random 4-digit OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Function to handle user login
const login = async (email, password) => {
  // Ensure password is a string
  if (typeof password !== 'string') {
    password = String(password);
  }

  const user = await Users.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    return 'Login Successfully';
  }
  throw new Error('Invalid user');
};

// Function to handle user signup
const signup = async (name, email, password) => {
  if (typeof password !== 'string') {
    password = String(password); // Convert to string if necessary
  }

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Users({ name, email, password: hashedPassword });
  await newUser.save();

  return 'User registered successfully';
};

// Function to generate and save OTP for an existing user
const generateAndSaveOtp = async (email) => {
  // Check if email exists in users' database
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error('This email ID is not valid');
  }

  // Retrieve existing OTP record for the email
  let otpRecord = await Otp.findOne({ email });

  // Handle OTP attempts and generation
  if (otpRecord) {
    if (otpRecord.attempts >= 3) {
      const timeDiff = (new Date() - new Date(otpRecord.createdAt)) / (1000 * 60);
      if (timeDiff < 15) {
        throw new Error('Maximum attempts reached. Please try again after 15 minutes.');
      } else {
        otpRecord.attempts = 0;
      }
    }

    otpRecord.otp = generateOtp();
    otpRecord.createdAt = new Date();
    otpRecord.attempts += 1;
  } else {
    otpRecord = new Otp({ email, otp: generateOtp(), attempts: 1 });
  }

  await otpRecord.save();
  await sendOtpEmail(email, otpRecord.otp);

  return otpRecord.otp;
};

// Function to verify OTP
const verifyOtp = async (email, otp) => {
  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord) {
    throw new Error('Invalid OTP');
  }
  return true;
};

// Function to reset user password
const resetPassword = async (email, otp, password, nwpassword) => {
  if (typeof password !== 'string') {
    password = String(password); // Convert to string if necessary
  }
  if (typeof nwpassword !== 'string') {
    nwpassword = String(nwpassword); // Convert to string if necessary
  }

  // Check if the user exists
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Verify OTP
  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord) {
    throw new Error('Invalid OTP');
  }

  // Check if new passwords match
  if (password !== nwpassword) {
    throw new Error('New passwords do not match');
  }

  const hashedPassword = await bcrypt.hash(nwpassword, 10);
  user.password = hashedPassword;
  await user.save();

  return 'Password updated successfully';
};

module.exports = {
  generateAndSaveOtp,
  verifyOtp,
  login,
  signup,
  resetPassword,
};
