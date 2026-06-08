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
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, addProductReview);

// Admin-only CRUD routes (with image upload middleware)
router.post('/', protect, admin, upload.single('imageFile'), createProduct);
router.put('/:id', protect, admin, upload.single('imageFile'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

router.post('/categories', protect, admin, upload.single('imageFile'), createCategory);
router.put('/categories/:id', protect, admin, upload.single('imageFile'), updateCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

module.exports = router;
