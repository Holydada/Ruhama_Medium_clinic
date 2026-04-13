"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Get user notifications
router.get('/', (req, res) => notification_controller_1.notificationController.getNotifications(req, res));
// Get unread count
router.get('/unread-count', (req, res) => notification_controller_1.notificationController.getUnreadCount(req, res));
// Mark notification as read
router.put('/:id/read', (req, res) => notification_controller_1.notificationController.markAsRead(req, res));
// Mark all as read
router.put('/read-all', (req, res) => notification_controller_1.notificationController.markAllAsRead(req, res));
// Delete notification
router.delete('/:id', (req, res) => notification_controller_1.notificationController.deleteNotification(req, res));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map