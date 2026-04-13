"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitController = void 0;
const visit_service_1 = require("../services/visit.service");
const visitService = new visit_service_1.VisitService();
class VisitController {
    async createVisit(req, res) {
        try {
            const visit = await visitService.createVisit({
                ...req.body,
                registeredById: req.user.id,
            });
            res.status(201).json({
                success: true,
                message: 'Visit created successfully',
                data: visit,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getVisits(req, res) {
        try {
            const { page, limit, date, status, doctorId, serviceType, unassignedOnly } = req.query;
            const result = await visitService.getVisits({
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                date: date,
                status: status,
                doctorId: doctorId,
                serviceType: serviceType,
                unassignedOnly: unassignedOnly === 'true' || unassignedOnly === '1',
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
    async getVisitById(req, res) {
        try {
            const visit = await visitService.getVisitById(req.params.id);
            res.json({
                success: true,
                data: visit,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    async updateVisitStatus(req, res) {
        try {
            const { status } = req.body;
            const visit = await visitService.updateVisitStatus(req.params.id, status);
            res.json({
                success: true,
                message: 'Visit status updated',
                data: visit,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async assignDoctor(req, res) {
        try {
            const { doctorId } = req.body;
            const visit = await visitService.assignDoctor(req.params.id, doctorId);
            res.json({
                success: true,
                message: 'Doctor assigned successfully',
                data: visit,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async saveSoapNote(req, res) {
        try {
            const result = await visitService.saveSoapNote(req.params.id, req.user.id, req.body);
            res.json({
                success: true,
                message: 'SOAP note saved successfully',
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
    async getEncounterTimeline(req, res) {
        try {
            const timeline = await visitService.getEncounterTimeline(req.params.id);
            res.json({
                success: true,
                data: timeline,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async recordNurseVitals(req, res) {
        try {
            const result = await visitService.recordNurseVitals(req.params.id, req.user.id, req.body);
            res.status(201).json({
                success: true,
                message: 'Vital signs recorded',
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
}
exports.VisitController = VisitController;
//# sourceMappingURL=visit.controller.js.map