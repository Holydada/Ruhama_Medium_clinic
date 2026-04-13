import { Request, Response } from 'express';
export declare const createInjectionOrder: (req: Request, res: Response) => Promise<void>;
export declare const getInjectionOrders: (req: Request, res: Response) => Promise<void>;
export declare const getInjectionOrderById: (req: Request, res: Response) => Promise<void>;
export declare const administerInjection: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAdministrationHistory: (req: Request, res: Response) => Promise<void>;
export declare const cancelInjectionOrder: (req: Request, res: Response) => Promise<void>;
export declare const getInjectionQueue: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=injection.controller.d.ts.map