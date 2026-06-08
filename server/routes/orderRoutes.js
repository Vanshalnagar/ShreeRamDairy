const express = require('express');
const router = express.Router();
const {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  getAnalytics
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public tracking
router.get('/track/:orderId', trackOrder);

// Protected customer routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.post('/razorpay', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// Admin-only management routes
router.get('/', protect, admin, getAllOrders);
router.get('/analytics', protect, admin, getAnalytics);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
