const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Setup environment first
dotenv.config();

// We will require routes later once we create them
const authRoutes = require('./routes/auth.js');
const collegeRoutes = require('./routes/colleges.js');
const itemRoutes = require('./routes/items.js');
const messageRoutes = require('./routes/messages.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campustrade')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('CampusTrade API is running');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
