const AppError = require('../utils/appError');

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJsonTokenError = err => {
  const message = `Unauthorized. Please login again`;
  return new AppError(message, 401);
};

const handleUniqueConstraintError = () => {
  console.log('here');
};

const sendError = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    msg: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (err.name === 'SequelizeValidationError') {
    error = handleValidationError(err);
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    error = handleUniqueConstraintError(err);
  } else if (err.name === 'JsonWebTokenError') {
    error = handleJsonTokenError(err);
  }
  sendError(error, req, res);
};
