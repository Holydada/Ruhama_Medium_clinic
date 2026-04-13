"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nurseController = exports.NurseController = void 0;
const nurse_service_1 = require("../services/nurse.service");
class NurseController {
    // ============================================
    // TRIAGE
    // ============================================
    async createTriage(req, res) {
        try {
            const triageData = {
                ...req.body,
                triageById: req.user.id,
            };
            const triage = await nurse_service_1.nurseService.createTriageRecord(triageData);
            res.status(201).json({
                success: true,
                data: triage,
                message: 'Triage record created successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getTriageQueue(req, res) {
        try {
            const { triageLevel, routedTo, date } = req.query;
            const queue = await nurse_service_1.nurseService.getTriageQueue({
                triageLevel: triageLevel,
                routedTo: routedTo,
                date: date ? new Date(date) : undefined,
            });
            res.json({
                success: true,
                data: queue,
                count: queue.length,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    // ============================================
    // VITAL SIGNS
    // ============================================
    async recordVitalSigns(req, res) {
        try {
            const vitalData = {
                ...req.body,
                recordedById: req.user.id,
            };
            const vitals = await nurse_service_1.nurseService.recordVitalSigns(vitalData);
            res.status(201).json({
                success: true,
                data: vitals,
                message: 'Vital signs recorded successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getVitalSignsHistory(req, res) {
        try {
            const { patientId } = req.params;
            const { visitId } = req.query;
            const history = await nurse_service_1.nurseService.getVitalSignsHistory(patientId, visitId);
            res.json({
                success: true,
                data: history,
                count: history.length,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    // ============================================
    // NURSING NOTES
    // ============================================
    async createNursingNote(req, res) {
        try {
            const noteData = {
                ...req.body,
                createdById: req.user.id,
            };
            const note = await nurse_service_1.nurseService.createNursingNote(noteData);
            res.status(201).json({
                success: true,
                data: note,
                message: 'Nursing note created successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async updateNursingNote(req, res) {
        try {
            const { id } = req.params;
            const note = await nurse_service_1.nurseService.updateNursingNote(id, req.body);
            res.json({
                success: true,
                data: note,
                message: 'Nursing note updated successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async lockNursingNote(req, res) {
        try {
            const { id } = req.params;
            const note = await nurse_service_1.nurseService.lockNursingNote(id);
            res.json({
                success: true,
                data: note,
                message: 'Nursing note locked successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getNursingNotes(req, res) {
        try {
            const { visitId } = req.params;
            const notes = await nurse_service_1.nurseService.getNursingNotes(visitId);
            res.json({
                success: true,
                data: notes,
                count: notes.length,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    // ============================================
    // INJECTION ROOM
    // ============================================
    async getInjectionQueue(req, res) {
        try {
            const { status, date } = req.query;
            const queue = await nurse_service_1.nurseService.getInjectionQueue({
                status: status,
                date: date ? new Date(date) : undefined,
            });
            res.json({
                success: true,
                data: queue,
                count: queue.length,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async administerInjection(req, res) {
        try {
            const administrationData = {
                ...req.body,
                administeredById: req.user.id,
            };
            const administration = await nurse_service_1.nurseService.administerInjection(administrationData);
            res.status(201).json({
                success: true,
                data: administration,
                message: 'Injection administered successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    // ============================================
    // OBSERVATION BOARD
    // ============================================
    async getObservationBoard(req, res) {
        try {
            const { location } = req.query;
            const board = await nurse_service_1.nurseService.getObservationBoard(location);
            res.json({
                success: true,
                data: board,
                count: board.length,
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
exports.NurseController = NurseController;
exports.nurseController = new NurseController();
//# sourceMappingURL=nurse.controller.js.map