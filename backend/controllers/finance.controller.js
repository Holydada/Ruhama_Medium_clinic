"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyCloseoutSummary = exports.getDailyRevenue = exports.getRevenueReport = exports.payInvoice = exports.getInvoices = exports.createInvoice = exports.approveRefund = exports.requestRefund = exports.markTransactionPaid = exports.getTransactions = exports.createTransaction = void 0;
const finance_service_1 = require("../services/finance.service");
const financeService = new finance_service_1.FinanceService();
// Transactions
const createTransaction = async (req, res) => {
    try {
        const transaction = await financeService.createTransaction({
            ...req.body,
            collectedById: req.user.id,
        });
        res.status(201).json({
            success: true,
            data: transaction,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create transaction',
        });
    }
};
exports.createTransaction = createTransaction;
const getTransactions = async (req, res) => {
    try {
        const result = await financeService.getTransactions(req.query);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch transactions',
        });
    }
};
exports.getTransactions = getTransactions;
const markTransactionPaid = async (req, res) => {
    try {
        const { referenceNumber } = req.body;
        const transaction = await financeService.markTransactionPaid(req.params.id, referenceNumber);
        res.json({
            success: true,
            data: transaction,
            message: 'Transaction marked as paid',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to mark transaction as paid',
        });
    }
};
exports.markTransactionPaid = markTransactionPaid;
const requestRefund = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason || !String(reason).trim()) {
            res.status(400).json({
                success: false,
                error: 'Refund reason is required',
            });
            return;
        }
        const result = await financeService.requestRefund(req.params.id, String(reason), req.user.id);
        res.json({
            success: true,
            data: result,
            message: 'Refund request submitted for approval',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to request refund',
        });
    }
};
exports.requestRefund = requestRefund;
const approveRefund = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason || !String(reason).trim()) {
            res.status(400).json({
                success: false,
                error: 'Approval reason is required',
            });
            return;
        }
        const result = await financeService.approveRefund(req.params.id, String(reason), req.user.id);
        res.json({
            success: true,
            data: result,
            message: 'Refund approved and posted',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to approve refund',
        });
    }
};
exports.approveRefund = approveRefund;
// Invoices
const createInvoice = async (req, res) => {
    try {
        const invoice = await financeService.createInvoice({
            ...req.body,
            issuedById: req.user.id,
        });
        res.status(201).json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create invoice',
        });
    }
};
exports.createInvoice = createInvoice;
const getInvoices = async (req, res) => {
    try {
        const result = await financeService.getInvoices(req.query);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch invoices',
        });
    }
};
exports.getInvoices = getInvoices;
const payInvoice = async (req, res) => {
    try {
        const { amount } = req.body;
        const invoice = await financeService.payInvoice(req.params.id, amount);
        res.json({
            success: true,
            data: invoice,
            message: 'Payment recorded successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process payment',
        });
    }
};
exports.payInvoice = payInvoice;
// Reports
const getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            res.status(400).json({
                success: false,
                error: 'Start date and end date are required',
            });
            return;
        }
        const report = await financeService.getRevenueReport(startDate, endDate);
        res.json({
            success: true,
            data: report,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate revenue report',
        });
    }
};
exports.getRevenueReport = getRevenueReport;
const getDailyRevenue = async (req, res) => {
    try {
        const { date } = req.query;
        const userRole = req.user?.role;
        let report;
        // Role-based revenue filtering
        if (userRole === 'RECEPTIONIST') {
            // Reception sees only card fees and ultrasound fees
            report = await financeService.getReceptionDailyRevenue(date);
        }
        else if (userRole === 'SUPER_ADMIN') {
            // Super admin sees everything (all finance cases including reception)
            report = await financeService.getDailyRevenue(date);
        }
        else if (userRole === 'FINANCE') {
            // Finance sees everything EXCEPT card fees and ultrasound fees
            report = await financeService.getFinanceDailyRevenue(date);
        }
        else if (userRole === 'PHARMACIST') {
            // Pharmacy sees only pharmacy sales
            report = await financeService.getPharmacyDailyRevenue(date);
        }
        else {
            // Default: show all
            report = await financeService.getDailyRevenue(date);
        }
        res.json({
            success: true,
            data: report,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get daily revenue',
        });
    }
};
exports.getDailyRevenue = getDailyRevenue;
const getDailyCloseoutSummary = async (req, res) => {
    try {
        const { date } = req.query;
        const summary = await financeService.getDailyCloseoutSummary(date);
        res.json({
            success: true,
            data: summary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get daily closeout summary',
        });
    }
};
exports.getDailyCloseoutSummary = getDailyCloseoutSummary;
//# sourceMappingURL=finance.controller.js.map