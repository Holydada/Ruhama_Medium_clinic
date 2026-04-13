export declare class PatientPortalService {
    getDashboard(userId: string, audit?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        profile: {
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
            phone: string;
            allergies: string;
            bloodType: string;
        };
        recentVisits: {
            id: string;
            visitDate: Date;
            status: import(".prisma/client").$Enums.VisitStatus;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            doctor: string;
        }[];
    }>;
}
//# sourceMappingURL=patientPortal.service.d.ts.map