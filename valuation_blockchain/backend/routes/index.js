const express = require('express');
const assessmentRoutes = require('./assessment');
const taxRoutes = require('./tax');
const transferRoutes = require('./transfer');
const legalSummaryRoutes = require('./legalSummary');

const router = express.Router();

router.use(assessmentRoutes);
router.use(taxRoutes);
router.use(transferRoutes);
router.use(legalSummaryRoutes);

module.exports = router;
