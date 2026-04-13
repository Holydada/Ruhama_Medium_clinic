"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const data_export_service_1 = require("../services/data-export.service");
const router = (0, express_1.Router)();
// Export patients
router.get('/patients', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN', 'RECEPTION']), async (req, res) => {
    try {
        const buffer = await data_export_service_1.dataExportService.exportPatientsToExcel();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=patients_${Date.now()}.xlsx`);
        res.send(buffer);
    }
    catch (error) {
        console.error('Export patients error:', error);
        res.status(500).json({ error: 'Failed to export patients' });
    }
});
// Export visits
router.get('/visits', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN', 'RECEPTION']), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const buffer = await data_export_service_1.dataExportService.exportVisitsToExcel(new Date(startDate), new Date(endDate));
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=visits_${Date.now()}.xlsx`);
        res.send(buffer);
    }
    catch (error) {
        console.error('Export visits error:', error);
        res.status(500).json({ error: 'Failed to export visits' });
    }
});
// Export financial report
router.get('/financial', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN', 'FINANCE']), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const buffer = await data_export_service_1.dataExportService.exportFinancialReport(new Date(startDate), new Date(endDate));
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=financial_report_${Date.now()}.xlsx`);
        res.send(buffer);
    }
    catch (error) {
        console.error('Export financial report error:', error);
        res.status(500).json({ error: 'Failed to export financial report' });
    }
});
// Export lab orders
router.get('/lab-orders', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN', 'LAB_TECH']), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const buffer = await data_export_service_1.dataExportService.exportLabOrdersToExcel(new Date(startDate), new Date(endDate));
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=lab_orders_${Date.now()}.xlsx`);
        res.send(buffer);
    }
    catch (error) {
        console.error('Export lab orders error:', error);
        res.status(500).json({ error: 'Failed to export lab orders' });
    }
});
// Export prescriptions
router.get('/prescriptions', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN', 'PHARMACIST']), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const buffer = await data_export_service_1.dataExportService.exportPrescriptionsToExcel(new Date(startDate), new Date(endDate));
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=prescriptions_${Date.now()}.xlsx`);
        res.send(buffer);
    }
    catch (error) {
        console.error('Export prescriptions error:', error);
        res.status(500).json({ error: 'Failed to export prescriptions' });
    }
});
// Export inventory
router.get('/inventory', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN', 'PHARMACIST']), async (req, res) => {
    try {
        const buffer = await data_export_service_1.dataExportService.exportInventoryToExcel();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=inventory_${Date.now()}.xlsx`);
        res.send(buffer);
    }
    catch (error) {
        console.error('Export inventory error:', error);
        res.status(500).json({ error: 'Failed to export inventory' });
    }
});
// Generate patient report PDF
router.get('/patient-report/:patientId', auth_1.authenticate, async (req, res) => {
    try {
        const { patientId } = req.params;
        const buffer = await data_export_service_1.dataExportService.generatePatientReportPDF(patientId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=patient_report_${patientId}.pdf`);
        res.send(buffer);
    }
    catch (error) {
        console.error('Generate patient report error:', error);
        res.status(500).json({ error: 'Failed to generate patient report' });
    }
});
exports.default = router;
//# sourceMappingURL=export.routes.js.map