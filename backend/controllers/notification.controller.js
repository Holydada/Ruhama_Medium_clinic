"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
class NotificationController {
    async getNotifications(req, res) {
        try {
            const userId = req.user.id;
            const { unreadOnly, limit } = req.query;
            const notifications = await notification_service_1.notificationService.getUserNotifications(userId, {
                unreadOnly: unreadOnly === 'true',
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json({
                success: true,
                data: notifications,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getUnreadCount(req, res) {
        try {
            const userId = req.user.id;
            const count = await notification_service_1.notificationService.getUnreadCount(userId);
            res.json({
                success: true,
                data: { count },
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const notification = await notification_service_1.notificationService.markAsRead(id, userId);
            res.json({
                success: true,
                data: notification,
                message: 'Notification marked as read',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async markAllAsRead(req, res) {
        try {
            const userId = req.user.id;
            await notification_service_1.notificationService.markAllAsRead(userId);
            res.json({
                success: true,
                message: 'All notifications marked as read',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async deleteNotification(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await notification_service_1.notificationService.deleteNotification(id, userId);
            res.json({
                success: true,
                message: 'Notification deleted',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();
//# sourceMappingURL=notification.controller.js.map