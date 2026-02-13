import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { User } from '../models/User.js';

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters or more' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, newUser.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        userId: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Create an admin user using an ADMIN_SECRET (set in .env)
export const createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, secret } = req.body;
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid admin secret' });
    }

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcryptjs.hash(password, 10);
    const admin = new User({ email, password: hashed, firstName, lastName, isAdmin: true });
    await admin.save();

    const token = generateToken(admin._id, admin.email);
    res.status(201).json({ success: true, token, user: { userId: admin._id, email: admin.email, firstName: admin.firstName, lastName: admin.lastName, isAdmin: true } });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
