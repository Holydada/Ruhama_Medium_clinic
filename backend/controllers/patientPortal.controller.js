"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientPortalDashboard = void 0;
const patientPortal_service_1 = require("../services/patientPortal.service");
const service = new patientPortal_service_1.PatientPortalService();
const getPatientPortalDashboard = async (req, res) => {
    try {
        const data = await service.getDashboard(req.user.id, {
            ipAddress: req.ip,
            userAgent: req.get('user-agent') || undefined,
        });
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to load portal',
        });
    }
};
exports.getPatientPortalDashboard = getPatientPortalDashboard;
//# sourceMappingURL=patientPortal.controller.js.map