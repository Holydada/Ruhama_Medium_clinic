"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryController = exports.InventoryController = void 0;
const inventory_service_1 = require("../services/inventory.service");
class InventoryController {
    // ============================================
    // SUPPLIER MANAGEMENT
    // ============================================
    async createSupplier(req, res) {
        try {
            const supplier = await inventory_service_1.inventoryService.createSupplier(req.body);
            res.status(201).json(supplier);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getSuppliers(req, res) {
        try {
            const { search, isActive } = req.query;
            const suppliers = await inventory_service_1.inventoryService.getSuppliers({
                search: search,
                isActive: isActive === 'true',
            });
            res.json(suppliers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // ============================================
    // INVENTORY ITEMS
    // ============================================
    async createInventoryItem(req, res) {
        try {
            const item = await inventory_service_1.inventoryService.createInventoryItem(req.body);
            res.status(201).json(item);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getInventoryItems(req, res) {
        try {
            const { search, category, isActive, page, limit } = req.query;
            const result = await inventory_service_1.inventoryService.getInventoryItems({
                search: search,
                category: category,
                isActive: isActive === 'true',
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // ============================================
    // PURCHASE INVOICES
    // ============================================
    async createPurchaseInvoice(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const invoice = await inventory_service_1.inventoryService.createPurchaseInvoice(req.body, userId);
            res.status(201).json(invoice);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getPurchaseInvoices(req, res) {
        try {
            const { supplierId, status, page, limit } = req.query;
            const result = await inventory_service_1.inventoryService.getPurchaseInvoices({
                supplierId: supplierId,
                status: status,
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // ============================================
    // STORE REQUESTS
    // ============================================
    async createStoreRequest(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const request = await inventory_service_1.inventoryService.createStoreRequest(req.body, userId);
            res.status(201).json(request);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getStoreRequests(req, res) {
        try {
            const { status, toLocationId, page, limit } = req.query;
            const result = await inventory_service_1.inventoryService.getStoreRequests({
                status: status,
                toLocationId: toLocationId,
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async approveStoreRequest(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const { approvals } = req.body;
            const request = await inventory_service_1.inventoryService.approveStoreRequest(id, approvals, userId);
            res.json(request);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // ============================================
    // STOCK ADJUSTMENTS
    // ============================================
    async createStockAdjustment(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const adjustment = await inventory_service_1.inventoryService.createStockAdjustment(req.body, userId);
            res.status(201).json(adjustment);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async approveStockAdjustment(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const adjustment = await inventory_service_1.inventoryService.approveStockAdjustment(id, userId);
            res.json(adjustment);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // ============================================
    // STOCK QUERIES
    // ============================================
    async getStockByLocation(req, res) {
        try {
            const { locationId } = req.params;
            const { lowStock } = req.query;
            const stock = await inventory_service_1.inventoryService.getStockByLocation(locationId, {
                lowStock: lowStock === 'true',
            });
            res.json(stock);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getExpiringStock(req, res) {
        try {
            const { daysThreshold } = req.query;
            const stock = await inventory_service_1.inventoryService.getExpiringStock(daysThreshold ? parseInt(daysThreshold) : 90);
            res.json(stock);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getStockMovements(req, res) {
        try {
            const { itemId, locationId, movementType, startDate, endDate, page, limit } = req.query;
            const result = await inventory_service_1.inventoryService.getStockMovements({
                itemId: itemId,
                locationId: locationId,
                movementType: movementType,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.InventoryController = InventoryController;
exports.inventoryController = new InventoryController();
//# sourceMappingURL=inventory.controller.js.map