const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
