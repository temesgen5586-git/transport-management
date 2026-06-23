const express = require('express');
const { protect } = require('../../middleware/auth');
const { restrictTo } = require('../../middleware/rbac');
const {
    scheduleTrip,
    getTrips,
    getLiveTrips,
    driverDepart,
    completeTrip,
} = require('../../controllers/tripController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Scheduling (admin/dispatcher only)
router.post('/', restrictTo('super_admin', 'dispatcher'), scheduleTrip);

// List trips (all authenticated users)
router.get('/', getTrips);

// Real-time tracking
router.get('/live', getLiveTrips);

// Driver actions (driver only)
router.post('/:id/depart', restrictTo('driver'), driverDepart);
router.post('/:id/complete', restrictTo('driver'), completeTrip);

module.exports = router;