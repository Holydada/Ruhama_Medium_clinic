import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class DoctorController {
    createEncounter(req: AuthRequest, res: Response): Promise<void>;
    updateEncounter(req: AuthRequest, res: Response): Promise<void>;
    completeEncounter(req: AuthRequest, res: Response): Promise<void>;
    getEncounterById(req: AuthRequest, res: Response): Promise<void>;
    getPatientChart(req: AuthRequest, res: Response): Promise<void>;
    getDoctorQueue(req: AuthRequest, res: Response): Promise<void>;
    getDashboardStats(req: AuthRequest, res: Response): Promise<void>;
    getRecentActivity(req: AuthRequest, res: Response): Promise<void>;
    getQueueStats(req: AuthRequest, res: Response): Promise<void>;
    startVisit(req: AuthRequest, res: Response): Promise<void>;
    createLabOrder(req: AuthRequest, res: Response): Promise<void>;
    createPrescription(req: AuthRequest, res: Response): Promise<void>;
    createInjectionOrder(req: AuthRequest, res: Response): Promise<void>;
    createUltrasoundOrder(req: AuthRequest, res: Response): Promise<void>;
}
export declare const doctorController: DoctorController;
//# sourceMappingURL=doctor.controller.d.ts.map