"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabController = void 0;
const lab_service_1 = require("../services/lab.service");
const labService = new lab_service_1.LabService();
class LabController {
    // Lab Test Management
    async createLabTest(req, res) {
        try {
            const test = await labService.createLabTest(req.body);
            res.status(201).json({
                success: true,
                message: 'Lab test created successfully',
                data: test,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getLabTests(req, res) {
        try {
            const { search, category, isActive, page, limit } = req.query;
            const result = await labService.getLabTests({
                search: search,
                category: category,
                isActive: isActive === 'true',
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });
            res.json({
                success: true,
                data: result.tests,
                ...(page || limit ? { pagination: result.pagination } : {}),
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Lab Order Management
    async createLabOrder(req, res) {
        try {
            const order = await labService.createLabOrder({
                ...req.body,
                orderedById: req.user.id,
            });
            res.status(201).json({
                success: true,
                message: 'Lab order created successfully',
                data: order,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getLabOrders(req, res) {
        try {
            const { page, limit, status, priority, patientId, date } = req.query;
            const result = await labService.getLabOrders({
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                status: status,
                priority: priority,
                patientId: patientId,
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
    async getLabOrderById(req, res) {
        try {
            const order = await labService.getLabOrderById(req.params.id);
            res.json({
                success: true,
                data: order,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    async updateLabOrderStatus(req, res) {
        try {
            const { status } = req.body;
            const order = await labService.updateLabOrderStatus(req.params.id, status);
            res.json({
                success: true,
                message: 'Lab order status updated',
                data: order,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async updateLabResult(req, res) {
        try {
            const item = await labService.updateLabResult(req.params.itemId, req.body);
            res.json({
                success: true,
                message: 'Lab result updated',
                data: item,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async verifyLabOrder(req, res) {
        try {
            const order = await labService.verifyLabOrder(req.params.id, req.user.id);
            res.json({
                success: true,
                message: 'Lab order verified',
                data: order,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getLabQueue(req, res) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : undefined;
            const orders = await labService.getLabQueue({
                limit: Number.isFinite(limit) ? limit : undefined,
            });
            res.json({
                success: true,
                data: orders,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    async addLabArtifact(req, res) {
        try {
            const { name, url, type, notes } = req.body;
            if (!name || !url) {
                res.status(400).json({
                    success: false,
                    error: 'name and url are required',
                });
                return;
            }
            const artifact = await labService.addLabArtifact(req.params.id, req.user.id, {
                name,
                url,
                type,
                notes,
            });
            res.status(201).json({
                success: true,
                data: artifact,
                message: 'Lab artifact added',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getLabArtifacts(req, res) {
        try {
            const artifacts = await labService.getLabArtifacts(req.params.id);
            res.json({
                success: true,
                data: artifacts,
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
exports.LabController = LabController;
//# sourceMappingURL=lab.controller.js.map