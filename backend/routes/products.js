const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { movePhotoToCategory } = require('../utils/photoCategories');

const router = express.Router();



// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { search, brand, category, minPrice, maxPrice, page = 1, limit = 100 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (brand && brand !== '') query.brand = { $regex: brand, $options: 'i' };
    if (category && category !== '') query.category = { $regex: category, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products: products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Organize images by category
    if (productData.images && productData.category) {
      const categoryFolder = productData.category.toLowerCase();
      const organizedImages = [];
      
      for (const imagePath of productData.images) {
        const filename = imagePath.split('/').pop();
        try {
          const newPath = await movePhotoToCategory(filename, categoryFolder);
          organizedImages.push(newPath);
        } catch (error) {
          organizedImages.push(imagePath); // Keep original if move fails
        }
      }
      
      productData.images = organizedImages;
    }
    
    const product = new Product(productData);
    await product.save();
    
    // Real-time sync
    const syncManager = req.app.get('syncManager');
    if (syncManager) {
      await syncManager.syncProducts('create', product);
    }
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Real-time sync
    const syncManager = req.app.get('syncManager');
    if (syncManager) {
      await syncManager.syncProducts('update', product);
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Real-time sync
    const syncManager = req.app.get('syncManager');
    if (syncManager) {
      await syncManager.syncProducts('delete', { id: req.params.id });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;