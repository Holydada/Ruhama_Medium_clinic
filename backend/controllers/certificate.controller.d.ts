import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class CertificateController {
    createSickLeaveCertificate(req: AuthRequest, res: Response): Promise<void>;
    getSickLeaveCertificate(req: AuthRequest, res: Response): Promise<void>;
    getPatientSickLeaveCertificates(req: AuthRequest, res: Response): Promise<void>;
    createMedicalCertificate(req: AuthRequest, res: Response): Promise<void>;
    updateMedicalCertificate(req: AuthRequest, res: Response): Promise<void>;
    signMedicalCertificate(req: AuthRequest, res: Response): Promise<void>;
    getMedicalCertificate(req: AuthRequest, res: Response): Promise<void>;
    getPatientMedicalCertificates(req: AuthRequest, res: Response): Promise<void>;
}
export declare const certificateController: CertificateController;
//# sourceMappingURL=certificate.controller.d.ts.map