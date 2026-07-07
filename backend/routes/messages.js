const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// Get inbox summary for logged in user
router.get('/inbox', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
    })
      .sort({ createdAt: -1 })
      .populate('senderId receiverId', 'name profilePicture')
      .populate('itemId', 'title image price');

    const conversationsMap = new Map();

    messages.forEach(msg => {
      // Find the peer (the other person in the conversation)
      const senderStr = msg.senderId._id.toString();
      const meStr = req.user.id;
      const peer = senderStr === meStr ? msg.receiverId : msg.senderId;
      const peerIdStr = peer._id.toString();

      // If item was deleted/isn't there, skip
      if (!msg.itemId) return; 
      
      const itemIdStr = msg.itemId._id.toString();
      const key = `${peerIdStr}_${itemIdStr}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          peer,
          item: msg.itemId,
          latestMessage: msg.message,
          latestMessageDate: msg.createdAt,
          key
        });
      }
    });

    res.json(Array.from(conversationsMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread message count
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all messages as read for logged-in user
router.put('/mark-read', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { receiverId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get conversation between logged-in user and another user regarding an item
router.get('/:peerId/:itemId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      itemId: req.params.itemId,
      $or: [
        { senderId: req.user.id, receiverId: req.params.peerId },
        { senderId: req.params.peerId, receiverId: req.user.id }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, itemId, text } = req.body;
    const newMessage = await Message.create({
      senderId: req.user.id,
      receiverId,
      itemId,
      message: text
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
