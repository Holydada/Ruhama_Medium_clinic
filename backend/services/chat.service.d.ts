export declare class ChatService {
    getPeerSummary(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        department: string;
        profilePhoto: string;
    }>;
    listChatUsers(currentUserId: string): Promise<{
        id: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        department: string;
        profilePhoto: string;
    }[]>;
    getConversation(currentUserId: string, withUserId: string): Promise<{
        id: string;
        senderId: string;
        senderName: string;
        message: string;
        createdAt: Date;
        isOwn: boolean;
    }[]>;
    sendMessage(senderId: string, recipientId: string, message: string): Promise<{
        recipientMessage: {
            id: string;
            createdAt: Date;
            userId: string;
            message: string;
            notificationType: string;
            title: string;
            isRead: boolean;
            relatedId: string | null;
            readAt: Date | null;
        };
        senderCopy: {
            id: string;
            createdAt: Date;
            userId: string;
            message: string;
            notificationType: string;
            title: string;
            isRead: boolean;
            relatedId: string | null;
            readAt: Date | null;
        };
    }>;
}
//# sourceMappingURL=chat.service.d.ts.map