import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class NotificationController {
    getNotifications(req: AuthRequest, res: Response): Promise<void>;
    getUnreadCount(req: AuthRequest, res: Response): Promise<void>;
    markAsRead(req: AuthRequest, res: Response): Promise<void>;
    markAllAsRead(req: AuthRequest, res: Response): Promise<void>;
    deleteNotification(req: AuthRequest, res: Response): Promise<void>;
}
export declare const notificationController: NotificationController;
//# sourceMappingURL=notification.controller.d.ts.map