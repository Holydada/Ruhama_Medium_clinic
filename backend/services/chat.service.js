"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
class ChatService {
    async getPeerSummary(userId) {
        return database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                role: true,
                department: true,
                email: true,
                profilePhoto: true,
            },
        });
    }
    async listChatUsers(currentUserId) {
        return database_1.default.user.findMany({
            where: {
                id: { not: currentUserId },
                isActive: true,
                isApproved: true,
                role: { not: client_1.UserRole.PATIENT },
            },
            select: {
                id: true,
                fullName: true,
                role: true,
                department: true,
                profilePhoto: true,
            },
            orderBy: { fullName: 'asc' },
        });
    }
    async getConversation(currentUserId, withUserId) {
        const rows = await database_1.default.notification.findMany({
            where: {
                userId: currentUserId,
                notificationType: 'CHAT_DM',
                relatedId: withUserId,
            },
            orderBy: { createdAt: 'asc' },
            take: 200,
        });
        return rows.map((row) => {
            let senderId = '';
            let senderName = 'Unknown';
            if (row.title.startsWith('FROM:')) {
                const rest = row.title.slice(5);
                const pipe = rest.indexOf('|');
                if (pipe >= 0) {
                    senderId = rest.slice(0, pipe);
                    senderName = rest.slice(pipe + 1).trim() || 'Unknown';
                }
                else {
                    senderId = rest;
                }
            }
            return {
                id: row.id,
                senderId,
                senderName,
                message: row.message,
                createdAt: row.createdAt,
                isOwn: senderId === currentUserId,
            };
        });
    }
    async sendMessage(senderId, recipientId, message) {
        const sender = await database_1.default.user.findUnique({
            where: { id: senderId },
            select: { fullName: true },
        });
        if (!sender) {
            throw new Error('Sender not found');
        }
        const payloadTitle = `FROM:${senderId}|${sender.fullName}`;
        const [recipientMessage, senderCopy] = await database_1.default.$transaction([
            database_1.default.notification.create({
                data: {
                    userId: recipientId,
                    notificationType: 'CHAT_DM',
                    title: payloadTitle,
                    message,
                    relatedId: senderId,
                    isRead: false,
                },
            }),
            database_1.default.notification.create({
                data: {
                    userId: senderId,
                    notificationType: 'CHAT_DM',
                    title: payloadTitle,
                    message,
                    relatedId: recipientId,
                    isRead: true,
                    readAt: new Date(),
                },
            }),
        ]);
        return { recipientMessage, senderCopy };
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map