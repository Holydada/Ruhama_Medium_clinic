export declare class UserService {
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        department: string;
        employmentType: import(".prisma/client").$Enums.EmploymentType;
        isActive: boolean;
        emailVerified: boolean;
        profilePhoto: string;
        createdAt: Date;
        lastLogin: Date;
    }>;
    updateProfile(userId: string, data: {
        fullName?: string;
        phone?: string;
        department?: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        department: string;
        profilePhoto: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    requestEmailChange(userId: string, newEmail: string, password: string): Promise<{
        newEmail: string;
    }>;
    confirmEmailChange(userId: string, otp: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    uploadProfilePhoto(userId: string, file: Express.Multer.File): Promise<string>;
    deleteProfilePhoto(userId: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map