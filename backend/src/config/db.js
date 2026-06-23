const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'transport',
    password: process.env.DATABASE_PASSWORD || 'transport',
    database: process.env.DATABASE_NAME || 'transport',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
};

// Create the pool directly (not inside a function)
const pool = mysql.createPool(dbConfig);

// Optional: test connection on startup
pool.getConnection()
    .then(conn => {
        console.log(`🔗 Connected to MySQL database "${dbConfig.database}" on ${dbConfig.host}:${dbConfig.port}`);
        conn.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    });

// Helper function to execute queries
const query = async (sql, params) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
};

// Export both the pool and the query helper
module.exports = {
    pool,
    query,
};