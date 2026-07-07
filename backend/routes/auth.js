const express = require('express');
const router = express.Router();
const User = require('../models/User');
const College = require('../models/College');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, collegeId) => {
  return jwt.sign({ id, collegeId }, process.env.JWT_SECRET || 'somesecretkey', {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, collegeName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let finalCollegeId = null;
    if (collegeName) {
      let college = await College.findOne({ collegeName: { $regex: new RegExp(`^${collegeName}$`, 'i') } });
      if (!college) {
        college = await College.create({ collegeName });
      }
      finalCollegeId = college._id;
    } else {
      return res.status(400).json({ message: 'College name is required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      collegeId: finalCollegeId,
      authProvider: 'local'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        collegeId: user.collegeId,
        token: generateToken(user._id, user.collegeId),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.authProvider === 'local') {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          collegeId: user.collegeId,
          token: generateToken(user._id, user.collegeId),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
       res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
