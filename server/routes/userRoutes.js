const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAddresses,
  addAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// User profile & addresses
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePicFile'), updateUserProfile);

router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Wishlist
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Admin-only user panel
router.get('/', protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
