const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');
    
    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token (Remove 'Bearer ' if sent by frontend, though usually headers handle it)
        // If you send "Bearer <token>", use: token.split(' ')[1]
        // But for simplicity with your frontend code below, we assume direct token or handle both:
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        req.user = decoded; // Add user payload to request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};