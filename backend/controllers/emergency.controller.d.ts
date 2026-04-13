import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class EmergencyController {
    createEmergencyCase(req: AuthRequest, res: Response): Promise<void>;
    updateEmergencyCase(req: AuthRequest, res: Response): Promise<void>;
    setDisposition(req: AuthRequest, res: Response): Promise<void>;
    convertToFullRegistration(req: AuthRequest, res: Response): Promise<void>;
    getActiveEmergencyCases(req: AuthRequest, res: Response): Promise<void>;
    getEmergencyCaseById(req: AuthRequest, res: Response): Promise<void>;
    getEmergencyStatistics(req: AuthRequest, res: Response): Promise<void>;
}
export declare const emergencyController: EmergencyController;
//# sourceMappingURL=emergency.controller.d.ts.map