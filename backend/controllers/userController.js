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
        user: req.user, 
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  export const addBadgeToUser = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const { badge } = req.body;
  
      if (!user.badges.includes(badge)) {
        user.badges.push(badge);
        await user.save();
      }
  
      res.status(200).json({ message: 'Badge added successfully', badges: user.badges });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add badge', error: err.message });
    }
  };
  
  export const getUserBadges = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json(user.badges);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

export const addToFavourites = async (req, res) => {
  try {
    const { countryName, countryCode } = req.body;
    const userId = req.user.id; 

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.favourite.includes(countryCode)) {
      user.favourite.push(countryCode);
      await user.save();
    }

    res.status(200).json({ message: 'Country added to favourites', favourites: user.favourite });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to favourites', error: err.message });
  }
}

//show favourites
export const getFavourites = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.favourite);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const removeFromFavourites = async (req, res) => {
  try {
    const { countryCode } = req.params;
    const userId = req.user.id; 

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove country from favourites
    user.favourite = user.favourite.filter(code => code !== countryCode);
    await user.save();

    res.status(200).json({ message: 'Country removed from favourites', favourites: user.favourite });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from favourites', error: err.message });
  }
};

//check if a country is a favourite
export const checkIfFavourite = async (req, res) => {
  try {
    const { countryCode } = req.params;
    const userId = req.user.id; 
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isFavourite = user.favourite.includes(countryCode);

    res.status(200).json({ isFavourite });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}