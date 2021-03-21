const express = require('express');
const notesController = require('../controllers/notesController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);

module.exports = router;
