"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectionService = exports.InjectionService = void 0;
const database_1 = __importDefault(require("../config/database"));
const finance_service_1 = require("./finance.service");
const withDb_1 = require("../utils/withDb");
const financeService = new finance_service_1.FinanceService();
class InjectionService {
    async createInjectionOrder(data) {
        // Generate order number
        const count = await database_1.default.injectionOrder.count();
        const orderNumber = `INJ-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        const order = await database_1.default.injectionOrder.create({
            data: {
                orderNumber,
                visitId: data.visitId,
                patientId: data.patientId,
                medicationName: data.medicationName,
                dosage: data.dosage,
                route: data.route,
                frequency: data.frequency,
                duration: data.duration,
                notes: data.notes,
                orderedById: data.orderedById,
                status: 'PENDING',
            },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                        allergies: true,
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
        const configuredFee = Number(process.env.INJECTION_FEE || 0);
        if (configuredFee > 0) {
            await financeService.createSystemCharge({
                patientId: data.patientId,
                visitId: data.visitId,
                transactionType: 'INJECTION_FEE',
                amount: configuredFee,
                description: `Injection order ${order.orderNumber}`,
            });
        }
        // Notify injection room nurses
        const nurses = await database_1.default.user.findMany({
            where: {
                role: {
                    in: ['NURSE', 'INJECTION_ROOM'],
                },
                isActive: true,
            },
        });
        for (const nurse of nurses) {
            await database_1.default.notification.create({
                data: {
                    userId: nurse.id,
                    notificationType: 'NEW_INJECTION_ORDER',
                    title: 'New Injection Order',
                    message: `New injection order for ${order.patient.fullName} - ${data.medicationName}`,
                    relatedId: order.id,
                },
            });
        }
        return order;
    }
    // ============================================
    // INJECTION ADMINISTRATION (5 RIGHTS CHECK)
    // ============================================
    async administerInjection(data) {
        // Validate 5 Rights
        if (!data.rightPatientChecked ||
            !data.rightMedicationChecked ||
            !data.rightDoseChecked ||
            !data.rightRouteChecked ||
            !data.rightTimeChecked) {
            throw new Error('All 5 Rights must be checked before administration');
        }
        const order = await database_1.default.injectionOrder.findUnique({
            where: { id: data.orderId },
            include: {
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                    },
                },
                orderedBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        if (!order) {
            throw new Error('Injection order not found');
        }
        if (order.status === 'ADMINISTERED') {
            throw new Error('Injection already administered');
        }
        return (0, withDb_1.withDb)(() => database_1.default.$transaction(async (tx) => {
            // Create administration record
            const administration = await tx.injectionAdministration.create({
                data: {
                    orderId: data.orderId,
                    rightPatientChecked: data.rightPatientChecked,
                    rightMedicationChecked: data.rightMedicationChecked,
                    rightDoseChecked: data.rightDoseChecked,
                    rightRouteChecked: data.rightRouteChecked,
                    rightTimeChecked: data.rightTimeChecked,
                    site: data.site,
                    route: data.route,
                    batchNumber: data.batchNumber,
                    lotNumber: data.lotNumber,
                    expiryDate: data.expiryDate,
                    vitalsBefore: data.vitalsBefore,
                    vitalsAfter: data.vitalsAfter,
                    adverseReaction: data.adverseReaction || false,
                    reactionType: data.reactionType,
                    reactionSeverity: data.reactionSeverity,
                    reactionDetails: data.reactionDetails,
                    actionTaken: data.actionTaken,
                    consumablesUsed: data.consumablesUsed,
                    administeredById: data.administeredById,
                    witnessedById: data.witnessedById,
                    notes: data.notes,
                },
                include: {
                    administeredBy: {
                        select: {
                            fullName: true,
                            role: true,
                        },
                    },
                },
            });
            // Update order status
            await tx.injectionOrder.update({
                where: { id: data.orderId },
                data: {
                    status: 'ADMINISTERED',
                },
            });
            // Notify doctor if adverse reaction
            if (data.adverseReaction && order.orderedBy) {
                await tx.notification.create({
                    data: {
                        userId: order.orderedBy.id,
                        notificationType: 'ADVERSE_REACTION',
                        title: '⚠️ Adverse Reaction Reported',
                        message: `Adverse reaction reported for ${order.patient.fullName} after ${order.medicationName} injection`,
                        relatedId: order.id,
                    },
                });
            }
            return administration;
        }));
    }
    async getInjectionOrders(params) {
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
            where.createdAt = { gte: startDate, lte: endDate };
        }
        const [orders, total] = await Promise.all([
            database_1.default.injectionOrder.findMany({
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
                            allergies: true,
                        },
                    },
                    orderedBy: {
                        select: {
                            fullName: true,
                        },
                    },
                    administrations: {
                        include: {
                            administeredBy: {
                                select: {
                                    fullName: true,
                                },
                            },
                        },
                    },
                },
            }),
            database_1.default.injectionOrder.count({ where }),
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
    async getInjectionOrderById(id) {
        const order = await database_1.default.injectionOrder.findUnique({
            where: { id },
            include: {
                patient: {
                    include: {
                        visits: {
                            where: {
                                vitalSigns: {
                                    some: {},
                                },
                            },
                            include: {
                                vitalSigns: {
                                    orderBy: {
                                        recordedAt: 'desc',
                                    },
                                    take: 1,
                                },
                            },
                            orderBy: {
                                visitDate: 'desc',
                            },
                            take: 1,
                        },
                    },
                },
                visit: true,
                orderedBy: {
                    select: {
                        fullName: true,
                        department: true,
                        phone: true,
                    },
                },
                administrations: {
                    include: {
                        administeredBy: {
                            select: {
                                fullName: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: {
                        administeredAt: 'desc',
                    },
                },
            },
        });
        if (!order) {
            throw new Error('Injection order not found');
        }
        return order;
    }
    async cancelInjectionOrder(id, reason) {
        const order = await database_1.default.injectionOrder.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                notes: reason,
            },
        });
        return order;
    }
    async getInjectionQueue() {
        const orders = await database_1.default.injectionOrder.findMany({
            where: {
                status: 'PENDING',
            },
            orderBy: { createdAt: 'asc' },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                        allergies: true,
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
    async getAdministrationHistory(orderId) {
        return await database_1.default.injectionAdministration.findMany({
            where: { orderId },
            orderBy: { administeredAt: 'desc' },
            include: {
                administeredBy: {
                    select: {
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
    }
}
exports.InjectionService = InjectionService;
exports.injectionService = new InjectionService();
//# sourceMappingURL=injection.service.js.map