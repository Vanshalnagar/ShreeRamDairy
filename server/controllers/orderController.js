const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');

// Initialize Razorpay
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SwFI9BNT6yF3Ff',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'wLFiqZO1zFFX12CexUxkBrIQ'
  });
} catch (err) {
  console.warn('Razorpay initialization warning:', err.message);
}

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  const { items, shippingAddress, paymentMethod, couponCode, razorpayOrderId, razorpayPaymentId } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No order items provided' });
    }

    let subtotal = 0;
    const orderItems = [];

    // Verify stock and price for each product
    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(400).json({ error: `Product not found: ${item.name}` });
      }
      
      // Stock check
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${dbProduct.name}. Only ${dbProduct.stock} left.` });
      }

      // Decrement stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();

      const itemPrice = dbProduct.price; // base price
      // Apply weight pricing multiplier if needed (simulated for MERN sweet box weights)
      let priceMultiplier = 1;
      if (item.weight === '250g') priceMultiplier = 0.3;
      else if (item.weight === '500g') priceMultiplier = 0.55;
      else if (item.weight === '1kg' || item.weight === '1 kg') priceMultiplier = 1;

      const finalItemPrice = Math.round(itemPrice * priceMultiplier);
      const itemCost = finalItemPrice * item.quantity;
      subtotal += itemCost;

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        quantity: item.quantity,
        weight: item.weight,
        price: finalItemPrice
      });
    }

    // Apply coupon discount if applicable
    let discountPercent = 0;
    let couponUsed = null;
    if (couponCode) {
      const dbCoupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (dbCoupon && dbCoupon.expiryDate > Date.now()) {
        discountPercent = dbCoupon.discountPercent;
        couponUsed = dbCoupon._id;
      }
    }

    let discountAmount = subtotal * (discountPercent / 100);
    let discountedSubtotal = subtotal - discountAmount;

    // Calculate GST (5% for dairy/sweets in India)
    const gst = Math.round(discountedSubtotal * 0.05);

    // Calculate Delivery charges (Free above ₹500, else ₹40)
    const deliveryCharges = discountedSubtotal >= 500 ? 0 : 40;

    const total = Math.round(discountedSubtotal + gst + deliveryCharges);

    // Generate unique order ID (SRD-XXXXX)
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `SRD-${randNum}`;

    const order = await Order.create({
      orderId,
      user: req.user._id,
      items: orderItems,
      subtotal,
      gst,
      deliveryCharges,
      total,
      shippingAddress,
      paymentMethod,
      couponUsed,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus: paymentMethod === 'Razorpay' ? 'Paid' : 'Pending'
    });

    // Clear user cart in DB
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a Razorpay Order
// @route   POST /api/orders/razorpay
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  const { amount } = req.body;

  try {
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paisa (₹1 = 100 paisa)
      currency: 'INR',
      receipt: `receipt_srd_${Math.floor(Date.now() / 1000)}`
    };

    const rzpOrder = await razorpay.orders.create(options);
    res.json(rzpOrder);
  } catch (error) {
    console.error('Razorpay Order creation failed:', error.message);
    res.status(500).json({ error: 'Razorpay order creation failed. Please try again.' });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/orders/razorpay/verify
// @access  Private
exports.verifyRazorpayPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'wLFiqZO1zFFX12CexUxkBrIQ';
    
    // Hash check
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: 'Payment signature verified successfully' });
    } else {
      res.status(400).json({ error: 'Payment verification signature mismatch' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user orders history
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Track order details
// @route   GET /api/orders/track/:orderId
// @access  Public
exports.trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() })
      .populate('user', 'name phone');
      
    if (!order) {
      return res.status(404).json({ error: 'Order not found. Please double-check your Order ID.' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order preparation/delivery status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!['Pending', 'Preparing', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid order status option' });
    }

    order.orderStatus = status;

    // Auto-mark COD orders as Paid when Delivered
    if (status === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin statistics & analytics charts
// @route   GET /api/orders/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments({});
    
    const revenueObj = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, totalSales: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueObj.length > 0 ? revenueObj[0].totalSales : 0;

    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Preparing' });

    // Weekly sales trends aggregate (Group by day of week)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyTrend = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders
      },
      weeklyTrend
    });
  } catch (error) {
    next(error);
  }
};
