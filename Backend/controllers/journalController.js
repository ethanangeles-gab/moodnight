const db = require('../db');

// Create a new Journal Entry
exports.createEntry = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.user_id; // Comes from authMiddleware

        // Mock Sentiment Analysis (Random for now)
        const sentiment_score = (Math.random() * 2 - 1).toFixed(2);

        const [result] = await db.query(
            'INSERT INTO journal_entries (user_id, title, content, sentiment_score) VALUES (?, ?, ?, ?)',
            [userId, title, content, sentiment_score]
        );

        res.status(201).json({ message: 'Journal entry created', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all entries for the logged-in user
exports.getEntries = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const [rows] = await db.query(
            'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY entry_date DESC',
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};