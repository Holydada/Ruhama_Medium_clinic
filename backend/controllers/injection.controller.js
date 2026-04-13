"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInjectionQueue = exports.cancelInjectionOrder = exports.getAdministrationHistory = exports.administerInjection = exports.getInjectionOrderById = exports.getInjectionOrders = exports.createInjectionOrder = void 0;
const injection_service_1 = require("../services/injection.service");
const injectionService = new injection_service_1.InjectionService();
const createInjectionOrder = async (req, res) => {
    try {
        const order = await injectionService.createInjectionOrder({
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
            error: error.message || 'Failed to create injection order',
        });
    }
};
exports.createInjectionOrder = createInjectionOrder;
const getInjectionOrders = async (req, res) => {
    try {
        const result = await injectionService.getInjectionOrders(req.query);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch injection orders',
        });
    }
};
exports.getInjectionOrders = getInjectionOrders;
const getInjectionOrderById = async (req, res) => {
    try {
        const order = await injectionService.getInjectionOrderById(req.params.id);
        res.json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: error.message || 'Injection order not found',
        });
    }
};
exports.getInjectionOrderById = getInjectionOrderById;
const administerInjection = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
            });
        }
        const administration = await injectionService.administerInjection({
            orderId: req.params.id,
            administeredById: req.user.id,
            // 5 Rights Check
            rightPatientChecked: Boolean(req.body.rightPatientChecked),
            rightMedicationChecked: Boolean(req.body.rightMedicationChecked),
            rightDoseChecked: Boolean(req.body.rightDoseChecked),
            rightRouteChecked: Boolean(req.body.rightRouteChecked),
            rightTimeChecked: Boolean(req.body.rightTimeChecked),
            // Administration Details
            site: req.body.site,
            route: req.body.route,
            batchNumber: req.body.batchNumber,
            lotNumber: req.body.lotNumber,
            expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined,
            // Vitals
            vitalsBefore: req.body.vitalsBefore,
            vitalsAfter: req.body.vitalsAfter,
            // Adverse Events
            adverseReaction: Boolean(req.body.adverseReaction),
            reactionType: req.body.reactionType,
            reactionSeverity: req.body.reactionSeverity,
            reactionDetails: req.body.reactionDetails,
            actionTaken: req.body.actionTaken,
            // Consumables
            consumablesUsed: req.body.consumablesUsed,
            witnessedById: req.body.witnessedById,
            notes: req.body.notes,
        });
        res.json({
            success: true,
            data: administration,
            message: 'Injection administered successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to administer injection',
        });
    }
};
exports.administerInjection = administerInjection;
const getAdministrationHistory = async (req, res) => {
    try {
        const history = await injectionService.getAdministrationHistory(req.params.id);
        res.json({
            success: true,
            data: history,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch administration history',
        });
    }
};
exports.getAdministrationHistory = getAdministrationHistory;
const cancelInjectionOrder = async (req, res) => {
    try {
        const order = await injectionService.cancelInjectionOrder(req.params.id);
        res.json({
            success: true,
            data: order,
            message: 'Injection order cancelled',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to cancel injection order',
        });
    }
};
exports.cancelInjectionOrder = cancelInjectionOrder;
const getInjectionQueue = async (req, res) => {
    try {
        const orders = await injectionService.getInjectionQueue();
        res.json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch injection queue',
        });
    }
};
exports.getInjectionQueue = getInjectionQueue;
//# sourceMappingURL=injection.controller.js.map