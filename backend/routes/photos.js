const express = require('express');
const multer = require('multer');
const path = require('path');
const { getPhotosByCategory, movePhotoToCategory, createCategoryFolders } = require('../utils/photoCategories');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Initialize category folders
createCategoryFolders();

// Get photos organized by category
router.get('/categories', async (req, res) => {
  try {
    const categorizedPhotos = await getPhotosByCategory();
    res.json(categorizedPhotos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload photos
router.post('/upload', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    const uploadedFiles = req.files.map(file => `uploads/${file.filename}`);
    res.json({ message: 'Photos uploaded successfully', files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Move photo to specific category
router.post('/categorize', adminAuth, async (req, res) => {
  try {
    const { filename, category } = req.body;
    const newPath = await movePhotoToCategory(filename, category);
    res.json({ message: 'Photo categorized successfully', path: newPath });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;