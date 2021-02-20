const express = require('express');
const itemsController = require('../controllers/itemsController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/', authController.protect, itemsController.createItem);

module.exports = router;
