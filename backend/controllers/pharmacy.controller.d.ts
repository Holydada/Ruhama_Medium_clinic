import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createDrug: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getDrugs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addStock: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStock: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStockById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateStock: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLowStockAlerts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getExpiringStock: (req: AuthRequest, res: Response) => Promise<void>;
export declare const dispenseStock: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=pharmacy.controller.d.ts.map