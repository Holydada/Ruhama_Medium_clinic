export declare class AdminService {
    getPendingUsers(): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        department: string;
        employmentType: import(".prisma/client").$Enums.EmploymentType;
        createdAt: Date;
    }[]>;
    approveUser(userId: string, approvedById: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        isApproved: boolean;
        emailVerified: boolean;
    }>;
    rejectUser(userId: string, approvedById: string): Promise<{
        message: string;
    }>;
    getAllUsers(params: {
        page?: number;
        limit?: number;
        role?: string;
        isActive?: boolean;
    }): Promise<{
        users: {
            id: string;
            email: string;
            clinicalPersonaUserId: string;
            fullName: string;
            phone: string;
            role: import(".prisma/client").$Enums.UserRole;
            department: string;
            employmentType: import(".prisma/client").$Enums.EmploymentType;
            isActive: boolean;
            isApproved: boolean;
            createdAt: Date;
            lastLogin: Date;
            supervisedByUserId: string;
            supervisedBy: {
                id: string;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUserStatus(userId: string, isActive: boolean, adminId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        isActive: boolean;
    }>;
    updateUserRole(userId: string, role: string, adminId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    createAuditLog(data: {
        userId?: string;
        action: string;
        tableName?: string;
        recordId?: string;
        resource?: string;
        resourceId?: string;
        oldValues?: any;
        newValues?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        id: string;
        userId: string | null;
        action: string;
        resource: string;
        resourceId: string | null;
        oldValues: string | null;
        newValues: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        sessionId: string | null;
        success: boolean;
        errorMessage: string | null;
        metadata: string | null;
        timestamp: Date;
    }>;
    getAuditLogs(params: {
        page?: number;
        limit?: number;
        userId?: string;
        action?: string;
        tableName?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        logs: ({
            user: {
                email: string;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            userId: string | null;
            action: string;
            resource: string;
            resourceId: string | null;
            oldValues: string | null;
            newValues: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            sessionId: string | null;
            success: boolean;
            errorMessage: string | null;
            metadata: string | null;
            timestamp: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSystemStats(): Promise<{
        users: {
            total: number;
            active: number;
            pending: number;
        };
        patients: {
            total: number;
        };
        visits: {
            today: number;
        };
        revenue: {
            today: number;
        };
    }>;
    getDashboardStats(startDate?: string, endDate?: string): Promise<{
        visits: number;
        prescriptions: number;
        labOrders: number;
        ultrasoundOrders: number;
        revenue: number;
        period: {
            startDate: Date;
            endDate: Date;
        };
    }>;
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        patientLinkId: string;
        clinicalPersonaUserId: string;
        fullName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        department: string;
        employmentType: import(".prisma/client").$Enums.EmploymentType;
        isActive: boolean;
        isApproved: boolean;
        emailVerified: boolean;
        createdAt: Date;
        lastLogin: Date;
        supervisedByUserId: string;
        clinicalPersona: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        supervisedBy: {
            id: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    updateUserProfile(targetId: string, data: {
        fullName?: string;
        phone?: string | null;
        department?: string | null;
        employmentType?: string | null;
    }, adminId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        department: string;
        employmentType: import(".prisma/client").$Enums.EmploymentType;
        isActive: boolean;
        isApproved: boolean;
        createdAt: Date;
        lastLogin: Date;
    }>;
    deleteUser(targetId: string, adminId: string): Promise<{
        mode: "deactivated";
        message: string;
    } | {
        mode: "deleted";
        message: string;
    }>;
    getRoleSummary(): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        count: number;
    }[]>;
    /** Rows for CSV / JSON export (report builder). */
    getReportExportData(type: string, start: Date, end: Date): Promise<{
        filename: string;
        headers: string[];
        rows: Record<string, string | number>[];
    }>;
}
//# sourceMappingURL=admin.service.d.ts.map