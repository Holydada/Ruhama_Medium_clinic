export declare class PharmacyService {
    createDrug(data: {
        drugName: string;
        genericName?: string;
        brandName?: string;
        drugCategory?: string;
        dosageForm?: string;
        strength?: string;
        unit?: string;
        description?: string;
        sideEffects?: string;
        contraindications?: string;
        storageConditions?: string;
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        drugName: string;
        description: string | null;
        genericName: string | null;
        brandName: string | null;
        drugCategory: string | null;
        dosageForm: string | null;
        strength: string | null;
        unit: string | null;
        sideEffects: string | null;
        contraindications: string | null;
        storageConditions: string | null;
    }>;
    getDrugs(params: {
        search?: string;
        category?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        drugs: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            drugName: string;
            description: string | null;
            genericName: string | null;
            brandName: string | null;
            drugCategory: string | null;
            dosageForm: string | null;
            strength: string | null;
            unit: string | null;
            sideEffects: string | null;
            contraindications: string | null;
            storageConditions: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    addStock(data: {
        drugId: string;
        batchNumber: string;
        quantityInStock: number;
        unitPrice: number;
        sellingPrice: number;
        expiryDate: string;
        manufacturer?: string;
        supplier?: string;
        reorderLevel?: number;
        location?: string;
    }): Promise<{
        drug: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            drugName: string;
            description: string | null;
            genericName: string | null;
            brandName: string | null;
            drugCategory: string | null;
            dosageForm: string | null;
            strength: string | null;
            unit: string | null;
            sideEffects: string | null;
            contraindications: string | null;
            storageConditions: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StockStatus;
        drugId: string;
        expiryDate: Date;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        batchNumber: string;
        quantityInStock: number;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        manufacturer: string | null;
        supplier: string | null;
        receivedDate: Date | null;
        reorderLevel: number;
        location: string | null;
    }>;
    getStock(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        lowStock?: boolean;
    }): Promise<{
        stocks: ({
            drug: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                drugName: string;
                description: string | null;
                genericName: string | null;
                brandName: string | null;
                drugCategory: string | null;
                dosageForm: string | null;
                strength: string | null;
                unit: string | null;
                sideEffects: string | null;
                contraindications: string | null;
                storageConditions: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StockStatus;
            drugId: string;
            expiryDate: Date;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            batchNumber: string;
            quantityInStock: number;
            sellingPrice: import("@prisma/client/runtime/library").Decimal;
            manufacturer: string | null;
            supplier: string | null;
            receivedDate: Date | null;
            reorderLevel: number;
            location: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getStockById(id: string): Promise<{
        drug: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            drugName: string;
            description: string | null;
            genericName: string | null;
            brandName: string | null;
            drugCategory: string | null;
            dosageForm: string | null;
            strength: string | null;
            unit: string | null;
            sideEffects: string | null;
            contraindications: string | null;
            storageConditions: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StockStatus;
        drugId: string;
        expiryDate: Date;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        batchNumber: string;
        quantityInStock: number;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        manufacturer: string | null;
        supplier: string | null;
        receivedDate: Date | null;
        reorderLevel: number;
        location: string | null;
    }>;
    updateStock(id: string, data: {
        quantityInStock?: number;
        status?: string;
    }): Promise<{
        drug: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            drugName: string;
            description: string | null;
            genericName: string | null;
            brandName: string | null;
            drugCategory: string | null;
            dosageForm: string | null;
            strength: string | null;
            unit: string | null;
            sideEffects: string | null;
            contraindications: string | null;
            storageConditions: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StockStatus;
        drugId: string;
        expiryDate: Date;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        batchNumber: string;
        quantityInStock: number;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        manufacturer: string | null;
        supplier: string | null;
        receivedDate: Date | null;
        reorderLevel: number;
        location: string | null;
    }>;
    getLowStockAlerts(): Promise<({
        drug: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            drugName: string;
            description: string | null;
            genericName: string | null;
            brandName: string | null;
            drugCategory: string | null;
            dosageForm: string | null;
            strength: string | null;
            unit: string | null;
            sideEffects: string | null;
            contraindications: string | null;
            storageConditions: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StockStatus;
        drugId: string;
        expiryDate: Date;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        batchNumber: string;
        quantityInStock: number;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        manufacturer: string | null;
        supplier: string | null;
        receivedDate: Date | null;
        reorderLevel: number;
        location: string | null;
    })[]>;
    getExpiringStock(daysThreshold?: number, limit?: number): Promise<({
        drug: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            drugName: string;
            description: string | null;
            genericName: string | null;
            brandName: string | null;
            drugCategory: string | null;
            dosageForm: string | null;
            strength: string | null;
            unit: string | null;
            sideEffects: string | null;
            contraindications: string | null;
            storageConditions: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StockStatus;
        drugId: string;
        expiryDate: Date;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        batchNumber: string;
        quantityInStock: number;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        manufacturer: string | null;
        supplier: string | null;
        receivedDate: Date | null;
        reorderLevel: number;
        location: string | null;
    })[]>;
    dispenseStock(data: {
        stockId: string;
        quantity: number;
        prescriptionId?: string;
    }): Promise<{
        drug: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            drugName: string;
            description: string | null;
            genericName: string | null;
            brandName: string | null;
            drugCategory: string | null;
            dosageForm: string | null;
            strength: string | null;
            unit: string | null;
            sideEffects: string | null;
            contraindications: string | null;
            storageConditions: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StockStatus;
        drugId: string;
        expiryDate: Date;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        batchNumber: string;
        quantityInStock: number;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        manufacturer: string | null;
        supplier: string | null;
        receivedDate: Date | null;
        reorderLevel: number;
        location: string | null;
    }>;
}
//# sourceMappingURL=pharmacy.service.d.ts.map