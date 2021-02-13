const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models').User;

const createCookieFromToken = (user, statusCode, req, res) => {
  const expiration = Date.now() + 10 * 24 * 60 * 60 * 1000;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: expiration,
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
    expiration,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    delete user.dataValues.password;
    createCookieFromToken(user, 201, req, res);
  } catch (err) {
    next(err);
    // res.status(400).json(data.errors);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    const compare = await bcrypt.compare(user.password, req.body.password);
    createCookieFromToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  console.log(req.cookies.jwt.expiration);
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
  } catch (err) {
    next(err);
  }
};
