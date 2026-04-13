import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class LabController {
    createLabTest(req: AuthRequest, res: Response): Promise<void>;
    getLabTests(req: AuthRequest, res: Response): Promise<void>;
    createLabOrder(req: AuthRequest, res: Response): Promise<void>;
    getLabOrders(req: AuthRequest, res: Response): Promise<void>;
    getLabOrderById(req: AuthRequest, res: Response): Promise<void>;
    updateLabOrderStatus(req: AuthRequest, res: Response): Promise<void>;
    updateLabResult(req: AuthRequest, res: Response): Promise<void>;
    verifyLabOrder(req: AuthRequest, res: Response): Promise<void>;
    getLabQueue(req: AuthRequest, res: Response): Promise<void>;
    addLabArtifact(req: AuthRequest, res: Response): Promise<void>;
    getLabArtifacts(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=lab.controller.d.ts.map