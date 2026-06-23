const cron = require('node-cron');
const { pool } = require('../config/db');

const checkDelayedTrips = async () => {
    // ... your logic
};

const checkMaintenance = async () => {
    // ... your logic
};

const startCronJobs = () => {
    cron.schedule('*/5 * * * *', checkDelayedTrips);
    cron.schedule('0 6 * * *', checkMaintenance);
    console.log('⏰ Cron jobs scheduled.');
};

module.exports = { startCronJobs };   // ← MUST export as an object