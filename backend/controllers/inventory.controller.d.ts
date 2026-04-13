import { Request, Response } from 'express';
export declare class InventoryController {
    createSupplier(req: Request, res: Response): Promise<void>;
    getSuppliers(req: Request, res: Response): Promise<void>;
    createInventoryItem(req: Request, res: Response): Promise<void>;
    getInventoryItems(req: Request, res: Response): Promise<void>;
    createPurchaseInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getPurchaseInvoices(req: Request, res: Response): Promise<void>;
    createStoreRequest(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getStoreRequests(req: Request, res: Response): Promise<void>;
    approveStoreRequest(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createStockAdjustment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    approveStockAdjustment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getStockByLocation(req: Request, res: Response): Promise<void>;
    getExpiringStock(req: Request, res: Response): Promise<void>;
    getStockMovements(req: Request, res: Response): Promise<void>;
}
export declare const inventoryController: InventoryController;
//# sourceMappingURL=inventory.controller.d.ts.map