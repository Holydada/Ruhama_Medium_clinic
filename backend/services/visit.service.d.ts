export declare class VisitService {
    createVisit(data: {
        patientId: string;
        visitType: 'NEW' | 'REPEAT' | 'FOLLOW_UP';
        serviceType: 'OPD' | 'ULTRASOUND' | 'EMERGENCY' | 'INJECTION';
        assignedDoctorId?: string;
        registeredById: string;
        ultrasoundFee?: number;
    }): Promise<{
        totalRevenue: number;
        patient: {
            id: string;
            fullName: string;
            phone: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
        };
        assignedDoctor: {
            id: string;
            fullName: string;
            department: string;
        };
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
    }>;
    getVisits(params: {
        page?: number;
        limit?: number;
        date?: string;
        status?: string;
        doctorId?: string;
        serviceType?: string;
        unassignedOnly?: boolean;
    }): Promise<{
        visits: ({
            patient: {
                id: string;
                fullName: string;
                cardNumber: string;
                sex: import(".prisma/client").$Enums.Sex;
                dateOfBirth: Date;
                photoUrl: string;
            };
            assignedDoctor: {
                fullName: string;
                department: string;
            };
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        stats: any;
    }>;
    getVisitById(id: string): Promise<{
        prescriptions: ({
            items: {
                id: string;
                createdAt: Date;
                prescriptionId: string;
                drugId: string | null;
                drugName: string;
                dosage: string;
                frequency: string;
                duration: string;
                quantity: number;
                instructions: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            patientId: string;
            visitId: string;
            doctorId: string;
            prescriptionNumber: string;
            notes: string | null;
            dispensedAt: Date | null;
            dispensedById: string | null;
        })[];
        labOrders: ({
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
        })[];
        ultrasoundOrders: {
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
        }[];
        injectionOrders: {
            id: string;
            createdAt: Date;
            route: string;
            status: import(".prisma/client").$Enums.InjectionStatus;
            patientId: string;
            visitId: string;
            orderNumber: string;
            orderedById: string;
            notes: string | null;
            dosage: string;
            frequency: string | null;
            duration: string | null;
            medicationName: string;
        }[];
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
        assignedDoctor: {
            fullName: string;
            phone: string;
            department: string;
        };
    } & {
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
    }>;
    updateVisitStatus(id: string, status: string): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
    } & {
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
    }>;
    assignDoctor(visitId: string, doctorId: string): Promise<{
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
        assignedDoctor: {
            fullName: string;
            department: string;
        };
    } & {
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
    }>;
    saveSoapNote(visitId: string, authorId: string, payload: {
        patientId: string;
        chiefComplaint: string;
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
        vitalSigns?: {
            bloodPressure?: string;
            temperature?: string;
            heartRate?: string;
            respiratoryRate?: string;
            oxygenSaturation?: string;
        };
        isDraft?: boolean;
    }): Promise<{
        visitId: string;
        saved: boolean;
    }>;
    getEncounterTimeline(visitId: string): Promise<(({
        user: {
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
    }) | {
        id: string;
        action: string;
        createdAt: Date;
        resource: string;
        user: {
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    })[]>;
    recordNurseVitals(visitId: string, userId: string, vitals: {
        bloodPressureSystolic: number;
        bloodPressureDiastolic: number;
        temperature: number;
        heartRate: number;
        respiratoryRate: number;
        oxygenSaturation: number;
        weight?: number;
        height?: number;
        bmi?: number;
        notes?: string;
    }): Promise<{
        visitId: string;
        recorded: boolean;
    }>;
}
//# sourceMappingURL=visit.service.d.ts.map