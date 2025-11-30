const express = require('express');
const cors = require('cors'); 
const path = require('path'); // <-- ADDED: For handling file paths
require('dotenv').config(); 

// Import the MySQL connection pool setup
const db = require('./db');

// Import authentication routes (Week 1 requirement)
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();
// Changed default port to 3006 for consistency with previous frontend code
const PORT = process.env.PORT || 3006; 

// --- Middleware ---

// 1. Enable CORS for the frontend to communicate with the backend
app.use(cors());

// 2. Parse incoming JSON payloads
app.use(express.json());

// 3. Serve Static Frontend Files (HTML, CSS, JS) <-- ADDED
// Assumes the Frontend folder is one level up from the Backend folder
app.use(express.static(path.join(__dirname, '../Frontend'))); 

// --- API Routes ---

// Authentication Routes (POST /api/auth/register, POST /api/auth/login)
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes); // New Route
app.use('/api/mood', moodRoutes);       // New Route

// General health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'MoodNight API is running successfully.' });
});

// --- Server Startup ---

app.listen(PORT, () => {
    console.log(`\n🌙 MoodNight API server running on http://localhost:${PORT}`);
    
    // Test the database connection pool upon startup
    db.getConnection()
        .then(connection => {
            console.log(`✅ Database connection successful to ${process.env.DB_NAME || 'DB'}!`);
            connection.release(); 
        })
        .catch(err => {
            console.error('❌ Database connection failed:', err.message);
        });
});