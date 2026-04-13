import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class AppointmentController {
    createAppointment(req: AuthRequest, res: Response): Promise<void>;
    getAppointments(req: AuthRequest, res: Response): Promise<void>;
    getAppointmentById(req: AuthRequest, res: Response): Promise<void>;
    checkInAppointment(req: AuthRequest, res: Response): Promise<void>;
    cancelAppointment(req: AuthRequest, res: Response): Promise<void>;
    rescheduleAppointment(req: AuthRequest, res: Response): Promise<void>;
    markNoShow(req: AuthRequest, res: Response): Promise<void>;
    uncheckInAppointment(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=appointment.controller.d.ts.map