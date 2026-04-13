import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class VisitController {
    createVisit(req: AuthRequest, res: Response): Promise<void>;
    getVisits(req: AuthRequest, res: Response): Promise<void>;
    getVisitById(req: AuthRequest, res: Response): Promise<void>;
    updateVisitStatus(req: AuthRequest, res: Response): Promise<void>;
    assignDoctor(req: AuthRequest, res: Response): Promise<void>;
    saveSoapNote(req: AuthRequest, res: Response): Promise<void>;
    getEncounterTimeline(req: AuthRequest, res: Response): Promise<void>;
    recordNurseVitals(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=visit.controller.d.ts.map