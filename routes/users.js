var express = require('express');
const sessionsController = require('../controllers/sessionsController');
const usersController = require('../controllers/usersController');
var router = express.Router();

router.post('/login', sessionsController.loginUser);
router.post('/signup', usersController.createUser);
module.exports = router;
