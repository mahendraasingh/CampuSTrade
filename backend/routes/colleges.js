const express = require('express');
const router = express.Router();
const College = require('../models/College');

router.get('/', async (req, res) => {
  try {
    console.log('Fetching colleges...');
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { collegeName, location } = req.body;
    const newCollege = await College.create({ collegeName, location });
    res.status(201).json(newCollege);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
