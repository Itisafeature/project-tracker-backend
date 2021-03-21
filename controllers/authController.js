const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models').user;

const createCookieFromToken = (user, statusCode, req, res) => {
  const expiration = Date.now() + 10 * 24 * 60 * 60 * 1000;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: expiration,
  });

  delete user.dataValues.id;
  delete user.dataValues.password;

  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    expiration,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  createCookieFromToken(req.user, 201, req, res);
};

exports.login = async (req, res, next) => {
  createCookieFromToken(req.user, 200, req, res);
};

exports.logout = async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findByPk(decodedToken.id);

    if (!token || !user) {
      next(err);
    }

    req.user = user;
  } catch (err) {
    next(err);
  }
  next();
};
