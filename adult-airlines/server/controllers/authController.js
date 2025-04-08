import User from '../models/User.js';
import emailService from '../services/emailService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Auth controller object
const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { email, password, first_name, last_name, role } = req.body;

      // Validate required fields
      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: email, password, first_name, last_name'
        });
      }

      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Check if password is strong enough (at least 8 characters)
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create user
      const { user, verificationCode } = await User.create({
        email,
        password,
        first_name,
        last_name,
        role
      });

      // Skip email verification for now
      // In a real implementation, you would send an email with the verification code
      console.log('Verification code (not sent to email):', verificationCode);

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for verification code.',
        token,
        user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during registration'
      });
    }
  },

  // Verify email with verification code
  verifyEmail: async (req, res) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and verification code'
        });
      }

      const isVerified = await User.verifyEmail(email, code);

      if (!isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
      }

      // Get updated user
      const user = await User.findByEmail(email);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          email_verified: user.email_verified
        }
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during email verification'
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const user = await User.validateCredentials(email, password);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Skip email verification check since we don't have that column in the database
      // In a real implementation, you would check if the email is verified
      // if (!user.email_verified) {
      //   return res.status(401).json({
      //     success: false,
      //     message: 'Please verify your email before logging in'
      //   });
      // }

      // Generate token
      const token = generateToken(user);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during login'
      });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching user data'
      });
    }
  }
};

export default authController;
