export declare class FinanceService {
    /**
     * Get comprehensive financial report
     */
    getFinancialReport(startDate: Date, endDate: Date): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        totalRevenue: number;
        totalTransactions: number;
        revenueByType: any;
        paymentMethods: any;
        dailyRevenue: any;
        transactions: ({
            patient: {
                fullName: string;
                cardNumber: string;
            };
        } & {
            id: string;
            createdAt: Date;
            patientId: string | null;
            visitId: string | null;
            transactionNumber: string;
            transactionType: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            referenceNumber: string | null;
            description: string | null;
            collectedById: string | null;
            transactionDate: Date;
        })[];
    }>;
    /**
     * Get outstanding receivables
     */
    getOutstandingReceivables(): Promise<{
        totalOutstanding: number;
        count: number;
        aged: {
            current: number;
            thirtyDays: number;
            sixtyDays: number;
            ninetyPlus: number;
        };
        transactions: ({
            patient: {
                fullName: string;
                phone: string;
                cardNumber: string;
            };
        } & {
            id: string;
            createdAt: Date;
            patientId: string | null;
            visitId: string | null;
            transactionNumber: string;
            transactionType: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            referenceNumber: string | null;
            description: string | null;
            collectedById: string | null;
            transactionDate: Date;
        })[];
    }>;
    createTransaction(data: {
        patientId?: string;
        visitId?: string;
        transactionType: string;
        amount: number;
        paymentMethod: 'CASH' | 'CHAPA' | 'BANK_TRANSFER';
        referenceNumber?: string;
        description?: string;
        collectedById?: string;
    }): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
        collectedBy: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        patientId: string | null;
        visitId: string | null;
        transactionNumber: string;
        transactionType: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        referenceNumber: string | null;
        description: string | null;
        collectedById: string | null;
        transactionDate: Date;
    }>;
    getTransactions(params: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        paymentMethod?: string;
        paymentStatus?: string;
        transactionType?: string;
        patientId?: string;
    }): Promise<{
        transactions: ({
            patient: {
                fullName: string;
                cardNumber: string;
            };
            collectedBy: {
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            patientId: string | null;
            visitId: string | null;
            transactionNumber: string;
            transactionType: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            referenceNumber: string | null;
            description: string | null;
            collectedById: string | null;
            transactionDate: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    markTransactionPaid(id: string, referenceNumber?: string): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        patientId: string | null;
        visitId: string | null;
        transactionNumber: string;
        transactionType: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        referenceNumber: string | null;
        description: string | null;
        collectedById: string | null;
        transactionDate: Date;
    }>;
    requestRefund(id: string, reason: string, requestedById: string): Promise<{
        transactionId: string;
        status: string;
        reason: string;
    }>;
    approveRefund(id: string, reason: string, approvedById: string): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        patientId: string | null;
        visitId: string | null;
        transactionNumber: string;
        transactionType: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        referenceNumber: string | null;
        description: string | null;
        collectedById: string | null;
        transactionDate: Date;
    }>;
    createInvoice(data: {
        patientId: string;
        visitId?: string;
        items: Array<{
            itemType: string;
            itemDescription: string;
            quantity: number;
            unitPrice: number;
        }>;
        issuedById: string;
    }): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
        items: {
            id: string;
            createdAt: Date;
            quantity: number;
            itemType: string;
            itemDescription: string;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
        }[];
        issuedBy: {
            fullName: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        patientId: string;
        visitId: string | null;
        invoiceNumber: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paidAmount: import("@prisma/client/runtime/library").Decimal;
        issuedById: string;
        issuedAt: Date;
        paidAt: Date | null;
    }>;
    getInvoices(params: {
        page?: number;
        limit?: number;
        status?: string;
        patientId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        invoices: ({
            patient: {
                fullName: string;
                cardNumber: string;
            };
            items: {
                id: string;
                createdAt: Date;
                quantity: number;
                itemType: string;
                itemDescription: string;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
                invoiceId: string;
            }[];
            issuedBy: {
                fullName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            patientId: string;
            visitId: string | null;
            invoiceNumber: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            issuedById: string;
            issuedAt: Date;
            paidAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    payInvoice(id: string, amount: number): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
        items: {
            id: string;
            createdAt: Date;
            quantity: number;
            itemType: string;
            itemDescription: string;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        patientId: string;
        visitId: string | null;
        invoiceNumber: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paidAmount: import("@prisma/client/runtime/library").Decimal;
        issuedById: string;
        issuedAt: Date;
        paidAt: Date | null;
    }>;
    getRevenueReport(startDate: string, endDate: string): Promise<{
        totalRevenue: number;
        transactionCount: number;
        byPaymentMethod: Record<string, number>;
        byType: Record<string, number>;
        period: {
            startDate: string;
            endDate: string;
        };
    }>;
    getDailyRevenue(date?: string): Promise<{
        date: string;
        totalRevenue: number;
        transactionCount: number;
        transactions: {
            id: string;
            createdAt: Date;
            patientId: string | null;
            visitId: string | null;
            transactionNumber: string;
            transactionType: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            referenceNumber: string | null;
            description: string | null;
            collectedById: string | null;
            transactionDate: Date;
        }[];
    }>;
    /** Get daily revenue for RECEPTION/SUPER_ADMIN - only card fees and ultrasound fees */
    getReceptionDailyRevenue(date?: string): Promise<{
        date: string;
        totalRevenue: number;
        transactionCount: number;
        byType: Record<string, number>;
        summary: {
            cardFees: number;
            ultrasoundFees: number;
        };
    }>;
    /** Get daily revenue for FINANCE - excludes card fees and ultrasound fees */
    getFinanceDailyRevenue(date?: string): Promise<{
        date: string;
        totalRevenue: number;
        transactionCount: number;
        byType: Record<string, number>;
        transactions: {
            id: string;
            createdAt: Date;
            patientId: string | null;
            visitId: string | null;
            transactionNumber: string;
            transactionType: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            referenceNumber: string | null;
            description: string | null;
            collectedById: string | null;
            transactionDate: Date;
        }[];
    }>;
    /** Get pharmacy revenue - pharmacy sales only */
    getPharmacyDailyRevenue(date?: string): Promise<{
        date: string;
        totalRevenue: number;
        transactionCount: number;
        transactions: {
            id: string;
            createdAt: Date;
            patientId: string | null;
            visitId: string | null;
            transactionNumber: string;
            transactionType: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            referenceNumber: string | null;
            description: string | null;
            collectedById: string | null;
            transactionDate: Date;
        }[];
    }>;
    getDailyCloseoutSummary(date?: string): Promise<{
        date: string;
        totalTransactions: number;
        paidCount: number;
        pendingCount: number;
        refundedCount: number;
        totals: {
            collected: number;
            pending: number;
            refunded: number;
            net: number;
        };
        byMethod: Record<string, number>;
    }>;
    createSystemCharge(data: {
        patientId?: string;
        visitId?: string;
        transactionType: string;
        amount: number;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        patientId: string | null;
        visitId: string | null;
        transactionNumber: string;
        transactionType: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        referenceNumber: string | null;
        description: string | null;
        collectedById: string | null;
        transactionDate: Date;
    }>;
    createPaidSystemCharge(data: {
        patientId?: string;
        visitId?: string;
        transactionType: string;
        amount: number;
        description?: string;
        collectedById?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        patientId: string | null;
        visitId: string | null;
        transactionNumber: string;
        transactionType: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        referenceNumber: string | null;
        description: string | null;
        collectedById: string | null;
        transactionDate: Date;
    }>;
}
//# sourceMappingURL=finance.service.d.ts.map