"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = exports.InventoryService = void 0;
const database_1 = __importDefault(require("../config/database"));
const withDb_1 = require("../utils/withDb");
class InventoryService {
    // ============================================
    // SUPPLIER MANAGEMENT
    // ============================================
    async createSupplier(data) {
        return (0, withDb_1.withDb)(() => database_1.default.supplier.create({
            data: {
                ...data,
                isActive: true,
            },
        }));
    }
    async getSuppliers(params) {
        const where = {};
        if (params?.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { tin: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params?.isActive !== undefined) {
            where.isActive = params.isActive;
        }
        return await database_1.default.supplier.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }
    // ============================================
    // INVENTORY ITEM MANAGEMENT
    // ============================================
    async createInventoryItem(data) {
        return (0, withDb_1.withDb)(() => database_1.default.inventoryItem.create({
            data: {
                ...data,
                reorderLevel: data.reorderLevel || 10,
                isActive: true,
            },
        }));
    }
    async getInventoryItems(params) {
        const where = {};
        if (params?.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { genericName: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params?.category) {
            where.category = params.category;
        }
        if (params?.isActive !== undefined) {
            where.isActive = params.isActive;
        }
        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            database_1.default.inventoryItem.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                include: {
                    batches: {
                        include: {
                            stock: true,
                        },
                    },
                },
            }),
            database_1.default.inventoryItem.count({ where }),
        ]);
        return {
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // ============================================
    // PURCHASE INVOICE & STOCK RECEIVING
    // ============================================
    async createPurchaseInvoice(data, createdById) {
        // Validate supplier
        const supplier = await database_1.default.supplier.findUnique({
            where: { id: data.supplierId },
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        // Calculate total
        const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
        // Create invoice with batches and stock in transaction
        return (0, withDb_1.withDb)(() => database_1.default.$transaction(async (tx) => {
            // Create invoice
            const invoice = await tx.purchaseInvoice.create({
                data: {
                    invoiceNumber: data.invoiceNumber,
                    supplierId: data.supplierId,
                    invoiceDate: data.invoiceDate,
                    invoicePhotoPath: data.invoicePhotoPath,
                    totalAmount,
                    status: 'UNPAID',
                    createdById,
                },
            });
            // Get MAIN_STORE location
            let mainStore = await tx.inventoryLocation.findFirst({
                where: { type: 'MAIN_STORE' },
            });
            if (!mainStore) {
                mainStore = await tx.inventoryLocation.create({
                    data: {
                        name: 'Main Store',
                        type: 'MAIN_STORE',
                        isActive: true,
                    },
                });
            }
            // Create batches and stock for each item
            for (const item of data.items) {
                // Create batch
                const batch = await tx.inventoryBatch.create({
                    data: {
                        itemId: item.itemId,
                        supplierId: data.supplierId,
                        batchNumber: item.batchNumber,
                        expiryDate: item.expiryDate,
                        unitCost: item.unitCost,
                        invoiceId: invoice.id,
                    },
                });
                // Create stock at main store
                await tx.inventoryStock.create({
                    data: {
                        batchId: batch.id,
                        locationId: mainStore.id,
                        quantityOnHand: item.quantity,
                    },
                });
                // Create stock movement
                await tx.stockMovement.create({
                    data: {
                        itemId: item.itemId,
                        batchId: batch.id,
                        toLocationId: mainStore.id,
                        quantity: item.quantity,
                        movementType: 'PURCHASE_IN',
                        reason: `Purchase from ${supplier.name} - Invoice ${data.invoiceNumber}`,
                        referenceType: 'PurchaseInvoice',
                        referenceId: invoice.id,
                        createdById,
                    },
                });
            }
            return invoice;
        }));
    }
    async getPurchaseInvoices(params) {
        const where = {};
        if (params?.supplierId) {
            where.supplierId = params.supplierId;
        }
        if (params?.status) {
            where.status = params.status;
        }
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const skip = (page - 1) * limit;
        const [invoices, total] = await Promise.all([
            database_1.default.purchaseInvoice.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    supplier: true,
                    batches: {
                        include: {
                            item: true,
                            stock: true,
                        },
                    },
                },
            }),
            database_1.default.purchaseInvoice.count({ where }),
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
    // ============================================
    // STOCK TRANSFER (Store → Pharmacy/Injection Room)
    // ============================================
    async createStoreRequest(data, requestedById) {
        const count = await database_1.default.storeRequest.count();
        const requestNumber = `SR-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        // Get MAIN_STORE location
        const mainStore = await database_1.default.inventoryLocation.findFirst({
            where: { type: 'MAIN_STORE' },
        });
        if (!mainStore) {
            throw new Error('Main store location not found');
        }
        return (0, withDb_1.withDb)(() => database_1.default.storeRequest.create({
            data: {
                requestNumber,
                requestedById,
                fromLocationId: mainStore.id,
                toLocationId: data.toLocationId,
                status: 'PENDING',
                notes: data.notes,
                items: {
                    create: data.items,
                },
            },
            include: {
                items: {
                    include: {
                        item: true,
                    },
                },
                requestedBy: {
                    select: {
                        fullName: true,
                        role: true,
                    },
                },
            },
        }));
    }
    async getStoreRequests(params) {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.toLocationId) {
            where.toLocationId = params.toLocationId;
        }
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const skip = (page - 1) * limit;
        const [requests, total] = await Promise.all([
            database_1.default.storeRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { requestedAt: 'desc' },
                include: {
                    items: {
                        include: {
                            item: true,
                        },
                    },
                    requestedBy: {
                        select: {
                            fullName: true,
                            role: true,
                        },
                    },
                },
            }),
            database_1.default.storeRequest.count({ where }),
        ]);
        return {
            requests,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async approveStoreRequest(requestId, approvals, approvedById) {
        const request = await database_1.default.storeRequest.findUnique({
            where: { id: requestId },
            include: {
                items: true,
            },
        });
        if (!request) {
            throw new Error('Store request not found');
        }
        if (request.status !== 'PENDING') {
            throw new Error('Request is not pending');
        }
        return (0, withDb_1.withDb)(() => database_1.default.$transaction(async (tx) => {
            // Update request status
            await tx.storeRequest.update({
                where: { id: requestId },
                data: {
                    status: 'APPROVED',
                    approvedById,
                    approvedAt: new Date(),
                },
            });
            // Process each approval
            for (const approval of approvals) {
                // Update request item
                const requestItem = request.items.find((item) => item.itemId === approval.itemId);
                if (!requestItem)
                    continue;
                await tx.storeRequestItem.update({
                    where: { id: requestItem.id },
                    data: {
                        approvedQty: approval.approvedQty,
                        batchId: approval.batchId,
                    },
                });
                // Get stock at main store
                const mainStoreStock = await tx.inventoryStock.findUnique({
                    where: {
                        batchId_locationId: {
                            batchId: approval.batchId,
                            locationId: request.fromLocationId,
                        },
                    },
                });
                if (!mainStoreStock || mainStoreStock.quantityOnHand < approval.approvedQty) {
                    throw new Error(`Insufficient stock for item ${approval.itemId}`);
                }
                // Decrement main store stock
                await tx.inventoryStock.update({
                    where: {
                        batchId_locationId: {
                            batchId: approval.batchId,
                            locationId: request.fromLocationId,
                        },
                    },
                    data: {
                        quantityOnHand: mainStoreStock.quantityOnHand - approval.approvedQty,
                    },
                });
                // Increment destination stock (or create if doesn't exist)
                const destStock = await tx.inventoryStock.findUnique({
                    where: {
                        batchId_locationId: {
                            batchId: approval.batchId,
                            locationId: request.toLocationId,
                        },
                    },
                });
                if (destStock) {
                    await tx.inventoryStock.update({
                        where: {
                            batchId_locationId: {
                                batchId: approval.batchId,
                                locationId: request.toLocationId,
                            },
                        },
                        data: {
                            quantityOnHand: destStock.quantityOnHand + approval.approvedQty,
                        },
                    });
                }
                else {
                    await tx.inventoryStock.create({
                        data: {
                            batchId: approval.batchId,
                            locationId: request.toLocationId,
                            quantityOnHand: approval.approvedQty,
                        },
                    });
                }
                // Create stock movement
                await tx.stockMovement.create({
                    data: {
                        itemId: approval.itemId,
                        batchId: approval.batchId,
                        fromLocationId: request.fromLocationId,
                        toLocationId: request.toLocationId,
                        quantity: approval.approvedQty,
                        movementType: 'TRANSFER_OUT',
                        reason: `Store request ${request.requestNumber}`,
                        referenceType: 'StoreRequest',
                        referenceId: requestId,
                        createdById: approvedById,
                    },
                });
            }
            return request;
        }));
    }
    // ============================================
    // STOCK ADJUSTMENT
    // ============================================
    async createStockAdjustment(data, createdById) {
        return (0, withDb_1.withDb)(() => database_1.default.stockAdjustment.create({
            data: {
                ...data,
                status: 'PENDING',
                createdById,
            },
            include: {
                item: true,
                location: true,
            },
        }));
    }
    async approveStockAdjustment(adjustmentId, approvedById) {
        const adjustment = await database_1.default.stockAdjustment.findUnique({
            where: { id: adjustmentId },
        });
        if (!adjustment) {
            throw new Error('Stock adjustment not found');
        }
        if (adjustment.status !== 'PENDING') {
            throw new Error('Adjustment is not pending');
        }
        return (0, withDb_1.withDb)(() => database_1.default.$transaction(async (tx) => {
            // Update adjustment status
            await tx.stockAdjustment.update({
                where: { id: adjustmentId },
                data: {
                    status: 'APPROVED',
                    approvedById,
                    approvedAt: new Date(),
                },
            });
            // Apply adjustment to stock
            if (adjustment.batchId) {
                const stock = await tx.inventoryStock.findUnique({
                    where: {
                        batchId_locationId: {
                            batchId: adjustment.batchId,
                            locationId: adjustment.locationId,
                        },
                    },
                });
                if (!stock) {
                    throw new Error('Stock not found');
                }
                const newQty = stock.quantityOnHand + adjustment.qtyChange;
                if (newQty < 0) {
                    throw new Error('Adjustment would result in negative stock');
                }
                await tx.inventoryStock.update({
                    where: {
                        batchId_locationId: {
                            batchId: adjustment.batchId,
                            locationId: adjustment.locationId,
                        },
                    },
                    data: {
                        quantityOnHand: newQty,
                    },
                });
                // Create stock movement
                await tx.stockMovement.create({
                    data: {
                        itemId: adjustment.itemId,
                        batchId: adjustment.batchId,
                        toLocationId: adjustment.qtyChange > 0 ? adjustment.locationId : undefined,
                        fromLocationId: adjustment.qtyChange < 0 ? adjustment.locationId : undefined,
                        quantity: Math.abs(adjustment.qtyChange),
                        movementType: adjustment.qtyChange > 0 ? 'ADJUSTMENT_PLUS' : 'ADJUSTMENT_MINUS',
                        reason: adjustment.reason,
                        referenceType: 'StockAdjustment',
                        referenceId: adjustmentId,
                        createdById: approvedById,
                    },
                });
            }
            return adjustment;
        }));
    }
    // ============================================
    // STOCK QUERIES
    // ============================================
    async getStockByLocation(locationId, params) {
        const where = {
            locationId,
        };
        const stocks = await database_1.default.inventoryStock.findMany({
            where,
            include: {
                batch: {
                    include: {
                        item: true,
                        supplier: true,
                    },
                },
                location: true,
            },
            orderBy: {
                batch: {
                    expiryDate: 'asc',
                },
            },
        });
        // Filter low stock if requested
        if (params?.lowStock) {
            return stocks.filter((stock) => stock.quantityOnHand <= stock.batch.item.reorderLevel);
        }
        return stocks;
    }
    async getExpiringStock(daysThreshold = 90) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        return await database_1.default.inventoryStock.findMany({
            where: {
                batch: {
                    expiryDate: {
                        lte: thresholdDate,
                    },
                },
                quantityOnHand: {
                    gt: 0,
                },
            },
            include: {
                batch: {
                    include: {
                        item: true,
                    },
                },
                location: true,
            },
            orderBy: {
                batch: {
                    expiryDate: 'asc',
                },
            },
        });
    }
    async getStockMovements(params) {
        const where = {};
        if (params?.itemId) {
            where.itemId = params.itemId;
        }
        if (params?.locationId) {
            where.OR = [{ fromLocationId: params.locationId }, { toLocationId: params.locationId }];
        }
        if (params?.movementType) {
            where.movementType = params.movementType;
        }
        if (params?.startDate || params?.endDate) {
            where.createdAt = {};
            if (params.startDate)
                where.createdAt.gte = params.startDate;
            if (params.endDate)
                where.createdAt.lte = params.endDate;
        }
        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const skip = (page - 1) * limit;
        const [movements, total] = await Promise.all([
            database_1.default.stockMovement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    item: true,
                    batch: true,
                    fromLocation: true,
                    toLocation: true,
                    createdBy: {
                        select: {
                            fullName: true,
                            role: true,
                        },
                    },
                },
            }),
            database_1.default.stockMovement.count({ where }),
        ]);
        return {
            movements,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.InventoryService = InventoryService;
exports.inventoryService = new InventoryService();
//# sourceMappingURL=inventory.service.js.map