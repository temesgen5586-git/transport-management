const express = require('express');
const { protect } = require('../../middleware/auth');
const {
    getBalance,
    getHistory,
    initiateDeposit,
    refundBooking,
} = require('../../controllers/walletController');

const router = express.Router();

// All wallet routes require authentication
router.use(protect);

// Balance & history
router.get('/balance', getBalance);
router.get('/history', getHistory);

// Deposits & refunds
router.post('/deposit', initiateDeposit);
router.post('/refund', refundBooking);

module.exports = router;