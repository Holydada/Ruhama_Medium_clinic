import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class PatientController {
    createPatient(req: AuthRequest, res: Response): Promise<void>;
    getPatients(req: AuthRequest, res: Response): Promise<void>;
    getPatientById(req: AuthRequest, res: Response): Promise<void>;
    updatePatient(req: AuthRequest, res: Response): Promise<void>;
    getPatientHistory(req: AuthRequest, res: Response): Promise<void>;
    deletePatient(req: AuthRequest, res: Response): Promise<void>;
    checkDuplicates(req: AuthRequest, res: Response): Promise<void>;
    archivePatient(req: AuthRequest, res: Response): Promise<void>;
    restorePatient(req: AuthRequest, res: Response): Promise<void>;
    completeRegistration(req: AuthRequest, res: Response): Promise<void>;
    getPatientVisits(req: AuthRequest, res: Response): Promise<void>;
    getPatientLabResults(req: AuthRequest, res: Response): Promise<void>;
    getPatientPrescriptions(req: AuthRequest, res: Response): Promise<void>;
    getPatientVitals(req: AuthRequest, res: Response): Promise<void>;
}
export declare const patientController: PatientController;
//# sourceMappingURL=patient.controller.d.ts.map