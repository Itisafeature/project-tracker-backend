const AppError = require('../utils/appError');

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
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

  console.log(err);
  if (err.name === 'SequelizeValidationError') {
    error = handleValidationError(error);
  }
  sendError(error, req, res);
};