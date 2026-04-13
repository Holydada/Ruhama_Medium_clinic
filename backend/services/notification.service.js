"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NotificationService {
    /**
     * Get user notifications
     */
    async getUserNotifications(userId, options) {
        const where = { userId };
        if (options?.unreadOnly) {
            where.isRead = false;
        }
        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: options?.limit || 50,
        });
        return notifications;
    }
    /**
     * Get unread count
     */
    async getUnreadCount(userId) {
        return await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
    /**
     * Mark notification as read
     */
    async markAsRead(notificationId, userId) {
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return await prisma.notification.update({
            where: { id: notificationId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId) {
        return await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    /**
     * Delete notification
     */
    async deleteNotification(notificationId, userId) {
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return await prisma.notification.delete({
            where: { id: notificationId },
        });
    }
    /**
     * Create notification
     */
    async createNotification(data) {
        return await prisma.notification.create({
            data: {
                ...data,
                isRead: false,
            },
        });
    }
    /**
     * Notify multiple users
     */
    async notifyMultipleUsers(userIds, data) {
        const notifications = userIds.map(userId => ({
            userId,
            ...data,
            isRead: false,
        }));
        return await prisma.notification.createMany({
            data: notifications,
        });
    }
    /**
     * Notify by role
     */
    async notifyByRole(role, data) {
        const users = await prisma.user.findMany({
            where: {
                role,
                isActive: true,
            },
            select: { id: true },
        });
        const userIds = users.map(u => u.id);
        return await this.notifyMultipleUsers(userIds, data);
    }
    /**
     * Create lab result notification
     */
    async notifyLabResult(labOrderId) {
        const labOrder = await prisma.labOrder.findUnique({
            where: { id: labOrderId },
            include: {
                orderedBy: true,
                patient: {
                    select: {
                        fullName: true,
                    },
                },
                items: {
                    where: {
                        isAbnormal: true,
                    },
                },
            },
        });
        if (!labOrder)
            return;
        const hasAbnormal = labOrder.items.length > 0;
        const priority = hasAbnormal ? 'HIGH' : 'NORMAL';
        await this.createNotification({
            userId: labOrder.orderedById,
            notificationType: hasAbnormal ? 'CRITICAL_LAB_RESULT' : 'LAB_RESULT',
            title: hasAbnormal ? '⚠️ Abnormal Lab Results' : 'Lab Results Available',
            message: `Lab results for ${labOrder.patient.fullName} are ready${hasAbnormal ? ' with abnormal values' : ''}`,
            relatedId: labOrderId,
            actionUrl: `/doctor/orders?orderId=${labOrderId}`,
        });
    }
    /**
     * Create adverse event notification
     */
    async notifyAdverseEvent(injectionAdministrationId) {
        const administration = await prisma.injectionAdministration.findUnique({
            where: { id: injectionAdministrationId },
            include: {
                injectionOrder: {
                    include: {
                        orderedBy: true,
                        patient: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!administration || !administration.adverseEventOccurred)
            return;
        // Notify ordering doctor
        await this.createNotification({
            userId: administration.injectionOrder.orderedById,
            notificationType: 'ADVERSE_EVENT',
            title: '🚨 Adverse Event Reported',
            message: `Adverse event during injection for ${administration.injectionOrder.patient.fullName}: ${administration.adverseEventDetails}`,
            relatedId: injectionAdministrationId,
            actionUrl: `/nurse/injection-queue?administrationId=${injectionAdministrationId}`,
        });
        // Notify all doctors and nurses
        await this.notifyByRole('DOCTOR', {
            notificationType: 'ADVERSE_EVENT',
            title: '🚨 Adverse Event Alert',
            message: `Adverse event reported for ${administration.injectionOrder.patient.fullName}`,
            relatedId: injectionAdministrationId,
        });
    }
    /**
     * Create critical patient notification
     */
    async notifyCriticalPatient(visitId) {
        const visit = await prisma.patientVisit.findUnique({
            where: { id: visitId },
            include: {
                patient: {
                    select: {
                        fullName: true,
                    },
                },
                assignedDoctor: true,
            },
        });
        if (!visit || visit.triageLevel !== 'CRITICAL')
            return;
        if (visit.assignedDoctorId) {
            await this.createNotification({
                userId: visit.assignedDoctorId,
                notificationType: 'CRITICAL_PATIENT',
                title: '🚨 Critical Patient Alert',
                message: `Critical patient ${visit.patient.fullName} requires immediate attention`,
                relatedId: visitId,
                actionUrl: `/doctor/queue`,
            });
        }
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map