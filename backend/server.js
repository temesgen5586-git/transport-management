const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { startCronJobs } = require('./src/services/cronService');
const { globalErrorHandler } = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
const apiRoutes = require('./src/routes');
app.use('/api/v1', apiRoutes);

// 404 handler
app.all('*', (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.SERVER_PORT || 5000;

// Start server (db connection is already tested in db.js)
app.listen(PORT, () => {
    console.log(`🚀 EthioTrans API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    startCronJobs();
    console.log('⏰ Cron jobs initialized.');
});