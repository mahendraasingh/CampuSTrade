const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campustrade_items',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
const upload = multer({ storage });

// GET items based on collegeId (From query parameter or token)
router.get('/', protect, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { collegeId: req.user.collegeId, status: 'available' };
    
    if (category) {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const items = await Item.find(query).populate('sellerId', 'name profilePicture email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET items for logged in user
router.get('/user/me', protect, async (req, res) => {
  try {
    const items = await Item.find({ sellerId: req.user.id }).sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET specific item
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('sellerId', 'name profilePicture email');
    if (item && item.collegeId.toString() === req.user.collegeId) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new item
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, condition } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const newItem = await Item.create({
      title,
      description,
      price,
      category,
      condition,
      image: imageUrl,
      sellerId: req.user.id,
      collegeId: req.user.collegeId
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    
    item.status = req.body.status || 'sold';
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update item (full details)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    
    if (req.body.title) item.title = req.body.title;
    if (req.body.description) item.description = req.body.description;
    if (req.body.price) item.price = req.body.price;
    if (req.body.category) item.category = req.body.category;
    if (req.body.condition) item.condition = req.body.condition;

    if (req.file) {
      item.image = req.file.path;
    }
    
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE item
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    if (item.image) {
      try {
        const splitUrl = item.image.split('/upload/');
        if (splitUrl.length > 1) {
          let pathParts = splitUrl[1].split('/');
          if (pathParts[0].match(/^v\d+$/)) {
            pathParts.shift();
          }
          const publicIdWithExt = pathParts.join('/');
          const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      } catch (err) {
        console.error('Cloudinary deletion error:', err);
      }
    }
    
    await Item.deleteOne({ _id: req.params.id });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
