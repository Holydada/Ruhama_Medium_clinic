"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionController = void 0;
const prescription_service_1 = require("../services/prescription.service");
const prescriptionService = new prescription_service_1.PrescriptionService();
class PrescriptionController {
    async createPrescription(req, res) {
        try {
            const prescription = await prescriptionService.createPrescription({
                ...req.body,
                doctorId: req.user.id,
            });
            res.status(201).json({
                success: true,
                message: 'Prescription created successfully',
                data: prescription,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getPrescriptions(req, res) {
        try {
            const { page, limit, status, patientId, doctorId, date } = req.query;
            const result = await prescriptionService.getPrescriptions({
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                status: status,
                patientId: patientId,
                doctorId: doctorId,
                date: date,
            });
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getPrescriptionById(req, res) {
        try {
            const prescription = await prescriptionService.getPrescriptionById(req.params.id);
            res.json({
                success: true,
                data: prescription,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    async dispensePrescription(req, res) {
        try {
            const prescription = await prescriptionService.dispensePrescription(req.params.id, req.user.id, {
                labelPrinted: Boolean(req.body?.labelPrinted),
                substitutionMade: Boolean(req.body?.substitutionMade),
                substitutionReason: req.body?.substitutionReason,
                counselProvided: Boolean(req.body?.counselProvided),
                notes: req.body?.notes,
            });
            res.json({
                success: true,
                message: 'Prescription dispensed successfully',
                data: prescription,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async cancelPrescription(req, res) {
        try {
            const prescription = await prescriptionService.cancelPrescription(req.params.id);
            res.json({
                success: true,
                message: 'Prescription cancelled',
                data: prescription,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getPrescriptionQueue(req, res) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : undefined;
            const prescriptions = await prescriptionService.getPrescriptionQueue({
                limit: Number.isFinite(limit) ? limit : undefined,
            });
            res.json({
                success: true,
                data: prescriptions,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
}
exports.PrescriptionController = PrescriptionController;
//# sourceMappingURL=prescription.controller.js.map