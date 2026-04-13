"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispenseStock = exports.getExpiringStock = exports.getLowStockAlerts = exports.updateStock = exports.getStockById = exports.getStock = exports.addStock = exports.getDrugs = exports.createDrug = void 0;
const pharmacy_service_1 = require("../services/pharmacy.service");
const pharmacyService = new pharmacy_service_1.PharmacyService();
// Drug Management
const createDrug = async (req, res) => {
    try {
        const drug = await pharmacyService.createDrug(req.body);
        res.status(201).json({
            success: true,
            message: 'Drug created successfully',
            data: drug,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
exports.createDrug = createDrug;
const getDrugs = async (req, res) => {
    try {
        const { search, category, isActive, page, limit } = req.query;
        const result = await pharmacyService.getDrugs({
            search: search,
            category: category,
            isActive: isActive === 'true',
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        res.json({
            success: true,
            data: result.drugs,
            ...(page || limit ? { pagination: result.pagination } : {}),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.getDrugs = getDrugs;
// Stock Management
const addStock = async (req, res) => {
    try {
        const stock = await pharmacyService.addStock(req.body);
        res.status(201).json({
            success: true,
            message: 'Stock added successfully',
            data: stock,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
exports.addStock = addStock;
const getStock = async (req, res) => {
    try {
        const { page, limit, search, status, lowStock } = req.query;
        const result = await pharmacyService.getStock({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search,
            status: status,
            lowStock: lowStock === 'true',
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
};
exports.getStock = getStock;
const getStockById = async (req, res) => {
    try {
        const stock = await pharmacyService.getStockById(req.params.id);
        res.json({
            success: true,
            data: stock,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: error.message,
        });
    }
};
exports.getStockById = getStockById;
const updateStock = async (req, res) => {
    try {
        const stock = await pharmacyService.updateStock(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Stock updated successfully',
            data: stock,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
exports.updateStock = updateStock;
const getLowStockAlerts = async (req, res) => {
    try {
        const alerts = await pharmacyService.getLowStockAlerts();
        res.json({
            success: true,
            data: alerts,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.getLowStockAlerts = getLowStockAlerts;
const getExpiringStock = async (req, res) => {
    try {
        const { days, limit } = req.query;
        const expiringStock = await pharmacyService.getExpiringStock(days ? Number(days) : undefined, limit ? Number(limit) : undefined);
        res.json({
            success: true,
            data: expiringStock,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.getExpiringStock = getExpiringStock;
const dispenseStock = async (req, res) => {
    try {
        const stock = await pharmacyService.dispenseStock(req.body);
        res.json({
            success: true,
            message: 'Stock dispensed successfully',
            data: stock,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
exports.dispenseStock = dispenseStock;
//# sourceMappingURL=pharmacy.controller.js.map