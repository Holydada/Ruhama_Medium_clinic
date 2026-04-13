"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const database_1 = __importDefault(require("../config/database"));
const withDb_1 = require("../utils/withDb");
class FinanceService {
    /**
     * Get comprehensive financial report
     */
    async getFinancialReport(startDate, endDate) {
        const transactions = await database_1.default.financialTransaction.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                    },
                },
            },
        });
        // Revenue by service type
        const revenueByType = transactions.reduce((acc, t) => {
            const type = t.transactionType;
            if (!acc[type]) {
                acc[type] = { count: 0, amount: 0 };
            }
            acc[type].count += 1;
            acc[type].amount += t.amount;
            return acc;
        }, {});
        // Payment method breakdown
        const paymentMethods = transactions.reduce((acc, t) => {
            const method = t.paymentMethod;
            if (!acc[method]) {
                acc[method] = { count: 0, amount: 0 };
            }
            acc[method].count += 1;
            acc[method].amount += t.amount;
            return acc;
        }, {});
        // Daily revenue
        const dailyRevenue = transactions.reduce((acc, t) => {
            const date = t.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += t.amount;
            return acc;
        }, {});
        return {
            period: { startDate, endDate },
            totalRevenue: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
            totalTransactions: transactions.length,
            revenueByType,
            paymentMethods,
            dailyRevenue,
            transactions,
        };
    }
    /**
     * Get outstanding receivables
     */
    async getOutstandingReceivables() {
        const pending = await database_1.default.financialTransaction.findMany({
            where: {
                paymentStatus: {
                    in: ['PENDING'],
                },
            },
            include: {
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        const summary = {
            totalOutstanding: pending.reduce((sum, t) => sum + Number(t.amount), 0),
            count: pending.length,
            aged: {
                current: pending.filter(t => {
                    const days = Math.floor((Date.now() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                    return days <= 30;
                }).length,
                thirtyDays: pending.filter(t => {
                    const days = Math.floor((Date.now() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                    return days > 30 && days <= 60;
                }).length,
                sixtyDays: pending.filter(t => {
                    const days = Math.floor((Date.now() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                    return days > 60 && days <= 90;
                }).length,
                ninetyPlus: pending.filter(t => {
                    const days = Math.floor((Date.now() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                    return days > 90;
                }).length,
            },
            transactions: pending,
        };
        return summary;
    }
    // Transaction Management
    async createTransaction(data) {
        if (!data?.transactionType || !String(data.transactionType).trim()) {
            throw new Error('transactionType is required');
        }
        if (!Number.isFinite(data.amount) || data.amount <= 0) {
            throw new Error('amount must be greater than 0');
        }
        if (!data.paymentMethod) {
            throw new Error('paymentMethod is required');
        }
        // Generate transaction number
        const count = await database_1.default.financialTransaction.count();
        const transactionNumber = `TXN-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
        const transaction = await (0, withDb_1.withDb)(() => database_1.default.financialTransaction.create({
            data: {
                transactionNumber,
                patientId: data.patientId,
                visitId: data.visitId,
                transactionType: data.transactionType,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                paymentStatus: 'PAID',
                referenceNumber: data.referenceNumber,
                description: data.description,
                collectedById: data.collectedById,
            },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                    },
                },
                collectedBy: {
                    select: {
                        fullName: true,
                    },
                },
            },
        }));
        return transaction;
    }
    async getTransactions(params) {
        const page = params.page || 1;
        const limit = params.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.startDate || params.endDate) {
            where.transactionDate = {};
            if (params.startDate) {
                where.transactionDate.gte = new Date(params.startDate);
            }
            if (params.endDate) {
                const endDate = new Date(params.endDate);
                endDate.setHours(23, 59, 59, 999);
                where.transactionDate.lte = endDate;
            }
        }
        if (params.paymentMethod) {
            where.paymentMethod = params.paymentMethod;
        }
        if (params.paymentStatus) {
            where.paymentStatus = params.paymentStatus;
        }
        if (params.transactionType) {
            where.transactionType = params.transactionType;
        }
        if (params.patientId) {
            where.patientId = params.patientId;
        }
        const [transactions, total] = await Promise.all([
            database_1.default.financialTransaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { transactionDate: 'desc' },
                include: {
                    patient: {
                        select: {
                            cardNumber: true,
                            fullName: true,
                        },
                    },
                    collectedBy: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            }),
            database_1.default.financialTransaction.count({ where }),
        ]);
        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async markTransactionPaid(id, referenceNumber) {
        const existing = await database_1.default.financialTransaction.findUnique({
            where: { id },
            select: { paymentStatus: true },
        });
        if (!existing) {
            throw new Error('Transaction not found');
        }
        if (existing.paymentStatus !== 'PENDING') {
            throw new Error('Only pending transactions can be marked paid');
        }
        return (0, withDb_1.withDb)(() => database_1.default.financialTransaction.update({
            where: { id },
            data: {
                paymentStatus: 'PAID',
                paymentMethod: 'CASH',
                ...(referenceNumber && { referenceNumber }),
            },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                    },
                },
            },
        }));
    }
    async requestRefund(id, reason, requestedById) {
        const transaction = await database_1.default.financialTransaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        if (transaction.paymentStatus !== 'PAID') {
            throw new Error('Only paid transactions can be requested for refund');
        }
        await database_1.default.auditLog.create({
            data: {
                userId: requestedById,
                action: 'REFUND_REQUESTED',
                resource: 'financial_transactions',
                resourceId: id,
                newValues: {
                    reason,
                    requestedAt: new Date().toISOString(),
                },
            },
        });
        return {
            transactionId: id,
            status: 'REQUESTED',
            reason,
        };
    }
    async approveRefund(id, reason, approvedById) {
        const transaction = await database_1.default.financialTransaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        if (transaction.paymentStatus !== 'PAID') {
            throw new Error('Only paid transactions can be refunded');
        }
        const refunded = await database_1.default.financialTransaction.update({
            where: { id },
            data: {
                paymentStatus: 'REFUNDED',
                description: `${transaction.description || ''} | REFUND_APPROVED: ${reason}`.trim(),
            },
            include: {
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                    },
                },
            },
        });
        await database_1.default.auditLog.create({
            data: {
                userId: approvedById,
                action: 'REFUND_APPROVED',
                resource: 'financial_transactions',
                resourceId: id,
                newValues: {
                    reason,
                    approvedAt: new Date().toISOString(),
                },
            },
        });
        return refunded;
    }
    // Invoice Management
    async createInvoice(data) {
        if (!data?.patientId) {
            throw new Error('patientId is required');
        }
        if (!data.items?.length) {
            throw new Error('Invoice must include at least one line item');
        }
        for (const item of data.items) {
            if (!item.itemType?.trim() || !item.itemDescription?.trim()) {
                throw new Error('Each invoice item requires itemType and itemDescription');
            }
            if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
                throw new Error('Each invoice item requires quantity greater than 0');
            }
            if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
                throw new Error('Each invoice item requires a non-negative unitPrice');
            }
        }
        // Generate invoice number
        const count = await database_1.default.invoice.count();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
        // Calculate total
        const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const invoice = await (0, withDb_1.withDb)(() => database_1.default.invoice.create({
            data: {
                invoiceNumber,
                patientId: data.patientId,
                visitId: data.visitId,
                totalAmount,
                paidAmount: 0,
                status: 'UNPAID',
                issuedById: data.issuedById,
                items: {
                    create: data.items.map((item) => ({
                        itemType: item.itemType,
                        itemDescription: item.itemDescription,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.quantity * item.unitPrice,
                    })),
                },
            },
            include: {
                items: true,
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                    },
                },
                issuedBy: {
                    select: {
                        fullName: true,
                    },
                },
            },
        }));
        return invoice;
    }
    async getInvoices(params) {
        const page = params.page || 1;
        const limit = params.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.status) {
            where.status = params.status;
        }
        if (params.patientId) {
            where.patientId = params.patientId;
        }
        if (params.startDate || params.endDate) {
            where.issuedAt = {};
            if (params.startDate) {
                where.issuedAt.gte = new Date(params.startDate);
            }
            if (params.endDate) {
                const endDate = new Date(params.endDate);
                endDate.setHours(23, 59, 59, 999);
                where.issuedAt.lte = endDate;
            }
        }
        const [invoices, total] = await Promise.all([
            database_1.default.invoice.findMany({
                where,
                skip,
                take: limit,
                orderBy: { issuedAt: 'desc' },
                include: {
                    items: true,
                    patient: {
                        select: {
                            cardNumber: true,
                            fullName: true,
                        },
                    },
                    issuedBy: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            }),
            database_1.default.invoice.count({ where }),
        ]);
        return {
            invoices,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async payInvoice(id, amount) {
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error('Payment amount must be greater than 0');
        }
        const invoice = await database_1.default.invoice.findUnique({ where: { id } });
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        if (invoice.status === 'PAID') {
            throw new Error('Invoice is already paid');
        }
        const newPaidAmount = Number(invoice.paidAmount) + amount;
        const totalAmount = Number(invoice.totalAmount);
        let status = 'UNPAID';
        if (newPaidAmount >= totalAmount) {
            status = 'PAID';
        }
        else if (newPaidAmount > 0) {
            status = 'PARTIALLY_PAID';
        }
        if (newPaidAmount > totalAmount + 0.0001) {
            throw new Error('Payment amount exceeds invoice balance');
        }
        const updatedInvoice = await (0, withDb_1.withDb)(() => database_1.default.invoice.update({
            where: { id },
            data: {
                paidAmount: newPaidAmount,
                status,
                ...(status === 'PAID' && { paidAt: new Date() }),
            },
            include: {
                items: true,
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                    },
                },
            },
        }));
        return updatedInvoice;
    }
    // Reports
    async getRevenueReport(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const transactions = await database_1.default.financialTransaction.findMany({
            where: {
                transactionDate: { gte: start, lte: end },
                paymentStatus: 'PAID',
            },
        });
        const totalRevenue = transactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        const byPaymentMethod = transactions.reduce((acc, txn) => {
            const method = txn.paymentMethod;
            acc[method] = (acc[method] || 0) + Number(txn.amount);
            return acc;
        }, {});
        const byType = transactions.reduce((acc, txn) => {
            const type = txn.transactionType;
            acc[type] = (acc[type] || 0) + Number(txn.amount);
            return acc;
        }, {});
        return {
            totalRevenue,
            transactionCount: transactions.length,
            byPaymentMethod,
            byType,
            period: { startDate, endDate },
        };
    }
    async getDailyRevenue(date) {
        const targetDate = date ? new Date(date) : new Date();
        const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
        const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
        const transactions = await database_1.default.financialTransaction.findMany({
            where: {
                transactionDate: { gte: startDate, lte: endDate },
                paymentStatus: 'PAID',
            },
        });
        const totalRevenue = transactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        return {
            date: targetDate.toISOString().split('T')[0],
            totalRevenue,
            transactionCount: transactions.length,
            transactions,
        };
    }
    /** Get daily revenue for RECEPTION/SUPER_ADMIN - only card fees and ultrasound fees */
    async getReceptionDailyRevenue(date) {
        const targetDate = date ? new Date(date) : new Date();
        const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
        const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
        const transactions = await database_1.default.financialTransaction.findMany({
            where: {
                transactionDate: { gte: startDate, lte: endDate },
                paymentStatus: 'PAID',
                transactionType: {
                    in: ['CARD_FEE', 'ULTRASOUND_FEE'],
                },
            },
        });
        const totalRevenue = transactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        const byType = transactions.reduce((acc, txn) => {
            const type = txn.transactionType;
            acc[type] = (acc[type] || 0) + Number(txn.amount);
            return acc;
        }, {});
        return {
            date: targetDate.toISOString().split('T')[0],
            totalRevenue,
            transactionCount: transactions.length,
            byType,
            summary: {
                cardFees: byType['CARD_FEE'] || 0,
                ultrasoundFees: byType['ULTRASOUND_FEE'] || 0,
            },
        };
    }
    /** Get daily revenue for FINANCE - excludes card fees and ultrasound fees */
    async getFinanceDailyRevenue(date) {
        const targetDate = date ? new Date(date) : new Date();
        const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
        const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
        const transactions = await database_1.default.financialTransaction.findMany({
            where: {
                transactionDate: { gte: startDate, lte: endDate },
                paymentStatus: 'PAID',
                transactionType: {
                    notIn: ['CARD_FEE', 'ULTRASOUND_FEE'],
                },
            },
        });
        const totalRevenue = transactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        const byType = transactions.reduce((acc, txn) => {
            const type = txn.transactionType;
            acc[type] = (acc[type] || 0) + Number(txn.amount);
            return acc;
        }, {});
        return {
            date: targetDate.toISOString().split('T')[0],
            totalRevenue,
            transactionCount: transactions.length,
            byType,
            transactions,
        };
    }
    /** Get pharmacy revenue - pharmacy sales only */
    async getPharmacyDailyRevenue(date) {
        const targetDate = date ? new Date(date) : new Date();
        const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
        const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
        const transactions = await database_1.default.financialTransaction.findMany({
            where: {
                transactionDate: { gte: startDate, lte: endDate },
                paymentStatus: 'PAID',
                transactionType: {
                    in: ['PHARMACY_SALE', 'MEDICATION_PAYMENT'],
                },
            },
        });
        const totalRevenue = transactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        return {
            date: targetDate.toISOString().split('T')[0],
            totalRevenue,
            transactionCount: transactions.length,
            transactions,
        };
    }
    async getDailyCloseoutSummary(date) {
        const targetDate = date ? new Date(date) : new Date();
        const startDate = new Date(targetDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(targetDate);
        endDate.setHours(23, 59, 59, 999);
        const transactions = await database_1.default.financialTransaction.findMany({
            where: {
                transactionDate: { gte: startDate, lte: endDate },
            },
        });
        const paid = transactions.filter((t) => t.paymentStatus === 'PAID');
        const pending = transactions.filter((t) => t.paymentStatus === 'PENDING');
        const refunded = transactions.filter((t) => t.paymentStatus === 'REFUNDED');
        const totalCollected = paid.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalPending = pending.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalRefunded = refunded.reduce((sum, t) => sum + Number(t.amount), 0);
        const byMethod = paid.reduce((acc, t) => {
            const key = t.paymentMethod;
            acc[key] = (acc[key] || 0) + Number(t.amount);
            return acc;
        }, {});
        return {
            date: startDate.toISOString().slice(0, 10),
            totalTransactions: transactions.length,
            paidCount: paid.length,
            pendingCount: pending.length,
            refundedCount: refunded.length,
            totals: {
                collected: totalCollected,
                pending: totalPending,
                refunded: totalRefunded,
                net: totalCollected - totalRefunded,
            },
            byMethod,
        };
    }
    async createSystemCharge(data) {
        if (!data?.transactionType?.trim()) {
            throw new Error('transactionType is required');
        }
        if (!Number.isFinite(data.amount) || data.amount <= 0) {
            throw new Error('System charge amount must be greater than 0');
        }
        const count = await database_1.default.financialTransaction.count();
        const transactionNumber = `TXN-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
        return (0, withDb_1.withDb)(() => database_1.default.financialTransaction.create({
            data: {
                transactionNumber,
                patientId: data.patientId,
                visitId: data.visitId,
                transactionType: data.transactionType,
                amount: data.amount,
                paymentMethod: 'CASH',
                paymentStatus: 'PENDING',
                description: data.description,
            },
        }));
    }
    async createPaidSystemCharge(data) {
        if (!data?.transactionType?.trim()) {
            throw new Error('transactionType is required');
        }
        if (!Number.isFinite(data.amount) || data.amount <= 0) {
            throw new Error('System charge amount must be greater than 0');
        }
        const count = await database_1.default.financialTransaction.count();
        const transactionNumber = `TXN-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
        return (0, withDb_1.withDb)(() => database_1.default.financialTransaction.create({
            data: {
                transactionNumber,
                patientId: data.patientId,
                visitId: data.visitId,
                transactionType: data.transactionType,
                amount: data.amount,
                paymentMethod: 'CASH',
                paymentStatus: 'PAID',
                description: data.description,
                collectedById: data.collectedById,
            },
        }));
    }
}
exports.FinanceService = FinanceService;
//# sourceMappingURL=finance.service.js.map