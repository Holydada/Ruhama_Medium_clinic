import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class AuthController {
    register(req: Request, res: Response): Promise<void>;
    registerPatient(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: AuthRequest, res: Response): Promise<void>;
    me(req: AuthRequest, res: Response): Promise<void>;
    verifyEmail(req: Request, res: Response): Promise<void>;
    getDoctors(_req: AuthRequest, res: Response): Promise<void>;
    switchToClinical(req: AuthRequest, res: Response): Promise<void>;
    switchToAdmin(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map