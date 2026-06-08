const express = require('express');
const router = Router = express.Router();
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected checkout route
router.post('/validate', protect, validateCoupon);

// Admin-only routes
router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
