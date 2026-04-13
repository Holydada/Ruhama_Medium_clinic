import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class NurseController {
    createTriage(req: AuthRequest, res: Response): Promise<void>;
    getTriageQueue(req: AuthRequest, res: Response): Promise<void>;
    recordVitalSigns(req: AuthRequest, res: Response): Promise<void>;
    getVitalSignsHistory(req: AuthRequest, res: Response): Promise<void>;
    createNursingNote(req: AuthRequest, res: Response): Promise<void>;
    updateNursingNote(req: AuthRequest, res: Response): Promise<void>;
    lockNursingNote(req: AuthRequest, res: Response): Promise<void>;
    getNursingNotes(req: AuthRequest, res: Response): Promise<void>;
    getInjectionQueue(req: AuthRequest, res: Response): Promise<void>;
    administerInjection(req: AuthRequest, res: Response): Promise<void>;
    getObservationBoard(req: AuthRequest, res: Response): Promise<void>;
}
export declare const nurseController: NurseController;
//# sourceMappingURL=nurse.controller.d.ts.map