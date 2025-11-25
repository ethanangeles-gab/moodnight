-- DDL for MoodNight Application using MySQL

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS moodnight_db;
USE moodnight_db;

-- 2. users Table: Stores user authentication and profile data.
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- Email must be unique for login
    password_hash VARCHAR(255) NOT NULL, -- Stores the secure bcrypt hash
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. journal_entries Table: Stores the private journal content.
CREATE TABLE IF NOT EXISTS journal_entries (
    journal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100),
    content TEXT NOT NULL, -- TEXT is suitable for long-form entries
    entry_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- DATETIME for precision
    sentiment_score DECIMAL(3, 2), -- Stores the NLP-derived sentiment (-1.00 to 1.00)
    
    -- Foreign Key Constraint: Links the entry to its owner
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. mood_logs Table: Stores mood tracking events independently.
-- The MOOD_LOG table is linked directly to USER, allowing users to log moods without a journal entry.
CREATE TABLE IF NOT EXISTS mood_logs (
    mood_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood_value INT NOT NULL CHECK (mood_value BETWEEN 1 AND 10), -- The 1-10 numerical score
    mood_emoji VARCHAR(10), -- Stores the visual indicator (e.g., 😄)
    mood_note VARCHAR(255), -- Stores context/triggers (optional short note)
    log_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- Precise time of logging
    
    -- Foreign Key Constraint: Links the mood log to its owner
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);