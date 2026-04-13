export declare class InventoryService {
    createSupplier(data: {
        name: string;
        tin?: string;
        phone?: string;
        address?: string;
        contactPerson?: string;
        email?: string;
    }): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        tin: string | null;
        contactPerson: string | null;
    }>;
    getSuppliers(params?: {
        search?: string;
        isActive?: boolean;
    }): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        tin: string | null;
        contactPerson: string | null;
    }[]>;
    createInventoryItem(data: {
        name: string;
        genericName?: string;
        strength?: string;
        form?: string;
        category?: string;
        unit?: string;
        reorderLevel?: number;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        genericName: string | null;
        strength: string | null;
        unit: string | null;
        category: string | null;
        reorderLevel: number;
        form: string | null;
    }>;
    getInventoryItems(params?: {
        search?: string;
        category?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        items: ({
            batches: ({
                stock: {
                    id: string;
                    updatedAt: Date;
                    batchId: string;
                    locationId: string;
                    quantityOnHand: number;
                }[];
            } & {
                id: string;
                createdAt: Date;
                expiryDate: Date;
                invoiceId: string | null;
                itemId: string;
                batchNumber: string;
                supplierId: string | null;
                unitCost: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            genericName: string | null;
            strength: string | null;
            unit: string | null;
            category: string | null;
            reorderLevel: number;
            form: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createPurchaseInvoice(data: {
        supplierId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        invoicePhotoPath?: string;
        items: Array<{
            itemId: string;
            batchNumber: string;
            expiryDate: Date;
            quantity: number;
            unitCost: number;
        }>;
    }, createdById: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        invoiceNumber: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        createdById: string;
        supplierId: string;
        invoiceDate: Date;
        invoicePhotoPath: string | null;
    }>;
    getPurchaseInvoices(params?: {
        supplierId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        invoices: ({
            supplier: {
                name: string;
                id: string;
                email: string | null;
                phone: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                tin: string | null;
                contactPerson: string | null;
            };
            batches: ({
                item: {
                    name: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    genericName: string | null;
                    strength: string | null;
                    unit: string | null;
                    category: string | null;
                    reorderLevel: number;
                    form: string | null;
                };
                stock: {
                    id: string;
                    updatedAt: Date;
                    batchId: string;
                    locationId: string;
                    quantityOnHand: number;
                }[];
            } & {
                id: string;
                createdAt: Date;
                expiryDate: Date;
                invoiceId: string | null;
                itemId: string;
                batchNumber: string;
                supplierId: string | null;
                unitCost: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            invoiceNumber: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            createdById: string;
            supplierId: string;
            invoiceDate: Date;
            invoicePhotoPath: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createStoreRequest(data: {
        toLocationId: string;
        items: Array<{
            itemId: string;
            requestedQty: number;
            notes?: string;
        }>;
        notes?: string;
    }, requestedById: string): Promise<{
        items: ({
            item: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                genericName: string | null;
                strength: string | null;
                unit: string | null;
                category: string | null;
                reorderLevel: number;
                form: string | null;
            };
        } & {
            id: string;
            notes: string | null;
            itemId: string;
            requestedQty: number;
            approvedQty: number | null;
            batchId: string | null;
            requestId: string;
        })[];
        requestedBy: {
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        approvedById: string | null;
        approvedAt: Date | null;
        status: import(".prisma/client").$Enums.StoreRequestStatus;
        notes: string | null;
        requestNumber: string;
        requestedById: string;
        fromLocationId: string;
        toLocationId: string;
        requestedAt: Date;
        rejectedReason: string | null;
    }>;
    getStoreRequests(params?: {
        status?: string;
        toLocationId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        requests: ({
            items: ({
                item: {
                    name: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    genericName: string | null;
                    strength: string | null;
                    unit: string | null;
                    category: string | null;
                    reorderLevel: number;
                    form: string | null;
                };
            } & {
                id: string;
                notes: string | null;
                itemId: string;
                requestedQty: number;
                approvedQty: number | null;
                batchId: string | null;
                requestId: string;
            })[];
            requestedBy: {
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            approvedById: string | null;
            approvedAt: Date | null;
            status: import(".prisma/client").$Enums.StoreRequestStatus;
            notes: string | null;
            requestNumber: string;
            requestedById: string;
            fromLocationId: string;
            toLocationId: string;
            requestedAt: Date;
            rejectedReason: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    approveStoreRequest(requestId: string, approvals: Array<{
        itemId: string;
        approvedQty: number;
        batchId: string;
    }>, approvedById: string): Promise<{
        items: {
            id: string;
            notes: string | null;
            itemId: string;
            requestedQty: number;
            approvedQty: number | null;
            batchId: string | null;
            requestId: string;
        }[];
    } & {
        id: string;
        approvedById: string | null;
        approvedAt: Date | null;
        status: import(".prisma/client").$Enums.StoreRequestStatus;
        notes: string | null;
        requestNumber: string;
        requestedById: string;
        fromLocationId: string;
        toLocationId: string;
        requestedAt: Date;
        rejectedReason: string | null;
    }>;
    createStockAdjustment(data: {
        itemId: string;
        batchId?: string;
        locationId: string;
        qtyChange: number;
        reason: string;
    }, createdById: string): Promise<{
        location: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            type: import(".prisma/client").$Enums.LocationType;
        };
        item: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            genericName: string | null;
            strength: string | null;
            unit: string | null;
            category: string | null;
            reorderLevel: number;
            form: string | null;
        };
    } & {
        id: string;
        approvedById: string | null;
        approvedAt: Date | null;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AdjustmentStatus;
        reason: string;
        itemId: string;
        createdById: string;
        batchId: string | null;
        locationId: string;
        qtyChange: number;
    }>;
    approveStockAdjustment(adjustmentId: string, approvedById: string): Promise<{
        id: string;
        approvedById: string | null;
        approvedAt: Date | null;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AdjustmentStatus;
        reason: string;
        itemId: string;
        createdById: string;
        batchId: string | null;
        locationId: string;
        qtyChange: number;
    }>;
    getStockByLocation(locationId: string, params?: {
        lowStock?: boolean;
    }): Promise<({
        location: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            type: import(".prisma/client").$Enums.LocationType;
        };
        batch: {
            supplier: {
                name: string;
                id: string;
                email: string | null;
                phone: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                tin: string | null;
                contactPerson: string | null;
            };
            item: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                genericName: string | null;
                strength: string | null;
                unit: string | null;
                category: string | null;
                reorderLevel: number;
                form: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            expiryDate: Date;
            invoiceId: string | null;
            itemId: string;
            batchNumber: string;
            supplierId: string | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        updatedAt: Date;
        batchId: string;
        locationId: string;
        quantityOnHand: number;
    })[]>;
    getExpiringStock(daysThreshold?: number): Promise<({
        location: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            type: import(".prisma/client").$Enums.LocationType;
        };
        batch: {
            item: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                genericName: string | null;
                strength: string | null;
                unit: string | null;
                category: string | null;
                reorderLevel: number;
                form: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            expiryDate: Date;
            invoiceId: string | null;
            itemId: string;
            batchNumber: string;
            supplierId: string | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        updatedAt: Date;
        batchId: string;
        locationId: string;
        quantityOnHand: number;
    })[]>;
    getStockMovements(params?: {
        itemId?: string;
        locationId?: string;
        movementType?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        movements: ({
            batch: {
                id: string;
                createdAt: Date;
                expiryDate: Date;
                invoiceId: string | null;
                itemId: string;
                batchNumber: string;
                supplierId: string | null;
                unitCost: import("@prisma/client/runtime/library").Decimal;
            };
            createdBy: {
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
            item: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                genericName: string | null;
                strength: string | null;
                unit: string | null;
                category: string | null;
                reorderLevel: number;
                form: string | null;
            };
            fromLocation: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                type: import(".prisma/client").$Enums.LocationType;
            };
            toLocation: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                type: import(".prisma/client").$Enums.LocationType;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            reason: string | null;
            itemId: string;
            createdById: string;
            fromLocationId: string | null;
            toLocationId: string | null;
            batchId: string | null;
            movementType: import(".prisma/client").$Enums.MovementType;
            referenceType: string | null;
            referenceId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
export declare const inventoryService: InventoryService;
//# sourceMappingURL=inventory.service.d.ts.map