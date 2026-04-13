import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class PrescriptionController {
    createPrescription(req: AuthRequest, res: Response): Promise<void>;
    getPrescriptions(req: AuthRequest, res: Response): Promise<void>;
    getPrescriptionById(req: AuthRequest, res: Response): Promise<void>;
    dispensePrescription(req: AuthRequest, res: Response): Promise<void>;
    cancelPrescription(req: AuthRequest, res: Response): Promise<void>;
    getPrescriptionQueue(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=prescription.controller.d.ts.map