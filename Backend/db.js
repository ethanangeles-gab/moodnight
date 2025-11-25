const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env

// Create the MySQL connection pool configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // Wait for connection to be available
    connectionLimit: 10,       // Maximum number of concurrent connections
    queueLimit: 0              // No limit on connection queue
});

console.log(`MySQL connection pool configured for database: ${process.env.DB_NAME}`);

// Export the pool. Controllers will use pool.query() to execute SQL commands.
module.exports = pool;