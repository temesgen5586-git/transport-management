const express = require('express');
const { protect } = require('../../middleware/auth');
const { restrictTo } = require('../../middleware/rbac');
const { getAuditLogs, exportAuditLogs } = require('../../controllers/auditController');

const router = express.Router();

router.use(protect, restrictTo('auditor', 'super_admin'));

router.get('/logs', getAuditLogs);
router.get('/export', exportAuditLogs);

module.exports = router;