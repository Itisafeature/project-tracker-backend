const express = require('express');
const passport = require('passport');
const User = require('../models').User;
const authController = require('../controllers/authController');
const router = express.Router();

const getUsers = async (req, res, next) => {
  const users = await User.findAll();
  res.status(201).json({
    status: 'success',
    data: {
      users,
    },
  });
};

router.get('/users', getUsers);

router.get(
  '/auth',
  passport.authenticate('jwt', { session: false }),
  authController.returnUser
);

router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  authController.login
);

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  authController.signup
);

router.post('/logout', authController.logout);

module.exports = router;
