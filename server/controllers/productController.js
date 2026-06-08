const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Get all products (with search, category, sorting, filter)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice, rating } = req.query;
    let queryObj = {};

    // Filter by category
    if (category) {
      const dbCat = await Category.findOne({ slug: category });
      if (dbCat) {
        queryObj.category = dbCat._id;
      } else {
        // If category slug is not found, return empty array
        return res.json([]);
      }
    }

    // Search query (case insensitive on name, hindiName / gujaratiName, description)
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { gujaratiName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filters
    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = Number(minPrice);
      if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // Rating filters
    if (rating) {
      queryObj.rating = { $gte: Number(rating) };
    }

    let query = Product.find(queryObj).populate('category', 'name slug');

    // Sorting
    if (sort) {
      if (sort === 'priceAsc') {
        query = query.sort({ price: 1 });
      } else if (sort === 'priceDesc') {
        query = query.sort({ price: -1 });
      } else if (sort === 'ratingDesc') {
        query = query.sort({ rating: -1 });
      } else if (sort === 'newest') {
        query = query.sort({ createdAt: -1 });
      }
    } else {
      query = query.sort({ createdAt: -1 }); // default order
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch reviews for this product
    const reviews = await Review.find({ product: product._id }).populate('user', 'name profilePic').sort({ createdAt: -1 });

    res.json({
      product,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  const { name, gujaratiName, category, description, ingredients, price, weightOptions, stock, inStock } = req.body;

  try {
    // Check if category exists
    const dbCat = await Category.findById(category);
    if (!dbCat) {
      return res.status(400).json({ error: 'Invalid Category ID' });
    }

    let imageUrl = '';
    // If image file uploaded, upload to Cloudinary
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'shree_ram_dairy/products');
      imageUrl = uploadRes.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const weights = typeof weightOptions === 'string' ? JSON.parse(weightOptions) : weightOptions;

    const product = await Product.create({
      name,
      gujaratiName,
      category,
      description,
      ingredients,
      price: Number(price),
      weightOptions: weights || ['250g', '500g', '1kg'],
      stock: Number(stock),
      image: imageUrl
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  const { name, gujaratiName, category, description, ingredients, price, weightOptions, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    if (name) product.name = name;
    if (gujaratiName) product.gujaratiName = gujaratiName;
    if (description) product.description = description;
    if (ingredients) product.ingredients = ingredients;
    if (price) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    
    if (category) {
      const dbCat = await Category.findById(category);
      if (!dbCat) {
        return res.status(400).json({ error: 'Invalid Category ID' });
      }
      product.category = category;
    }

    if (weightOptions) {
      const weights = typeof weightOptions === 'string' ? JSON.parse(weightOptions) : weightOptions;
      product.weightOptions = weights;
    }

    // Upload new image if present
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'shree_ram_dairy/products');
      product.image = uploadRes.secure_url;
    } else if (req.body.image) {
      product.image = req.body.image;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Clean up reviews associated with this product
    await Review.deleteMany({ product: req.params.id });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addProductReview = async (req, res, next) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: req.params.id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      product: req.params.id,
      rating: Number(rating),
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories list (Public)
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    let imageUrl = '';
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'shree_ram_dairy/categories');
      imageUrl = uploadRes.secure_url;
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: imageUrl
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category (Admin only)
// @route   PUT /api/products/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description) {
      category.description = description;
    }

    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'shree_ram_dairy/categories');
      category.image = uploadRes.secure_url;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category (Admin only)
// @route   DELETE /api/products/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
