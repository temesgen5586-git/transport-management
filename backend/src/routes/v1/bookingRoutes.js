const express = require('express');
const { protect } = require('../../middleware/auth');
const { restrictTo } = require('../../middleware/rbac');
const {
    createBooking,
    getBookings,
    getBooking,
    checkinBooking,
} = require('../../controllers/bookingController');

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBooking);

router.patch('/:id/checkin', restrictTo('dispatcher', 'driver'), checkinBooking);

module.exports = router;