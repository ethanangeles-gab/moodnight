const db = require('../db');

exports.logMood = async (req, res) => {
    try {
        const { mood_value, mood_note } = req.body;
        const userId = req.user.user_id;

        // Determine Emoji
        let emoji = '😐';
        if (mood_value >= 8) emoji = '😄';
        else if (mood_value >= 6) emoji = '🙂';
        else if (mood_value <= 3) emoji = '😔';

        await db.query(
            'INSERT INTO mood_logs (user_id, mood_value, mood_emoji, mood_note) VALUES (?, ?, ?, ?)',
            [userId, mood_value, emoji, mood_note]
        );

        res.status(201).json({ message: 'Mood logged successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMoodHistory = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const [rows] = await db.query(
            'SELECT * FROM mood_logs WHERE user_id = ? ORDER BY log_timestamp DESC LIMIT 10',
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};