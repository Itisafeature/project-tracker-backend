const express = require('express');
const Board = require('../models').Board;
const boardsController = require('../controllers/boardsController');
const router = express.Router();

router.post('/new', boardsController.createBoard);

module.exports = router;
