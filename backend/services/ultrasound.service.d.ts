export declare class UltrasoundService {
    createUltrasoundOrder(data: {
        visitId: string;
        patientId: string;
        ultrasoundType: string;
        isFollowUp: boolean;
        clinicalIndication?: string;
        orderedById: string;
        scheduledDate?: string;
    }): Promise<{
        patient: {
            fullName: string;
            phone: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
        };
        visit: {
            visitNumber: number;
            visitDate: Date;
        };
        orderedBy: {
            fullName: string;
            department: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.UltrasoundStatus;
        patientId: string;
        visitId: string;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        ultrasoundType: string;
        isFollowUp: boolean;
        price: import("@prisma/client/runtime/library").Decimal;
        clinicalIndication: string | null;
        scheduledDate: Date | null;
    }>;
    getUltrasoundOrders(params: {
        page?: number;
        limit?: number;
        status?: string;
        patientId?: string;
        date?: string;
    }): Promise<{
        orders: ({
            patient: {
                fullName: string;
                cardNumber: string;
                sex: import(".prisma/client").$Enums.Sex;
                dateOfBirth: Date;
            };
            orderedBy: {
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.UltrasoundStatus;
            patientId: string;
            visitId: string;
            completedAt: Date | null;
            orderNumber: string;
            orderedById: string;
            ultrasoundType: string;
            isFollowUp: boolean;
            price: import("@prisma/client/runtime/library").Decimal;
            clinicalIndication: string | null;
            scheduledDate: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUltrasoundOrderById(id: string): Promise<{
        patient: {
            id: string;
            fullName: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
            address: string | null;
            kebele: string | null;
            wereda: string | null;
            photoUrl: string | null;
            medicalHistory: string | null;
            allergies: string | null;
            bloodType: string | null;
            emergencyContactName: string | null;
            emergencyContactPhone: string | null;
            hasAllergies: boolean;
            allergyDetails: string | null;
            hasDiabetes: boolean;
            hasHypertension: boolean;
            hasAsthma: boolean;
            hasHeartDisease: boolean;
            hasKidneyDisease: boolean;
            hasEpilepsy: boolean;
            currentMedications: string | null;
            familyHistory: string | null;
            surgicalHistory: string | null;
            socialHistory: string | null;
            isIncomplete: boolean;
            incompleteReason: string | null;
            archivedAt: Date | null;
            archivedBy: string | null;
            archivedReason: string | null;
            registeredById: string;
            registrationDate: Date;
        };
        visit: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            registeredById: string;
            status: import(".prisma/client").$Enums.VisitStatus;
            patientId: string;
            visitNumber: number;
            visitType: import(".prisma/client").$Enums.VisitType;
            visitDate: Date;
            cardFee: import("@prisma/client/runtime/library").Decimal;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            assignedDoctorId: string | null;
            triageLevel: import(".prisma/client").$Enums.TriageLevel | null;
            isWalkIn: boolean;
            appointmentId: string | null;
            arrivedAt: Date | null;
            queuePosition: number | null;
        };
        orderedBy: {
            fullName: string;
            phone: string;
            department: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.UltrasoundStatus;
        patientId: string;
        visitId: string;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        ultrasoundType: string;
        isFollowUp: boolean;
        price: import("@prisma/client/runtime/library").Decimal;
        clinicalIndication: string | null;
        scheduledDate: Date | null;
    }>;
    updateUltrasoundStatus(id: string, status: string): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.UltrasoundStatus;
        patientId: string;
        visitId: string;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        ultrasoundType: string;
        isFollowUp: boolean;
        price: import("@prisma/client/runtime/library").Decimal;
        clinicalIndication: string | null;
        scheduledDate: Date | null;
    }>;
    addUltrasoundArtifact(orderId: string, uploadedById: string, data: {
        name: string;
        url: string;
        type?: string;
        notes?: string;
    }): Promise<{
        user: {
            id: string;
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
    }>;
    getUltrasoundArtifacts(orderId: string): Promise<{
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
    }[]>;
    getScheduledUltrasounds(date?: string): Promise<({
        patient: {
            fullName: string;
            phone: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
        };
        orderedBy: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.UltrasoundStatus;
        patientId: string;
        visitId: string;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        ultrasoundType: string;
        isFollowUp: boolean;
        price: import("@prisma/client/runtime/library").Decimal;
        clinicalIndication: string | null;
        scheduledDate: Date | null;
    })[]>;
}
//# sourceMappingURL=ultrasound.service.d.ts.map