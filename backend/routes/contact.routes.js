"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public route - anyone can submit a contact message
router.post('/submit', contact_controller_1.contactController.submitMessage);
// Protected routes - only super admin can manage messages
router.get('/messages', auth_1.authenticate, (0, auth_1.authorize)(['SUPER_ADMIN']), contact_controller_1.contactController.getAllMessages);
router.get('/messages/:id', auth_1.authenticate, (0, auth_1.authorize)(['SUPER_ADMIN']), contact_controller_1.contactController.getMessageById);
router.patch('/messages/:id/respond', auth_1.authenticate, (0, auth_1.authorize)(['SUPER_ADMIN']), contact_controller_1.contactController.respondToMessage);
router.patch('/messages/:id/status', auth_1.authenticate, (0, auth_1.authorize)(['SUPER_ADMIN']), contact_controller_1.contactController.updateMessageStatus);
router.delete('/messages/:id', auth_1.authenticate, (0, auth_1.authorize)(['SUPER_ADMIN']), contact_controller_1.contactController.deleteMessage);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map