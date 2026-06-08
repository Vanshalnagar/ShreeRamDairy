const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  let errorMessage = err.message || 'Server Error';

  // Handle Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Handle Mongoose Duplicate Key Error (unique email)
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value entered' });
  }

  res.status(statusCode).json({
    error: errorMessage,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
