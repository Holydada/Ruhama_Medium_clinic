"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const quality_assurance_service_1 = require("../services/quality-assurance.service");
const router = (0, express_1.Router)();
// Run health checks
router.get('/health-checks', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), async (req, res) => {
    try {
        const checks = await quality_assurance_service_1.qaService.runHealthChecks();
        res.json({ checks });
    }
    catch (error) {
        console.error('Health checks error:', error);
        res.status(500).json({ error: 'Failed to run health checks' });
    }
});
// Generate QA report
router.get('/report', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), async (req, res) => {
    try {
        const report = await quality_assurance_service_1.qaService.generateReport();
        res.json(report);
    }
    catch (error) {
        console.error('QA report error:', error);
        res.status(500).json({ error: 'Failed to generate QA report' });
    }
});
// Auto-fix issues
router.post('/auto-fix', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), async (req, res) => {
    try {
        const result = await quality_assurance_service_1.qaService.autoFix();
        res.json(result);
    }
    catch (error) {
        console.error('Auto-fix error:', error);
        res.status(500).json({ error: 'Failed to auto-fix issues' });
    }
});
exports.default = router;
//# sourceMappingURL=qa.routes.js.map