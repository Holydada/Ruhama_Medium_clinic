import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class ClinicalDecisionSupportController {
    checkDrugInteractions(req: AuthRequest, res: Response): Promise<void>;
    checkDrugAllergy(req: AuthRequest, res: Response): Promise<void>;
    assessLabValue(req: AuthRequest, res: Response): Promise<void>;
    getClinicalGuidelines(req: AuthRequest, res: Response): Promise<void>;
    checkContraindications(req: AuthRequest, res: Response): Promise<void>;
    comprehensiveDrugCheck(req: AuthRequest, res: Response): Promise<void>;
}
export declare const clinicalDecisionSupportController: ClinicalDecisionSupportController;
//# sourceMappingURL=clinical-decision-support.controller.d.ts.map