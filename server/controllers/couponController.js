const Coupon = require('../models/Coupon');

// @desc    Validate a discount coupon
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = async (req, res, next) => {
  const { code } = req.body;

  try {
    if (!code) {
      return res.status(400).json({ error: 'Please provide coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

    if (!coupon) {
      return res.status(400).json({ error: 'Invalid coupon code' });
    }

    if (coupon.expiryDate < Date.now()) {
      return res.status(400).json({ error: 'Coupon code has expired' });
    }

    res.json({
      success: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin only)
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new discount coupon (Admin only)
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res, next) => {
  const { code, discountPercent, expiryDate } = req.body;

  try {
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code,
      discountPercent: Number(discountPercent),
      expiryDate: new Date(expiryDate)
    });

    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon code (Admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};
