const express = require('express');
const authRoutes = require('./v1/authRoutes');
const adminRoutes = require('./v1/adminRoutes');
const tripRoutes = require('./v1/tripRoutes');
const bookingRoutes = require('./v1/bookingRoutes');
const walletRoutes = require('./v1/walletRoutes');
const emergencyRoutes = require('./v1/emergencyRoutes');
const auditRoutes = require('./v1/auditRoutes');
const driverRoutes = require('./v1/driverRoutes');
const freightRoutes = require('./v1/freightRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/wallet', walletRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/audit', auditRoutes);
router.use('/driver', driverRoutes);
router.use('/freight', freightRoutes);

module.exports = router;



