"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// ============================================
// SUPPLIER ROUTES
// ============================================
router.post('/suppliers', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST'), (req, res) => inventory_controller_1.inventoryController.createSupplier(req, res));
router.get('/suppliers', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST', 'FINANCE'), (req, res) => inventory_controller_1.inventoryController.getSuppliers(req, res));
// ============================================
// INVENTORY ITEM ROUTES
// ============================================
router.post('/items', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST'), (req, res) => inventory_controller_1.inventoryController.createInventoryItem(req, res));
router.get('/items', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST', 'FINANCE', 'NURSE', 'INJECTION_ROOM'), (req, res) => inventory_controller_1.inventoryController.getInventoryItems(req, res));
// ============================================
// PURCHASE INVOICE ROUTES
// ============================================
router.post('/purchase-invoices', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST'), (req, res) => inventory_controller_1.inventoryController.createPurchaseInvoice(req, res));
router.get('/purchase-invoices', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST', 'FINANCE'), (req, res) => inventory_controller_1.inventoryController.getPurchaseInvoices(req, res));
// ============================================
// STORE REQUEST ROUTES
// ============================================
router.post('/store-requests', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST', 'NURSE', 'INJECTION_ROOM'), (req, res) => inventory_controller_1.inventoryController.createStoreRequest(req, res));
router.get('/store-requests', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST', 'NURSE', 'INJECTION_ROOM'), (req, res) => inventory_controller_1.inventoryController.getStoreRequests(req, res));
router.post('/store-requests/:id/approve', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST'), (req, res) => inventory_controller_1.inventoryController.approveStoreRequest(req, res));
// ============================================
// STOCK ADJUSTMENT ROUTES
// ============================================
router.post('/stock-adjustments', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST'), (req, res) => inventory_controller_1.inventoryController.createStockAdjustment(req, res));
router.post('/stock-adjustments/:id/approve', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => inventory_controller_1.inventoryController.approveStockAdjustment(req, res));
// ============================================
// STOCK QUERY ROUTES
// ============================================
router.get('/stock/location/:locationId', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST', 'NURSE', 'INJECTION_ROOM', 'FINANCE'), (req, res) => inventory_controller_1.inventoryController.getStockByLocation(req, res));
router.get('/stock/expiring', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST', 'FINANCE'), (req, res) => inventory_controller_1.inventoryController.getExpiringStock(req, res));
router.get('/stock/movements', (0, auth_1.authorize)('SUPER_ADMIN', 'PHARMACIST', 'FINANCE'), (req, res) => inventory_controller_1.inventoryController.getStockMovements(req, res));
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map