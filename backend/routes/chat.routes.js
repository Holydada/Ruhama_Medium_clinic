"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
const chatController = new chat_controller_1.ChatController();
router.use(auth_1.authenticate);
router.get('/users', chatController.getUsers.bind(chatController));
router.get('/conversations/:userId', chatController.getConversation.bind(chatController));
router.post('/messages', chatController.sendMessage.bind(chatController));
exports.default = router;
//# sourceMappingURL=chat.routes.js.map