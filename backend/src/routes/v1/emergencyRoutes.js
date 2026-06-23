const express = require('express');
const { protect } = require('../../middleware/auth');
const { restrictTo } = require('../../middleware/rbac');
const {
    handleEmergency,
    getEmergencyLogs,
} = require('../../controllers/emergencyController');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('driver'), handleEmergency);
router.get('/logs', restrictTo('super_admin', 'auditor'), getEmergencyLogs);

module.exports = router;