"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergencyController = exports.EmergencyController = void 0;
const emergency_service_1 = require("../services/emergency.service");
class EmergencyController {
    // ============================================
    // EMERGENCY CASE MANAGEMENT
    // ============================================
    async createEmergencyCase(req, res) {
        try {
            const caseData = {
                ...req.body,
                registeredById: req.user.id,
            };
            const emergencyCase = await emergency_service_1.emergencyService.createEmergencyCase(caseData);
            res.status(201).json({
                success: true,
                data: emergencyCase,
                message: 'Emergency case created successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async updateEmergencyCase(req, res) {
        try {
            const { id } = req.params;
            const emergencyCase = await emergency_service_1.emergencyService.updateEmergencyCase(id, req.body);
            res.json({
                success: true,
                data: emergencyCase,
                message: 'Emergency case updated successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async setDisposition(req, res) {
        try {
            const { id } = req.params;
            const emergencyCase = await emergency_service_1.emergencyService.setDisposition(id, req.body);
            res.json({
                success: true,
                data: emergencyCase,
                message: 'Disposition set successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async convertToFullRegistration(req, res) {
        try {
            const { id } = req.params;
            const patientData = {
                ...req.body,
                registeredById: req.user.id,
            };
            const result = await emergency_service_1.emergencyService.convertToFullRegistration(id, patientData);
            res.json({
                success: true,
                data: result,
                message: 'Emergency case converted to full patient registration',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getActiveEmergencyCases(req, res) {
        try {
            const cases = await emergency_service_1.emergencyService.getActiveEmergencyCases();
            res.json({
                success: true,
                data: cases,
                count: cases.length,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getEmergencyCaseById(req, res) {
        try {
            const { id } = req.params;
            const emergencyCase = await emergency_service_1.emergencyService.getEmergencyCaseById(id);
            if (!emergencyCase) {
                res.status(404).json({
                    success: false,
                    message: 'Emergency case not found',
                });
                return;
            }
            res.json({
                success: true,
                data: emergencyCase,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getEmergencyStatistics(req, res) {
        try {
            const { dateFrom, dateTo } = req.query;
            const stats = await emergency_service_1.emergencyService.getEmergencyStatistics(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.EmergencyController = EmergencyController;
exports.emergencyController = new EmergencyController();
//# sourceMappingURL=emergency.controller.js.map