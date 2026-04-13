import { Request, Response } from 'express';
export declare const createTransaction: (req: Request, res: Response) => Promise<void>;
export declare const getTransactions: (req: Request, res: Response) => Promise<void>;
export declare const markTransactionPaid: (req: Request, res: Response) => Promise<void>;
export declare const requestRefund: (req: Request, res: Response) => Promise<void>;
export declare const approveRefund: (req: Request, res: Response) => Promise<void>;
export declare const createInvoice: (req: Request, res: Response) => Promise<void>;
export declare const getInvoices: (req: Request, res: Response) => Promise<void>;
export declare const payInvoice: (req: Request, res: Response) => Promise<void>;
export declare const getRevenueReport: (req: Request, res: Response) => Promise<void>;
export declare const getDailyRevenue: (req: Request, res: Response) => Promise<void>;
export declare const getDailyCloseoutSummary: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=finance.controller.d.ts.map