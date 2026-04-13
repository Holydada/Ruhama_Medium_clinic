export declare const contactService: {
    createMessage(data: {
        fullName: string;
        email: string;
        phone?: string;
        subject?: string;
        message: string;
    }): Promise<{
        subject: string | null;
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        status: import(".prisma/client").$Enums.ContactMessageStatus;
        response: string | null;
        respondedBy: string | null;
        respondedAt: Date | null;
    }>;
    getAllMessages(options: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        messages: {
            subject: string | null;
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            message: string;
            status: import(".prisma/client").$Enums.ContactMessageStatus;
            response: string | null;
            respondedBy: string | null;
            respondedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMessageById(id: string): Promise<{
        subject: string | null;
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        status: import(".prisma/client").$Enums.ContactMessageStatus;
        response: string | null;
        respondedBy: string | null;
        respondedAt: Date | null;
    }>;
    respondToMessage(id: string, response: string, respondedBy: string): Promise<{
        subject: string | null;
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        status: import(".prisma/client").$Enums.ContactMessageStatus;
        response: string | null;
        respondedBy: string | null;
        respondedAt: Date | null;
    }>;
    updateMessageStatus(id: string, status: string): Promise<{
        subject: string | null;
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        status: import(".prisma/client").$Enums.ContactMessageStatus;
        response: string | null;
        respondedBy: string | null;
        respondedAt: Date | null;
    }>;
    deleteMessage(id: string): Promise<{
        subject: string | null;
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        status: import(".prisma/client").$Enums.ContactMessageStatus;
        response: string | null;
        respondedBy: string | null;
        respondedAt: Date | null;
    }>;
};
//# sourceMappingURL=contact.service.d.ts.map