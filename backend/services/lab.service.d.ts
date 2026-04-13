export declare class LabService {
    createLabTest(data: {
        testCode: string;
        testName: string;
        testCategory?: string;
        description?: string;
        sampleType?: string;
        normalRange?: string;
        unit?: string;
        price?: number;
        turnaroundTime?: number;
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        testName: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal | null;
        unit: string | null;
        testCode: string;
        testCategory: string | null;
        sampleType: string | null;
        normalRange: string | null;
        turnaroundTime: number | null;
    }>;
    getLabTests(params: {
        search?: string;
        category?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        tests: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            testName: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal | null;
            unit: string | null;
            testCode: string;
            testCategory: string | null;
            sampleType: string | null;
            normalRange: string | null;
            turnaroundTime: number | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createLabOrder(data: {
        visitId: string;
        patientId: string;
        orderedById: string;
        priority?: 'STAT' | 'URGENT' | 'ROUTINE';
        clinicalNotes?: string;
        tests: Array<{
            testId: string;
            testName: string;
        }>;
    }): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
        };
        orderedBy: {
            fullName: string;
            department: string;
        };
        items: ({
            test: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                testName: string;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal | null;
                unit: string | null;
                testCode: string;
                testCategory: string | null;
                sampleType: string | null;
                normalRange: string | null;
                turnaroundTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            result: string | null;
            status: import(".prisma/client").$Enums.LabStatus;
            notes: string | null;
            isAbnormal: boolean | null;
            orderId: string;
            testId: string;
            testName: string;
        })[];
    } & {
        priority: import(".prisma/client").$Enums.LabPriority;
        id: string;
        status: import(".prisma/client").$Enums.LabStatus;
        patientId: string;
        visitId: string | null;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        clinicalNotes: string | null;
        orderedAt: Date;
        verifiedAt: Date | null;
        verifiedById: string | null;
    }>;
    getLabOrders(params: {
        page?: number;
        limit?: number;
        status?: string;
        priority?: string;
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
            items: ({
                test: {
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    testName: string;
                    description: string | null;
                    price: import("@prisma/client/runtime/library").Decimal | null;
                    unit: string | null;
                    testCode: string;
                    testCategory: string | null;
                    sampleType: string | null;
                    normalRange: string | null;
                    turnaroundTime: number | null;
                };
            } & {
                id: string;
                createdAt: Date;
                result: string | null;
                status: import(".prisma/client").$Enums.LabStatus;
                notes: string | null;
                isAbnormal: boolean | null;
                orderId: string;
                testId: string;
                testName: string;
            })[];
        } & {
            priority: import(".prisma/client").$Enums.LabPriority;
            id: string;
            status: import(".prisma/client").$Enums.LabStatus;
            patientId: string;
            visitId: string | null;
            completedAt: Date | null;
            orderNumber: string;
            orderedById: string;
            clinicalNotes: string | null;
            orderedAt: Date;
            verifiedAt: Date | null;
            verifiedById: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getLabOrderById(id: string): Promise<{
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
            department: string;
        };
        verifiedBy: {
            fullName: string;
        };
        items: ({
            test: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                testName: string;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal | null;
                unit: string | null;
                testCode: string;
                testCategory: string | null;
                sampleType: string | null;
                normalRange: string | null;
                turnaroundTime: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            result: string | null;
            status: import(".prisma/client").$Enums.LabStatus;
            notes: string | null;
            isAbnormal: boolean | null;
            orderId: string;
            testId: string;
            testName: string;
        })[];
    } & {
        priority: import(".prisma/client").$Enums.LabPriority;
        id: string;
        status: import(".prisma/client").$Enums.LabStatus;
        patientId: string;
        visitId: string | null;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        clinicalNotes: string | null;
        orderedAt: Date;
        verifiedAt: Date | null;
        verifiedById: string | null;
    }>;
    updateLabOrderStatus(id: string, status: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            result: string | null;
            status: import(".prisma/client").$Enums.LabStatus;
            notes: string | null;
            isAbnormal: boolean | null;
            orderId: string;
            testId: string;
            testName: string;
        }[];
    } & {
        priority: import(".prisma/client").$Enums.LabPriority;
        id: string;
        status: import(".prisma/client").$Enums.LabStatus;
        patientId: string;
        visitId: string | null;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        clinicalNotes: string | null;
        orderedAt: Date;
        verifiedAt: Date | null;
        verifiedById: string | null;
    }>;
    updateLabResult(itemId: string, data: {
        result: string;
        isAbnormal?: boolean;
        notes?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        result: string | null;
        status: import(".prisma/client").$Enums.LabStatus;
        notes: string | null;
        isAbnormal: boolean | null;
        orderId: string;
        testId: string;
        testName: string;
    }>;
    verifyLabOrder(id: string, verifiedById: string): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
        items: {
            id: string;
            createdAt: Date;
            result: string | null;
            status: import(".prisma/client").$Enums.LabStatus;
            notes: string | null;
            isAbnormal: boolean | null;
            orderId: string;
            testId: string;
            testName: string;
        }[];
    } & {
        priority: import(".prisma/client").$Enums.LabPriority;
        id: string;
        status: import(".prisma/client").$Enums.LabStatus;
        patientId: string;
        visitId: string | null;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        clinicalNotes: string | null;
        orderedAt: Date;
        verifiedAt: Date | null;
        verifiedById: string | null;
    }>;
    getLabQueue(params?: {
        limit?: number;
    }): Promise<{
        enteredResultCount: number;
        pendingResultCount: number;
        patient: {
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
        };
        orderedBy: {
            fullName: string;
        };
        items: {
            id: string;
            createdAt: Date;
            result: string | null;
            status: import(".prisma/client").$Enums.LabStatus;
            notes: string | null;
            isAbnormal: boolean | null;
            orderId: string;
            testId: string;
            testName: string;
        }[];
        priority: import(".prisma/client").$Enums.LabPriority;
        id: string;
        status: import(".prisma/client").$Enums.LabStatus;
        patientId: string;
        visitId: string | null;
        completedAt: Date | null;
        orderNumber: string;
        orderedById: string;
        clinicalNotes: string | null;
        orderedAt: Date;
        verifiedAt: Date | null;
        verifiedById: string | null;
    }[]>;
    addLabArtifact(orderId: string, uploadedById: string, data: {
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
    getLabArtifacts(orderId: string): Promise<{
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
}
//# sourceMappingURL=lab.service.d.ts.map