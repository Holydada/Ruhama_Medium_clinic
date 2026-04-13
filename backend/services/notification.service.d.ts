export declare class NotificationService {
    /**
     * Get user notifications
     */
    getUserNotifications(userId: string, options?: {
        unreadOnly?: boolean;
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        notificationType: string;
        title: string;
        isRead: boolean;
        relatedId: string | null;
        readAt: Date | null;
    }[]>;
    /**
     * Get unread count
     */
    getUnreadCount(userId: string): Promise<number>;
    /**
     * Mark notification as read
     */
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        notificationType: string;
        title: string;
        isRead: boolean;
        relatedId: string | null;
        readAt: Date | null;
    }>;
    /**
     * Mark all notifications as read
     */
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    /**
     * Delete notification
     */
    deleteNotification(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        notificationType: string;
        title: string;
        isRead: boolean;
        relatedId: string | null;
        readAt: Date | null;
    }>;
    /**
     * Create notification
     */
    createNotification(data: {
        userId: string;
        notificationType: string;
        title: string;
        message: string;
        relatedId?: string;
        actionUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        notificationType: string;
        title: string;
        isRead: boolean;
        relatedId: string | null;
        readAt: Date | null;
    }>;
    /**
     * Notify multiple users
     */
    notifyMultipleUsers(userIds: string[], data: {
        notificationType: string;
        title: string;
        message: string;
        relatedId?: string;
        actionUrl?: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    /**
     * Notify by role
     */
    notifyByRole(role: string, data: {
        notificationType: string;
        title: string;
        message: string;
        relatedId?: string;
        actionUrl?: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    /**
     * Create lab result notification
     */
    notifyLabResult(labOrderId: string): Promise<void>;
    /**
     * Create adverse event notification
     */
    notifyAdverseEvent(injectionAdministrationId: string): Promise<void>;
    /**
     * Create critical patient notification
     */
    notifyCriticalPatient(visitId: string): Promise<void>;
}
export declare const notificationService: NotificationService;
//# sourceMappingURL=notification.service.d.ts.map