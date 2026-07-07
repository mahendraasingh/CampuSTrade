const mongoose = require('mongoose');
const dotenv = require('dotenv');
const College = require('./models/College.js');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campustrade')
  .then(async () => {
    console.log('Connected for seeding');
    // Seed some colleges
    const existing = await College.find();
    if (existing.length === 0) {
      await College.create([
        { collegeName: 'University of Engineering', domain: 'uoe.edu' },
        { collegeName: 'State Arts College', domain: 'sac.edu' }
      ]);
      console.log('Colleges seeded');
    } else {
      console.log('Colleges already exist');
    }
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
