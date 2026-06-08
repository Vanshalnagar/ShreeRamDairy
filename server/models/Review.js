const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Calculate product average rating when review is saved
ReviewSchema.statics.calculateAverageRating = async function(productId) {
  const obj = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', averageRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].numReviews
      });
    } else {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        rating: 4.5,
        numReviews: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.pre('deleteOne', { document: true, query: false }, function() {
  this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
