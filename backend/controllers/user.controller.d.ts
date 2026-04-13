import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getMyProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateMyProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const changePassword: (req: AuthRequest, res: Response) => Promise<void>;
export declare const requestEmailChange: (req: AuthRequest, res: Response) => Promise<void>;
export declare const confirmEmailChange: (req: AuthRequest, res: Response) => Promise<void>;
export declare const uploadProfilePhoto: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProfilePhoto: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map