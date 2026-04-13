"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUltrasoundArtifacts = exports.addUltrasoundArtifact = exports.getScheduledUltrasounds = exports.updateUltrasoundStatus = exports.getUltrasoundOrderById = exports.getUltrasoundOrders = exports.createUltrasoundOrder = void 0;
const ultrasound_service_1 = require("../services/ultrasound.service");
const ultrasoundService = new ultrasound_service_1.UltrasoundService();
const createUltrasoundOrder = async (req, res) => {
    try {
        const order = await ultrasoundService.createUltrasoundOrder({
            ...req.body,
            orderedById: req.user.id,
        });
        res.status(201).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create ultrasound order',
        });
    }
};
exports.createUltrasoundOrder = createUltrasoundOrder;
const getUltrasoundOrders = async (req, res) => {
    try {
        const result = await ultrasoundService.getUltrasoundOrders(req.query);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch ultrasound orders',
        });
    }
};
exports.getUltrasoundOrders = getUltrasoundOrders;
const getUltrasoundOrderById = async (req, res) => {
    try {
        const order = await ultrasoundService.getUltrasoundOrderById(req.params.id);
        res.json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: error.message || 'Ultrasound order not found',
        });
    }
};
exports.getUltrasoundOrderById = getUltrasoundOrderById;
const updateUltrasoundStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await ultrasoundService.updateUltrasoundStatus(req.params.id, status);
        res.json({
            success: true,
            data: order,
            message: 'Ultrasound status updated',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update ultrasound status',
        });
    }
};
exports.updateUltrasoundStatus = updateUltrasoundStatus;
const getScheduledUltrasounds = async (req, res) => {
    try {
        const { date } = req.query;
        const orders = await ultrasoundService.getScheduledUltrasounds(date);
        res.json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch scheduled ultrasounds',
        });
    }
};
exports.getScheduledUltrasounds = getScheduledUltrasounds;
const addUltrasoundArtifact = async (req, res) => {
    try {
        const { name, url, type, notes } = req.body;
        if (!name || !url) {
            res.status(400).json({ success: false, error: 'name and url are required' });
            return;
        }
        const artifact = await ultrasoundService.addUltrasoundArtifact(req.params.id, req.user.id, {
            name,
            url,
            type,
            notes,
        });
        res.status(201).json({
            success: true,
            data: artifact,
            message: 'Ultrasound artifact added',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to add ultrasound artifact',
        });
    }
};
exports.addUltrasoundArtifact = addUltrasoundArtifact;
const getUltrasoundArtifacts = async (req, res) => {
    try {
        const artifacts = await ultrasoundService.getUltrasoundArtifacts(req.params.id);
        res.json({
            success: true,
            data: artifacts,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch ultrasound artifacts',
        });
    }
};
exports.getUltrasoundArtifacts = getUltrasoundArtifacts;
//# sourceMappingURL=ultrasound.controller.js.map