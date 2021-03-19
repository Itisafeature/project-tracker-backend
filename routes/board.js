const express = require('express');
const passport = require('passport');
const boardsController = require('../controllers/boardsController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', boardsController.getBoards);
router.get('/:boardName', authController.protect, boardsController.getBoard);
router.post('/new', authController.protect, boardsController.createBoard);

module.exports = router;
