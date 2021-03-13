const express = require('express');
const notesController = require('../controllers/notesController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

router.post('/', authController.protect, notesController.createNote);

module.exports = router;
