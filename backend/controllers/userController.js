import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Username already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      accessToken: token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      accessToken: token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
    try {
      res.json({
        message: 'Protected route accessed!',
        user: req.user, // Contains user ID from JWT
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  export const addUserBadge = async (req, res) => {
    try {
      const { badge } = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (!user.badges.includes(badge)) {
        user.badges.push(badge);
        await user.save();
      }
  
      res.status(200).json({ message: 'Badge added', badges: user.badges });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  export const getUserBadges = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json(user.badges);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };