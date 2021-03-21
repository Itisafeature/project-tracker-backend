const express = require('express');
const itemsController = require('../controllers/itemsController');
const authController = require('../controllers/authController');
const notesRouter = require('../routes/note');
const router = express.Router();

router.post('/', itemsController.createItem);
router.patch(
  '/updatePositions',

  itemsController.updatePositions
);

router.use('/:itemName/notes', notesRouter);

module.exports = router;
