const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);

// Admin-only category routes (must be before /:id to avoid conflict)
router.post('/categories', protect, admin, upload.single('imageFile'), createCategory);
router.put('/categories/:id', protect, admin, upload.single('imageFile'), updateCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

// Product routes with :id param (must come after /categories)
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, addProductReview);

// Admin-only product CRUD
router.post('/', protect, admin, upload.single('imageFile'), createProduct);
router.put('/:id', protect, admin, upload.single('imageFile'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
