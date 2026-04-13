"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabService = void 0;
const database_1 = __importDefault(require("../config/database"));
const finance_service_1 = require("./finance.service");
const withDb_1 = require("../utils/withDb");
const financeService = new finance_service_1.FinanceService();
const LAB_STATUSES = ['PENDING', 'SAMPLE_COLLECTED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'];
class LabService {
    // Lab Test Management
    async createLabTest(data) {
        const labTest = await database_1.default.labTest.create({
            data: {
                ...data,
                isActive: true,
            },
        });
        return labTest;
    }
    async getLabTests(params) {
        const where = {};
        if (params.search) {
            where.OR = [
                { testName: { contains: params.search, mode: 'insensitive' } },
                { testCode: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.category) {
            where.testCategory = params.category;
        }
        if (params.isActive !== undefined) {
            where.isActive = params.isActive;
        }
        const page = params.page && params.page > 0 ? params.page : 1;
        const limitRaw = params.limit && params.limit > 0 ? params.limit : 500;
        const limit = Math.min(limitRaw, 1000);
        const skip = (page - 1) * limit;
        const [tests, total] = await Promise.all([
            database_1.default.labTest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { testName: 'asc' },
            }),
            database_1.default.labTest.count({ where }),
        ]);
        return {
            tests,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Lab Order Management
    async createLabOrder(data) {
        if (!data.tests?.length) {
            throw new Error('Lab order must include at least one test');
        }
        const visit = await database_1.default.patientVisit.findUnique({
            where: { id: data.visitId },
            select: { id: true, patientId: true },
        });
        if (!visit) {
            throw new Error('Visit not found');
        }
        if (visit.patientId !== data.patientId) {
            throw new Error('patientId does not match this visit');
        }
        const testIds = [...new Set(data.tests.map((t) => t.testId))];
        const dbTests = await database_1.default.labTest.findMany({
            where: { id: { in: testIds }, isActive: true },
            select: { id: true, testName: true, price: true },
        });
        if (dbTests.length !== testIds.length) {
            throw new Error('One or more lab tests are invalid or inactive');
        }
        const count = await database_1.default.labOrder.count();
        const orderNumber = `LAB-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        const order = await (0, withDb_1.withDb)(() => database_1.default.labOrder.create({
            data: {
                orderNumber,
                visitId: data.visitId,
                patientId: data.patientId,
                orderedById: data.orderedById,
                priority: data.priority || 'ROUTINE',
                clinicalNotes: data.clinicalNotes,
                status: 'PENDING',
                items: {
                    create: data.tests.map(test => ({
                        testId: test.testId,
                        testName: test.testName,
                        status: 'PENDING',
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        test: true,
                    },
                },
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
                        department: true,
                    },
                },
            },
        }));
        const pricedTests = await database_1.default.labTest.findMany({
            where: { id: { in: testIds } },
            select: { price: true },
        });
        const total = pricedTests.reduce((sum, t) => sum + Number(t.price || 0), 0);
        if (total > 0) {
            await financeService.createSystemCharge({
                patientId: data.patientId,
                visitId: data.visitId,
                transactionType: 'LAB_FEE',
                amount: total,
                description: `Lab order ${order.orderNumber}`,
            });
        }
        return order;
    }
    async getLabOrders(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.status) {
            where.status = params.status;
        }
        if (params.priority) {
            where.priority = params.priority;
        }
        if (params.patientId) {
            where.patientId = params.patientId;
        }
        if (params.date) {
            const startDate = new Date(params.date);
            const endDate = new Date(params.date);
            endDate.setHours(23, 59, 59, 999);
            where.orderedAt = { gte: startDate, lte: endDate };
        }
        const [orders, total] = await Promise.all([
            database_1.default.labOrder.findMany({
                where,
                skip,
                take: limit,
                orderBy: { orderedAt: 'desc' },
                include: {
                    items: {
                        include: {
                            test: true,
                        },
                    },
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
            database_1.default.labOrder.count({ where }),
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
    async getLabOrderById(id) {
        const order = await database_1.default.labOrder.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        test: true,
                    },
                },
                patient: true,
                visit: true,
                orderedBy: {
                    select: {
                        fullName: true,
                        department: true,
                    },
                },
                verifiedBy: {
                    select: {
                        fullName: true,
                    },
                },
            },
        });
        if (!order) {
            throw new Error('Lab order not found');
        }
        return order;
    }
    async updateLabOrderStatus(id, status) {
        if (!LAB_STATUSES.includes(status)) {
            throw new Error(`Invalid lab order status: ${status}`);
        }
        const order = await (0, withDb_1.withDb)(() => database_1.default.labOrder.update({
            where: { id },
            data: {
                status: status,
                ...(status === 'SAMPLE_COLLECTED' && {
                    items: { updateMany: { where: {}, data: { status: 'SAMPLE_COLLECTED' } } },
                }),
                ...(status === 'COMPLETED' && { completedAt: new Date() }),
            },
            include: {
                items: true,
            },
        }));
        return order;
    }
    async updateLabResult(itemId, data) {
        if (!data?.result || !String(data.result).trim()) {
            throw new Error('result is required');
        }
        const existingItem = await database_1.default.labOrderItem.findUnique({
            where: { id: itemId },
            select: { id: true, orderId: true },
        });
        if (!existingItem) {
            throw new Error('Lab order item not found');
        }
        const item = await (0, withDb_1.withDb)(() => database_1.default.labOrderItem.update({
            where: { id: itemId },
            data: {
                result: data.result,
                isAbnormal: data.isAbnormal,
                notes: data.notes,
                status: 'COMPLETED',
            },
        }));
        const order = await database_1.default.labOrder.findUnique({
            where: { id: item.orderId },
            include: { items: true },
        });
        const allCompleted = order?.items.every((i) => i.status === 'COMPLETED');
        if (allCompleted && order) {
            await (0, withDb_1.withDb)(() => database_1.default.labOrder.update({
                where: { id: order.id },
                data: { status: 'COMPLETED', completedAt: new Date() },
            }));
        }
        return item;
    }
    async verifyLabOrder(id, verifiedById) {
        const current = await database_1.default.labOrder.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!current) {
            throw new Error('Lab order not found');
        }
        if (current.status === 'VERIFIED') {
            throw new Error('Lab order is already verified');
        }
        const hasAnyResult = current.items.some((i) => i.result && String(i.result).trim().length > 0);
        if (!hasAnyResult) {
            throw new Error('Enter at least one test result before releasing results to the doctor');
        }
        const order = await (0, withDb_1.withDb)(() => database_1.default.labOrder.update({
            where: { id },
            data: {
                status: 'VERIFIED',
                verifiedAt: new Date(),
                verifiedById,
                ...(current.completedAt ? {} : { completedAt: new Date() }),
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
        return order;
    }
    async getLabQueue(params) {
        const take = params?.limit && params.limit > 0 ? Math.min(params.limit, 500) : 200;
        const orders = await database_1.default.labOrder.findMany({
            where: {
                status: {
                    in: ['PENDING', 'SAMPLE_COLLECTED', 'IN_PROGRESS', 'COMPLETED'],
                },
            },
            orderBy: [
                { priority: 'asc' },
                { orderedAt: 'asc' },
            ],
            take,
            include: {
                items: true,
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
        });
        return orders.map((order) => ({
            ...order,
            enteredResultCount: order.items.filter((i) => i.result && String(i.result).trim().length > 0).length,
            pendingResultCount: order.items.filter((i) => !i.result || !String(i.result).trim()).length,
        }));
    }
    async addLabArtifact(orderId, uploadedById, data) {
        const artifact = await database_1.default.auditLog.create({
            data: {
                userId: uploadedById,
                action: 'LAB_ARTIFACT_ADDED',
                resource: 'lab_orders',
                resourceId: orderId,
                newValues: {
                    name: data.name,
                    url: data.url,
                    type: data.type || 'RESULT_LINK',
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
    async getLabArtifacts(orderId) {
        const artifacts = await database_1.default.auditLog.findMany({
            where: {
                action: 'LAB_ARTIFACT_ADDED',
                resource: 'lab_orders',
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
}
exports.LabService = LabService;
//# sourceMappingURL=lab.service.js.map