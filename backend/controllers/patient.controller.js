"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientController = exports.PatientController = void 0;
const patient_service_1 = require("../services/patient.service");
const patientService = new patient_service_1.PatientService();
class PatientController {
    async createPatient(req, res) {
        try {
            const patient = await patientService.createPatient(req.body, req.user.id);
            res.status(201).json({
                success: true,
                message: 'Patient registered successfully',
                data: patient,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getPatients(req, res) {
        try {
            const { page, limit, search } = req.query;
            const result = await patientService.getPatients({
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                search: search,
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
    async getPatientById(req, res) {
        try {
            const patient = await patientService.getPatientById(req.params.id);
            res.json({
                success: true,
                data: patient,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    async updatePatient(req, res) {
        try {
            const patient = await patientService.updatePatient(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Patient updated successfully',
                data: patient,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getPatientHistory(req, res) {
        try {
            const history = await patientService.getPatientHistory(req.params.id);
            res.json({
                success: true,
                data: history,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    async deletePatient(req, res) {
        try {
            const result = await patientService.deletePatient(req.params.id);
            res.json({
                success: true,
                message: 'Patient deleted successfully',
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async checkDuplicates(req, res) {
        try {
            const { fullName, dateOfBirth, phone } = req.body;
            if (!fullName) {
                res.status(400).json({
                    success: false,
                    error: 'fullName is required',
                });
                return;
            }
            const matches = await patientService.checkDuplicates({
                fullName,
                dateOfBirth,
                phone,
            });
            res.json({
                success: true,
                data: {
                    matches,
                    count: matches.length,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    async archivePatient(req, res) {
        try {
            const { reason } = req.body;
            if (!reason || !reason.trim()) {
                res.status(400).json({
                    success: false,
                    error: 'Archive reason is required',
                });
                return;
            }
            const patient = await patientService.archivePatient(req.params.id, reason, req.user.id);
            res.json({
                success: true,
                message: 'Patient archived successfully',
                data: patient,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async restorePatient(req, res) {
        try {
            const patient = await patientService.restorePatient(req.params.id);
            res.json({
                success: true,
                message: 'Patient restored successfully',
                data: patient,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async completeRegistration(req, res) {
        try {
            const patient = await patientService.completeRegistration(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Patient registration completed successfully',
                data: patient,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getPatientVisits(req, res) {
        try {
            const { patientId } = req.params;
            const visits = await patientService.getPatientVisits(patientId);
            res.json({
                success: true,
                data: visits,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getPatientLabResults(req, res) {
        try {
            const { patientId } = req.params;
            const results = await patientService.getPatientLabResults(patientId);
            res.json({
                success: true,
                data: results,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getPatientPrescriptions(req, res) {
        try {
            const { patientId } = req.params;
            const prescriptions = await patientService.getPatientPrescriptions(patientId);
            res.json({
                success: true,
                data: prescriptions,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getPatientVitals(req, res) {
        try {
            const { patientId } = req.params;
            const vitals = await patientService.getPatientVitals(patientId);
            res.json({
                success: true,
                data: vitals,
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
exports.PatientController = PatientController;
exports.patientController = new PatientController();
//# sourceMappingURL=patient.controller.js.map