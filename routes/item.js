const express = require('express');
const itemsController = require('../controllers/itemsController');
const authController = require('../controllers/authController');
const router = express.Router();

// router.get('/:id', itemsController.getItem); TEST ROUTE
router.post('/', authController.protect, itemsController.createItem);
router.patch(
  '/updatePositions',
  authController.protect,
  itemsController.updatePositions
);

module.exports = router;
