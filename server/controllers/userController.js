const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & upload picture
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  const { name, phone, password } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    // Handle profile pic upload to Cloudinary
    if (req.file) {
      console.log(`Uploading profile pic buffer to Cloudinary for user: ${user.email}`);
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'shree_ram_dairy/profiles');
      user.profilePic = uploadRes.secure_url;
      console.log(`✓ Profile pic updated: ${user.profilePic}`);
    }

    // Change password if provided
    if (password) {
      user.password = password; // pre-save hook handles hashing
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Add address to user profile
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = async (req, res, next) => {
  const { title, receiverName, receiverPhone, addressLine, city, state, pincode, isDefault } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If marked default, unset previous default
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress = {
      title: title || 'Home',
      receiverName,
      receiverPhone,
      addressLine,
      city,
      state,
      pincode,
      isDefault: isDefault || false
    };

    user.addresses.push(newAddress);
    await user.save();
    
    res.status(201).json(user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address from user profile
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get wishlist items
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name slug' }
    });
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alreadyInWishlist = user.wishlist.includes(req.params.productId);
    if (alreadyInWishlist) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.json({ success: true, message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(
      pid => pid.toString() !== req.params.productId
    );
    await user.save();

    res.json({ success: true, message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN USERS ENDPOINTS ---

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  const { role } = req.body;

  try {
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role assignment' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, message: `Role updated to ${role}`, user: { id: user._id, role: user.role } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
