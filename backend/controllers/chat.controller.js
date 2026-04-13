"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_service_1 = require("../services/chat.service");
const chatService = new chat_service_1.ChatService();
class ChatController {
    async getUsers(req, res) {
        try {
            const users = await chatService.listChatUsers(req.user.id);
            res.json({ success: true, data: users });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async getConversation(req, res) {
        try {
            const peerId = req.params.userId;
            const [messages, peer] = await Promise.all([
                chatService.getConversation(req.user.id, peerId),
                chatService.getPeerSummary(peerId),
            ]);
            res.json({ success: true, data: { messages, peer } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async sendMessage(req, res) {
        try {
            const { recipientId, message } = req.body;
            if (!recipientId || !message) {
                res.status(400).json({ success: false, error: 'recipientId and message are required' });
                return;
            }
            const result = await chatService.sendMessage(req.user.id, recipientId, message);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map