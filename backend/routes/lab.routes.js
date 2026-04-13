"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all lab tests
router.get('/tests', auth_1.authenticate, async (req, res) => {
    try {
        const tests = await prisma.labTest.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                testName: true,
                testCategory: true,
                price: true,
            },
            orderBy: {
                testCategory: 'asc'
            }
        });
        // Map to frontend format
        const formattedTests = tests.map(test => ({
            id: test.id,
            name: test.testName,
            category: test.testCategory || 'Other',
            price: test.price ? Number(test.price) : 0
        }));
        res.json({
            success: true,
            data: formattedTests
        });
    }
    catch (error) {
        console.error('Error fetching lab tests:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lab tests'
        });
    }
});

// Get lab queue (alias for /orders with pending status) - MUST BE BEFORE /orders route
router.get('/orders/queue', auth_1.authenticate, async (req, res) => {
    try {
        const orders = await prisma.labOrder.findMany({
            where: {
                status: {
                    in: ['PENDING', 'IN_PROGRESS']
                }
            },
            take: 100,
            orderBy: {
                orderedAt: 'asc'
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                    }
                },
                orderedBy: {
                    select: {
                        fullName: true,
                    }
                },
                items: {
                    include: {
                        test: true,
                    }
                }
            }
        });
        // Map to frontend format
        const formattedOrders = orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            orderedAt: order.orderedAt.toISOString(),
            status: order.status,
            urgency: order.priority,
            patient: {
                id: order.patient.id,
                cardNumber: order.patient.cardNumber,
                fullName: order.patient.fullName,
                sex: order.patient.sex,
                dateOfBirth: order.patient.dateOfBirth.toISOString(),
            },
            orderedBy: order.orderedBy,
            items: order.items.map((item) => ({
                id: item.id,
                testName: item.testName,
                status: item.status,
                result: item.result,
                isAbnormal: item.isAbnormal,
            }))
        }));
        res.json({
            success: true,
            data: formattedOrders
        });
    }
    catch (error) {
        console.error('Error fetching lab queue:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lab queue'
        });
    }
});

// Get lab orders (for lab queue)
router.get('/orders', auth_1.authenticate, async (req, res) => {
    try {
        const { status, limit } = req.query;
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        const orders = await prisma.labOrder.findMany({
            where: whereClause,
            take: limit ? parseInt(limit) : 50,
            orderBy: {
                orderedAt: 'desc'
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                    }
                },
                orderedBy: {
                    select: {
                        fullName: true,
                    }
                },
                items: {
                    include: {
                        test: true,
                    }
                }
            }
        });
        // Map to frontend format
        const formattedOrders = orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            orderedAt: order.orderedAt.toISOString(),
            status: order.status,
            urgency: order.priority,
            patient: {
                id: order.patient.id,
                cardNumber: order.patient.cardNumber,
                fullName: order.patient.fullName,
                sex: order.patient.sex,
                dateOfBirth: order.patient.dateOfBirth.toISOString(),
            },
            orderedBy: order.orderedBy,
            items: order.items.map((item) => ({
                id: item.id,
                testName: item.testName,
                status: item.status,
                result: item.result,
                isAbnormal: item.isAbnormal,
            }))
        }));
        res.json({
            success: true,
            data: formattedOrders
        });
    }
    catch (error) {
        console.error('Error fetching lab orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lab orders'
        });
    }
});

// Add result to lab order item
router.post('/orders/:orderId/results', auth_1.authenticate, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { itemId, result, isAbnormal } = req.body;
        await prisma.labOrderItem.update({
            where: { id: itemId },
            data: {
                result,
                isAbnormal: isAbnormal || false,
                status: 'COMPLETED',
            }
        });
        res.json({
            success: true,
            message: 'Result added successfully'
        });
    }
    catch (error) {
        console.error('Error adding lab result:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add result'
        });
    }
});
// Update lab order status
router.patch('/orders/:orderId/status', auth_1.authenticate, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        await prisma.labOrder.update({
            where: { id: orderId },
            data: {
                status,
                completedAt: status === 'COMPLETED' ? new Date() : undefined,
                verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
                verifiedById: status === 'VERIFIED' ? req.user?.id : undefined,
            }
        });
        res.json({
            success: true,
            message: 'Status updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating lab order status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update status'
        });
    }
});
exports.default = router;
//# sourceMappingURL=lab.routes.js.map