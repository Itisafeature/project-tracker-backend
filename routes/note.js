const express = require('express');
const notesController = require('../controllers/notesController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

router.get('/', authController.protect, notesController.getNotes);
router.post('/', authController.protect, notesController.createNote);

module.exports = router;
