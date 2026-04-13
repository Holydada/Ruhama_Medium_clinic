export declare class PharmacyStockService {
    getStockLevel(drugId: string): Promise<{
        drugId: string;
        drugName: string;
        totalStock: number;
        reorderLevel: number;
        status: string;
        batches: any[];
    }>;
    getAllStockLevels(): Promise<{
        drugId: string;
        drugName: string;
        totalStock: number;
        reorderLevel: number;
        status: string;
    }[]>;
    dispensePrescription(prescriptionId: string, dispensedById: string): Promise<void>;
    getExpiringStock(daysAhead?: number): Promise<any[]>;
    getLowStockAlerts(): Promise<any[]>;
}
export declare const pharmacyStockService: PharmacyStockService;
//# sourceMappingURL=pharmacy-stock.service.d.ts.map