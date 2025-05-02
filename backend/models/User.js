import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  badges: {
    type: [String], // Array of CCA3 codes (e.g., ['JPN', 'USA'])
    default: []
  }
});

const User = mongoose.model('User', userSchema);

export default User;