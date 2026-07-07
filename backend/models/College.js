const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema);
