"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltrasoundService = void 0;
const database_1 = __importDefault(require("../config/database"));
const finance_service_1 = require("./finance.service");
const financeService = new finance_service_1.FinanceService();
class UltrasoundService {
    async createUltrasoundOrder(data) {
        // Generate order number
        const count = await database_1.default.ultrasoundOrder.count();
        const orderNumber = `US-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        // Calculate price based on follow-up status
        const price = data.isFollowUp ? 400.00 : 200.00;
        const order = await database_1.default.ultrasoundOrder.create({
            data: {
                orderNumber,
                visitId: data.visitId,
                patientId: data.patientId,
                ultrasoundType: data.ultrasoundType,
                isFollowUp: data.isFollowUp,
                price,
                clinicalIndication: data.clinicalIndication,
                orderedById: data.orderedById,
                status: 'SCHEDULED',
                scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
            },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                        phone: true,
                    },
                },
                orderedBy: {
                    select: {
                        fullName: true,
                        department: true,
                    },
                },
                visit: {
                    select: {
                        visitNumber: true,
                        visitDate: true,
                    },
                },
            },
        });
        await financeService.createSystemCharge({
            patientId: data.patientId,
            visitId: data.visitId,
            transactionType: 'ULTRASOUND_FEE',
            amount: price,
            description: `Ultrasound order ${order.orderNumber}`,
        });
        return order;
    }
    async getUltrasoundOrders(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.status) {
            where.status = params.status;
        }
        if (params.patientId) {
            where.patientId = params.patientId;
        }
        if (params.date) {
            const startDate = new Date(params.date);
            const endDate = new Date(params.date);
            endDate.setHours(23, 59, 59, 999);
            where.scheduledDate = { gte: startDate, lte: endDate };
        }
        const [orders, total] = await Promise.all([
            database_1.default.ultrasoundOrder.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    patient: {
                        select: {
                            cardNumber: true,
                            fullName: true,
                            sex: true,
                            dateOfBirth: true,
                        },
                    },
                    orderedBy: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            }),
            database_1.default.ultrasoundOrder.count({ where }),
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getUltrasoundOrderById(id) {
        const order = await database_1.default.ultrasoundOrder.findUnique({
            where: { id },
            include: {
                patient: true,
                visit: true,
                orderedBy: {
                    select: {
                        fullName: true,
                        department: true,
                        phone: true,
                    },
                },
            },
        });
        if (!order) {
            throw new Error('Ultrasound order not found');
        }
        return order;
    }
    async updateUltrasoundStatus(id, status) {
        const order = await database_1.default.ultrasoundOrder.update({
            where: { id },
            data: {
                status: status,
                ...(status === 'COMPLETED' && { completedAt: new Date() }),
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
        return order;
    }
    async addUltrasoundArtifact(orderId, uploadedById, data) {
        const artifact = await database_1.default.auditLog.create({
            data: {
                userId: uploadedById,
                action: 'ULTRASOUND_ARTIFACT_ADDED',
                resource: 'ultrasound_orders',
                resourceId: orderId,
                newValues: {
                    name: data.name,
                    url: data.url,
                    type: data.type || 'REPORT_LINK',
                    notes: data.notes || '',
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
        return artifact;
    }
    async getUltrasoundArtifacts(orderId) {
        const artifacts = await database_1.default.auditLog.findMany({
            where: {
                action: 'ULTRASOUND_ARTIFACT_ADDED',
                resource: 'ultrasound_orders',
                resourceId: orderId,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
        return artifacts;
    }
    async getScheduledUltrasounds(date) {
        const targetDate = date ? new Date(date) : new Date();
        const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
        const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
        const orders = await database_1.default.ultrasoundOrder.findMany({
            where: {
                scheduledDate: {
                    gte: startDate,
                    lte: endDate,
                },
                status: {
                    in: ['SCHEDULED', 'IN_PROGRESS'],
                },
            },
            orderBy: { scheduledDate: 'asc' },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                        phone: true,
                    },
                },
                orderedBy: {
                    select: {
                        fullName: true,
                    },
                },
            },
        });
        return orders;
    }
}
exports.UltrasoundService = UltrasoundService;
//# sourceMappingURL=ultrasound.service.js.map