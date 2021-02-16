const express = require('express');
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

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/signup', authController.signup);
// router.get('/auth', authController.protect);
module.exports = router;
