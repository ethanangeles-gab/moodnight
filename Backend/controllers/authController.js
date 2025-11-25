const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // The MySQL connection pool

// --- Helper function for input validation (Basic) ---
const validateAuthInput = (full_name, email, password) => {
    if (!full_name || !email || !password) {
        return "All fields are required.";
    }
    if (password.length < 8) {
        return "Password must be at least 8 characters.";
    }
    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Invalid email format.";
    }
    return null; // Input is valid
};


// 1. Controller for POST /api/auth/register
exports.registerUser = async (req, res) => {
    const { full_name, email, password } = req.body;
    const validationError = validateAuthInput(full_name, email, password);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user into the database
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
            [full_name, email, password_hash]
        );

        // Success response
        res.status(201).json({ 
            message: 'User registered successfully.', 
            userId: result.insertId 
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};


// 2. Controller for POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    // Basic check
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const [users] = await db.query('SELECT user_id, full_name, password_hash FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Passwords match. Generate JWT Token.
        const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // Success response
        res.json({
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: email
            },
            message: 'Login successful.'
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
};