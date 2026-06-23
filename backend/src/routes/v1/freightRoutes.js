const express = require('express');
const { protect } = require('../../middleware/auth');
const { restrictTo } = require('../../middleware/rbac');
const {
    createOrder,
    getOrders,
    matchReturnLoad,
    uploadCustomsDoc,
} = require('../../controllers/freightController');

const router = express.Router();

// Public route (no authentication required – optional)
router.get('/orders', getOrders);

// Protected routes
router.post('/orders', protect, createOrder);
router.post('/orders/:id/match', protect, restrictTo('driver', 'super_admin'), matchReturnLoad);
router.post('/documents', protect, uploadCustomsDoc);

module.exports = router;