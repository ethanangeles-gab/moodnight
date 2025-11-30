const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/authMiddleware'); // Protect routes

router.post('/', auth, journalController.createEntry);
router.get('/', auth, journalController.getEntries);

module.exports = router;