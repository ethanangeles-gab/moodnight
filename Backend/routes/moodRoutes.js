const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, moodController.logMood);
router.get('/', auth, moodController.getMoodHistory);

module.exports = router;