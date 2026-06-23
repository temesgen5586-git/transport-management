const express = require('express');
const router = express.Router();

// Import all controllers
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const tripController = require('../controllers/tripController');
const bookingController = require('../controllers/bookingController');
const walletController = require('../controllers/walletController');
const emergencyController = require('../controllers/emergencyController');
const auditController = require('../controllers/auditController');
const driverController = require('../controllers/driverController');
const freightController = require('../controllers/freightController');

// Import middleware
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/rbac');

// =============================================================================
// AUTH ROUTES
// =============================================================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);

// =============================================================================
// ADMIN ROUTES
// =============================================================================
router.use('/admin', protect, restrictTo('super_admin', 'dispatcher'));

// 🆕 Get users (filter by role via query param)
router.get('/admin/users', adminController.getUsers);

// Create user with role
router.post('/admin/users', adminController.createUserByAdmin);

// Cities
router.post('/admin/cities', adminController.addCity);
router.get('/admin/cities', adminController.getCities);
router.put('/admin/cities/:id', adminController.updateCity);
router.delete('/admin/cities/:id', adminController.deleteCity);

// Routes
router.post('/admin/routes', adminController.createRoute);
router.get('/admin/routes', adminController.getRoutes);
router.put('/admin/routes/:id', adminController.updateRoute);
router.delete('/admin/routes/:id', adminController.deleteRoute);

// Vehicles
router.post('/admin/vehicles', adminController.registerVehicle);
router.get('/admin/vehicles', adminController.getVehicles);
router.put('/admin/vehicles/:id', adminController.updateVehicle);
router.delete('/admin/vehicles/:id', adminController.deleteVehicle);

// Dashboard Stats
router.get('/admin/stats', adminController.getDashboardStats);

// =============================================================================
// TRIP ROUTES
// =============================================================================
router.post('/trips', protect, restrictTo('super_admin', 'dispatcher'), tripController.scheduleTrip);
router.get('/trips', protect, tripController.getTrips);
router.get('/trips/live', protect, tripController.getLiveTrips);
router.post('/trips/:id/depart', protect, restrictTo('driver'), tripController.driverDepart);
router.post('/trips/:id/complete', protect, restrictTo('driver'), tripController.completeTrip);

// =============================================================================
// BOOKING ROUTES
// =============================================================================
router.post('/bookings', protect, bookingController.createBooking);
router.get('/bookings', protect, bookingController.getBookings);
router.get('/bookings/:id', protect, bookingController.getBooking);
router.patch('/bookings/:id/checkin', protect, restrictTo('dispatcher', 'driver'), bookingController.checkinBooking);

// =============================================================================
// WALLET ROUTES
// =============================================================================
router.get('/wallet/balance', protect, walletController.getBalance);
router.get('/wallet/history', protect, walletController.getHistory);
router.post('/wallet/deposit', protect, walletController.initiateDeposit);
router.post('/wallet/refund', protect, walletController.refundBooking);

// =============================================================================
// EMERGENCY ROUTES
// =============================================================================
router.post('/emergency', protect, restrictTo('driver'), emergencyController.handleEmergency);
router.get('/emergency/logs', protect, restrictTo('super_admin', 'auditor'), emergencyController.getEmergencyLogs);

// =============================================================================
// AUDIT ROUTES
// =============================================================================
router.get('/audit/logs', protect, restrictTo('auditor', 'super_admin'), auditController.getAuditLogs);
router.get('/audit/export', protect, restrictTo('auditor', 'super_admin'), auditController.exportAuditLogs);

// =============================================================================
// DRIVER ROUTES
// =============================================================================
router.get('/driver/trips', protect, restrictTo('driver'), driverController.getManifest);
router.get('/driver/settlements', protect, restrictTo('driver'), driverController.getSettlements);
router.post('/driver/payout/request', protect, restrictTo('driver'), driverController.requestPayout);

// =============================================================================
// FREIGHT ROUTES
// =============================================================================
router.get('/freight/orders', protect, freightController.getOrders);
router.post('/freight/orders', protect, freightController.createOrder);
router.post('/freight/orders/:id/match', protect, restrictTo('driver', 'super_admin'), freightController.matchReturnLoad);
router.post('/freight/documents', protect, freightController.uploadCustomsDoc);

module.exports = router;