export declare class AuthService {
    register(data: {
        email: string;
        password: string;
        fullName: string;
        phone?: string;
        role: string;
        department?: string;
        employmentType?: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isApproved: boolean;
        createdAt: Date;
    }>;
    registerPatientPortal(data: {
        email: string;
        password: string;
        fullName: string;
        cardNumber: string;
        dateOfBirth: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    /** Profile + clinical / supervision flags for API responses. */
    enrichUserForClient(userId: string): Promise<{
        canSwitchToClinical: boolean;
        canSwitchToAdmin: boolean;
        linkedAdmin: {
            id: string;
            email: string;
            fullName: string;
        };
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
        profilePhoto: string;
        createdAt: Date;
        supervisedByUserId: string;
        supervisedBy: {
            id: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    login(email: string, password: string, otp?: string): Promise<{
        user: {
            canSwitchToClinical: boolean;
            canSwitchToAdmin: boolean;
            linkedAdmin: {
                id: string;
                email: string;
                fullName: string;
            };
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
            profilePhoto: string;
            createdAt: Date;
            supervisedByUserId: string;
            supervisedBy: {
                id: string;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        };
        token: string;
        expiresIn: number;
    }>;
    /** Super admin switches into their linked doctor account (same browser session token swap). */
    switchToClinicalPersona(superAdminUserId: string): Promise<{
        user: {
            canSwitchToClinical: boolean;
            canSwitchToAdmin: boolean;
            linkedAdmin: {
                id: string;
                email: string;
                fullName: string;
            };
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
            profilePhoto: string;
            createdAt: Date;
            supervisedByUserId: string;
            supervisedBy: {
                id: string;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        };
        token: string;
        expiresIn: number;
    }>;
    /** Linked doctor switches back to their super admin account. */
    switchToAdminPersona(doctorUserId: string): Promise<{
        user: {
            canSwitchToClinical: boolean;
            canSwitchToAdmin: boolean;
            linkedAdmin: {
                id: string;
                email: string;
                fullName: string;
            };
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
            profilePhoto: string;
            createdAt: Date;
            supervisedByUserId: string;
            supervisedBy: {
                id: string;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        };
        token: string;
        expiresIn: number;
    }>;
    logout(token: string): Promise<void>;
    getCurrentUser(userId: string): Promise<{
        canSwitchToClinical: boolean;
        canSwitchToAdmin: boolean;
        linkedAdmin: {
            id: string;
            email: string;
            fullName: string;
        };
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
        profilePhoto: string;
        createdAt: Date;
        supervisedByUserId: string;
        supervisedBy: {
            id: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    verifyEmail(token: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    getDoctors(): Promise<{
        id: string;
        fullName: string;
        department: string;
        employmentType: import(".prisma/client").$Enums.EmploymentType;
    }[]>;
}
//# sourceMappingURL=auth.service.d.ts.map