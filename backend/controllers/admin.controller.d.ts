import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getPendingUsers: (_req: Request, res: Response) => Promise<void>;
export declare const approveUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const rejectUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const updateUserStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUserRole: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAuditLogs: (req: Request, res: Response) => Promise<void>;
export declare const getSystemStats: (_req: Request, res: Response) => Promise<void>;
export declare const getDashboardStats: (req: Request, res: Response) => Promise<void>;
export declare const getUserById: (req: Request, res: Response) => Promise<void>;
export declare const updateUserProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getRoleSummary: (_req: Request, res: Response) => Promise<void>;
export declare const exportReport: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map