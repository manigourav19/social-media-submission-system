import express from 'express';
import multer from 'multer';
import User from '../models/User.js';
import path from 'path';

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with timestamp
  },
});

const upload = multer({ storage });

// User submission endpoint
router.post('/', upload.array('images', 5), async (req, res) => {
  const { name, socialMediaHandle } = req.body;
  const images = req.files.map(file => file.path);

  try {
    const newUser = new User({ name, socialMediaHandle, images });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
