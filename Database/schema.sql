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

--Insert sample data for testing
USE moodnight_db;

-- 1. Insert Sample Users (Password is 'password123' hashed)
INSERT INTO users (full_name, email, password_hash) VALUES 
('Alice Walker', 'alice@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'), -- Placeholder hash
('Bob Smith', 'bob@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'),
('Charlie Brown', 'charlie@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'),
('Diana Prince', 'diana@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'),
('Evan Wright', 'evan@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'),
('Fiona Gallagher', 'fiona@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'),
('George Martin', 'george@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'),
('Hannah Baker', 'hannah@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'),
('Ian Somerhalder', 'ian@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1'),
('Jane Doe', 'jane@example.com', '$2a$10$N.zmdrAM5.wS7.qF7.1.ue.1.1.1.1.1.1.1.1.1.1.1.1.1');

-- 2. Insert Sample Mood Logs (Linked to User ID 1 for testing)
INSERT INTO mood_logs (user_id, mood_value, mood_emoji, mood_note) VALUES
(1, 8, '😄', 'Had a great start to the day!'),
(1, 6, '😐', 'Work was tiring but okay.'),
(1, 9, '🥳', 'Celebrated a friend birthday.'),
(1, 4, '😔', 'Feeling a bit under the weather.'),
(1, 7, '🙂', 'Productive afternoon.'),
(1, 3, '😫', 'Very stressful meeting.'),
(1, 8, '😌', 'Relaxing evening walk.'),
(1, 5, '🤔', 'Confused about the project.'),
(1, 9, '😁', 'Got good news!'),
(1, 7, '😊', 'Dinner was delicious.');

-- 3. Insert Sample Journal Entries (Linked to User ID 1)
INSERT INTO journal_entries (user_id, title, content, sentiment_score) VALUES
(1, 'Morning Thoughts', 'I woke up feeling refreshed today.', 0.85),
(1, 'Work Update', 'The meeting went better than expected.', 0.60),
(1, 'Rainy Day', 'I love the sound of rain against the window.', 0.75),
(1, 'Anxiety', 'I am worried about the upcoming deadline.', -0.40),
(1, 'Gratitude', 'Thankful for my supportive friends.', 0.90),
(1, 'Ideas', 'Thinking about starting a new hobby.', 0.50),
(1, 'Frustration', 'My car broke down today.', -0.80),
(1, 'Recovery', 'Finally feeling better after the flu.', 0.30),
(1, 'Weekend Plans', 'Going to the beach this weekend!', 0.95),
(1, 'Reflection', 'Looking back on the month, I have grown a lot.', 0.70);