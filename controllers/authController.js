const jwt = require('jsonwebtoken');
const User = require('../models').User;

const createCookieFromToken = (user, statusCode, req, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.create(req.body);
    createCookieFromToken(user, 201, req, res);
  } catch (err) {
    next(err);
    // res.status(400).json(data.errors);
  }
};

exports.login = async (req, res, next) => {};

exports.logout = async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
