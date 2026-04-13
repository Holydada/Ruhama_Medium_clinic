"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labVerificationService = exports.LabVerificationService = void 0;
const client_1 = require("@prisma/client");
const notification_service_1 = require("./notification.service");
const prisma = new client_1.PrismaClient();
class LabVerificationService {
    /**
     * Enter lab results with reference ranges
     */
    async enterResults(labOrderItemId, result, enteredById, notes) {
        const item = await prisma.labOrderItem.findUnique({
            where: { id: labOrderItemId },
            include: {
                test: true,
                labOrder: {
                    include: {
                        patient: {
                            select: {
                                dateOfBirth: true,
                                sex: true,
                            },
                        },
                    },
                },
            },
        });
        if (!item) {
            throw new Error('Lab order item not found');
        }
        // Check if result is abnormal
        const isAbnormal = this.checkAbnormalValue(item.test.testName, result, item.labOrder.patient.sex, item.labOrder.patient.dateOfBirth);
        // Update item with results
        const updatedItem = await prisma.labOrderItem.update({
            where: { id: labOrderItemId },
            data: {
                result,
                isAbnormal,
                resultEnteredAt: new Date(),
                resultEnteredById: enteredById,
                notes,
                status: 'PENDING_VERIFICATION', // Requires verification
            },
        });
        return updatedItem;
    }
    /**
     * Verify lab results (two-step verification)
     */
    async verifyResults(labOrderItemId, verifiedById, approved, verificationNotes) {
        const item = await prisma.labOrderItem.findUnique({
            where: { id: labOrderItemId },
            include: {
                labOrder: {
                    include: {
                        orderedBy: true,
                        patient: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!item) {
            throw new Error('Lab order item not found');
        }
        if (item.status !== 'PENDING_VERIFICATION') {
            throw new Error('Results not ready for verification');
        }
        // Update verification status
        const updatedItem = await prisma.labOrderItem.update({
            where: { id: labOrderItemId },
            data: {
                status: approved ? 'COMPLETED' : 'IN_PROGRESS',
                verifiedAt: approved ? new Date() : null,
                verifiedById: approved ? verifiedById : null,
                verificationNotes,
            },
        });
        // If approved and abnormal, notify doctor
        if (approved && item.isAbnormal) {
            await notification_service_1.notificationService.createNotification({
                userId: item.labOrder.orderedById,
                notificationType: 'CRITICAL_LAB_RESULT',
                title: '⚠️ Abnormal Lab Result',
                message: `${item.testName} for ${item.labOrder.patient.fullName}: ${item.result}`,
                relatedId: item.labOrderId,
                actionUrl: `/doctor/orders?orderId=${item.labOrderId}`,
            });
        }
        // Check if all items in order are completed
        const allItems = await prisma.labOrderItem.findMany({
            where: { labOrderId: item.labOrderId },
        });
        const allCompleted = allItems.every(i => i.status === 'COMPLETED');
        if (allCompleted) {
            await prisma.labOrder.update({
                where: { id: item.labOrderId },
                data: { status: 'COMPLETED' },
            });
            // Notify ordering doctor
            await notification_service_1.notificationService.createNotification({
                userId: item.labOrder.orderedById,
                notificationType: 'LAB_RESULT',
                title: 'Lab Results Complete',
                message: `All lab results for ${item.labOrder.patient.fullName} are ready`,
                relatedId: item.labOrderId,
                actionUrl: `/doctor/orders?orderId=${item.labOrderId}`,
            });
        }
        return updatedItem;
    }
    /**
     * Check if value is abnormal based on reference ranges
     */
    checkAbnormalValue(testName, result, sex, dateOfBirth) {
        // Parse numeric result
        const numericResult = parseFloat(result);
        if (isNaN(numericResult)) {
            return false; // Can't determine for non-numeric
        }
        // Reference ranges (simplified - should be in database)
        const ranges = {
            'Hemoglobin': sex === 'MALE' ? { min: 13, max: 17 } : { min: 12, max: 16 },
            'WBC': { min: 4000, max: 11000 },
            'Glucose': { min: 70, max: 100 },
            'Creatinine': { min: 0.6, max: 1.2 },
            'ALT': { min: 7, max: 56 },
            'AST': { min: 10, max: 40 },
        };
        const range = ranges[testName];
        if (!range) {
            return false; // No range defined
        }
        return numericResult < range.min || numericResult > range.max;
    }
    /**
     * Get pending verifications
     */
    async getPendingVerifications() {
        return await prisma.labOrderItem.findMany({
            where: {
                status: 'PENDING_VERIFICATION',
            },
            include: {
                test: true,
                labOrder: {
                    include: {
                        patient: {
                            select: {
                                fullName: true,
                                cardNumber: true,
                            },
                        },
                        orderedBy: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
                resultEnteredBy: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: {
                resultEnteredAt: 'asc',
            },
        });
    }
    /**
     * Get critical results requiring immediate attention
     */
    async getCriticalResults() {
        return await prisma.labOrderItem.findMany({
            where: {
                isAbnormal: true,
                status: {
                    in: ['PENDING_VERIFICATION', 'COMPLETED'],
                },
                verifiedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
            },
            include: {
                test: true,
                labOrder: {
                    include: {
                        patient: {
                            select: {
                                fullName: true,
                                cardNumber: true,
                            },
                        },
                        orderedBy: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                verifiedAt: 'desc',
            },
        });
    }
}
exports.LabVerificationService = LabVerificationService;
exports.labVerificationService = new LabVerificationService();
//# sourceMappingURL=lab-verification.service.js.map