const express = require('express');
const passport = require('passport');
const boardsController = require('../controllers/boardsController');
const router = express.Router();

router.get('/', boardsController.getBoards);
router.get('/:boardName', boardsController.getBoard);
router.post('/new', boardsController.createBoard);

module.exports = router;
