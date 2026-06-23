const express = require('express');
const { protect } = require('../../middleware/auth');
const { restrictTo } = require('../../middleware/rbac');
const {
    getManifest,
    getSettlements,
    requestPayout,
} = require('../../controllers/driverController');

const router = express.Router();

router.use(protect, restrictTo('driver'));

router.get('/trips', getManifest);
router.get('/settlements', getSettlements);
router.post('/payout/request', requestPayout);

module.exports = router;