"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const financeController = __importStar(require("../controllers/finance.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Transactions
router.post('/transactions', (0, auth_1.authorize)('RECEPTIONIST', 'FINANCE', 'SUPER_ADMIN'), financeController.createTransaction);
router.get('/transactions', (0, auth_1.authorize)('FINANCE', 'SUPER_ADMIN'), financeController.getTransactions);
router.patch('/transactions/:id/pay', (0, auth_1.authorize)('FINANCE', 'SUPER_ADMIN'), financeController.markTransactionPaid);
router.post('/transactions/:id/refund-request', (0, auth_1.authorize)('FINANCE', 'SUPER_ADMIN'), financeController.requestRefund);
router.post('/transactions/:id/refund-approve', (0, auth_1.authorize)('SUPER_ADMIN'), financeController.approveRefund);
// Invoices
router.post('/invoices', (0, auth_1.authorize)('RECEPTIONIST', 'FINANCE', 'SUPER_ADMIN'), financeController.createInvoice);
router.get('/invoices', (0, auth_1.authorize)('FINANCE', 'SUPER_ADMIN'), financeController.getInvoices);
router.post('/invoices/:id/pay', (0, auth_1.authorize)('RECEPTIONIST', 'FINANCE', 'SUPER_ADMIN'), financeController.payInvoice);
// Reports
router.get('/reports/revenue', (0, auth_1.authorize)('FINANCE', 'SUPER_ADMIN'), financeController.getRevenueReport);
router.get('/reports/daily', (0, auth_1.authorize)('RECEPTIONIST', 'FINANCE', 'PHARMACIST', 'SUPER_ADMIN'), financeController.getDailyRevenue);
router.get('/closeout/daily', (0, auth_1.authorize)('FINANCE', 'SUPER_ADMIN'), financeController.getDailyCloseoutSummary);
exports.default = router;
//# sourceMappingURL=finance.routes.js.map