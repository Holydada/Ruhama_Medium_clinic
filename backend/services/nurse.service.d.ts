import { TriageLevel, ServiceType } from '@prisma/client';
export declare class NurseService {
    createTriageRecord(data: {
        visitId: string;
        patientId: string;
        triageLevel: TriageLevel;
        chiefComplaint: string;
        bloodPressure?: string;
        heartRate?: number;
        respiratoryRate?: number;
        temperature?: number;
        oxygenSaturation?: number;
        weight?: number;
        height?: number;
        painScore?: number;
        isPregnant?: boolean;
        lmp?: Date;
        allergies?: string;
        chronicIllnesses?: string;
        routedTo: ServiceType;
        triageById: string;
    }): Promise<{
        patient: {
            id: string;
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
            photoUrl: string;
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
        triageBy: {
            id: string;
            fullName: string;
        };
    } & {
        id: string;
        allergies: string | null;
        patientId: string;
        triageLevel: import(".prisma/client").$Enums.TriageLevel;
        triageAt: Date;
        visitId: string;
        chiefComplaint: string;
        bloodPressure: string | null;
        heartRate: number | null;
        respiratoryRate: number | null;
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        oxygenSaturation: number | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        height: import("@prisma/client/runtime/library").Decimal | null;
        bmi: import("@prisma/client/runtime/library").Decimal | null;
        painScore: number | null;
        isPregnant: boolean | null;
        lmp: Date | null;
        chronicIllnesses: string | null;
        routedTo: import(".prisma/client").$Enums.ServiceType;
        alertSent: boolean;
        triageById: string;
    }>;
    getTriageQueue(filters?: {
        triageLevel?: TriageLevel;
        routedTo?: ServiceType;
        date?: Date;
    }): Promise<({
        patient: {
            id: string;
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
            photoUrl: string;
        };
        visit: {
            assignedDoctor: {
                id: string;
                fullName: string;
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
        };
        triageBy: {
            id: string;
            fullName: string;
        };
    } & {
        id: string;
        allergies: string | null;
        patientId: string;
        triageLevel: import(".prisma/client").$Enums.TriageLevel;
        triageAt: Date;
        visitId: string;
        chiefComplaint: string;
        bloodPressure: string | null;
        heartRate: number | null;
        respiratoryRate: number | null;
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        oxygenSaturation: number | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        height: import("@prisma/client/runtime/library").Decimal | null;
        bmi: import("@prisma/client/runtime/library").Decimal | null;
        painScore: number | null;
        isPregnant: boolean | null;
        lmp: Date | null;
        chronicIllnesses: string | null;
        routedTo: import(".prisma/client").$Enums.ServiceType;
        alertSent: boolean;
        triageById: string;
    })[]>;
    recordVitalSigns(data: {
        visitId: string;
        patientId: string;
        bloodPressure?: string;
        heartRate?: number;
        respiratoryRate?: number;
        temperature?: number;
        oxygenSaturation?: number;
        weight?: number;
        height?: number;
        painScore?: number;
        notes?: string;
        recordedById: string;
    }): Promise<{
        patient: {
            id: string;
            fullName: string;
            cardNumber: string;
        };
        recordedBy: {
            id: string;
            fullName: string;
        };
    } & {
        id: string;
        patientId: string;
        visitId: string;
        bloodPressure: string | null;
        heartRate: number | null;
        respiratoryRate: number | null;
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        oxygenSaturation: number | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        height: import("@prisma/client/runtime/library").Decimal | null;
        bmi: import("@prisma/client/runtime/library").Decimal | null;
        painScore: number | null;
        notes: string | null;
        isAbnormal: boolean;
        recordedById: string;
        recordedAt: Date;
    }>;
    private checkAbnormalVitals;
    getVitalSignsHistory(patientId: string, visitId?: string): Promise<({
        recordedBy: {
            id: string;
            fullName: string;
        };
    } & {
        id: string;
        patientId: string;
        visitId: string;
        bloodPressure: string | null;
        heartRate: number | null;
        respiratoryRate: number | null;
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        oxygenSaturation: number | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        height: import("@prisma/client/runtime/library").Decimal | null;
        bmi: import("@prisma/client/runtime/library").Decimal | null;
        painScore: number | null;
        notes: string | null;
        isAbnormal: boolean;
        recordedById: string;
        recordedAt: Date;
    })[]>;
    createNursingNote(data: {
        visitId: string;
        patientId: string;
        subjective?: string;
        objective?: string;
        assessment?: string;
        plan?: string;
        noteType?: string;
        attachments?: string[];
        createdById: string;
    }): Promise<{
        patient: {
            id: string;
            fullName: string;
            cardNumber: string;
        };
        createdBy: {
            id: string;
            fullName: string;
        };
    } & {
        attachments: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        visitId: string;
        subjective: string | null;
        objective: string | null;
        assessment: string | null;
        plan: string | null;
        noteType: string | null;
        isLocked: boolean;
        lockedAt: Date | null;
        createdById: string;
    }>;
    updateNursingNote(id: string, data: {
        subjective?: string;
        objective?: string;
        assessment?: string;
        plan?: string;
        attachments?: string[];
    }): Promise<{
        attachments: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        visitId: string;
        subjective: string | null;
        objective: string | null;
        assessment: string | null;
        plan: string | null;
        noteType: string | null;
        isLocked: boolean;
        lockedAt: Date | null;
        createdById: string;
    }>;
    lockNursingNote(id: string): Promise<{
        attachments: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        visitId: string;
        subjective: string | null;
        objective: string | null;
        assessment: string | null;
        plan: string | null;
        noteType: string | null;
        isLocked: boolean;
        lockedAt: Date | null;
        createdById: string;
    }>;
    getNursingNotes(visitId: string): Promise<({
        createdBy: {
            id: string;
            fullName: string;
        };
    } & {
        attachments: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        visitId: string;
        subjective: string | null;
        objective: string | null;
        assessment: string | null;
        plan: string | null;
        noteType: string | null;
        isLocked: boolean;
        lockedAt: Date | null;
        createdById: string;
    })[]>;
    getInjectionQueue(filters?: {
        status?: string;
        date?: Date;
    }): Promise<({
        patient: {
            id: string;
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
            photoUrl: string;
            allergies: string;
        };
        visit: {
            vitalSigns: {
                id: string;
                patientId: string;
                visitId: string;
                bloodPressure: string | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                temperature: import("@prisma/client/runtime/library").Decimal | null;
                oxygenSaturation: number | null;
                weight: import("@prisma/client/runtime/library").Decimal | null;
                height: import("@prisma/client/runtime/library").Decimal | null;
                bmi: import("@prisma/client/runtime/library").Decimal | null;
                painScore: number | null;
                notes: string | null;
                isAbnormal: boolean;
                recordedById: string;
                recordedAt: Date;
            }[];
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
        };
        orderedBy: {
            id: string;
            fullName: string;
        };
        administrations: {
            id: string;
            route: import(".prisma/client").$Enums.InjectionRoute;
            notes: string | null;
            orderId: string;
            patientVerified: boolean;
            medicationVerified: boolean;
            doseVerified: boolean;
            routeVerified: boolean;
            timeVerified: boolean;
            site: import(".prisma/client").$Enums.InjectionSite;
            lotNumber: string;
            expiryDate: Date;
            administeredAt: Date;
            hasAdverseEvent: boolean;
            adverseEventType: string | null;
            adverseEventSeverity: string | null;
            adverseEventNotes: string | null;
            syringeUsed: boolean;
            needleUsed: boolean;
            alcoholSwabUsed: boolean;
            glovesUsed: boolean;
            administeredById: string;
        }[];
    } & {
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
    })[]>;
    administerInjection(data: {
        orderId: string;
        route: string;
        site: string;
        lotNumber: string;
        expiryDate: Date;
        hasAdverseEvent?: boolean;
        adverseEventType?: string;
        adverseEventSeverity?: string;
        adverseEventNotes?: string;
        notes?: string;
        administeredById: string;
    }): Promise<{
        id: string;
        route: import(".prisma/client").$Enums.InjectionRoute;
        notes: string | null;
        orderId: string;
        patientVerified: boolean;
        medicationVerified: boolean;
        doseVerified: boolean;
        routeVerified: boolean;
        timeVerified: boolean;
        site: import(".prisma/client").$Enums.InjectionSite;
        lotNumber: string;
        expiryDate: Date;
        administeredAt: Date;
        hasAdverseEvent: boolean;
        adverseEventType: string | null;
        adverseEventSeverity: string | null;
        adverseEventNotes: string | null;
        syringeUsed: boolean;
        needleUsed: boolean;
        alcoholSwabUsed: boolean;
        glovesUsed: boolean;
        administeredById: string;
    }>;
    getObservationBoard(location?: ServiceType): Promise<({
        labOrders: {
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
        triageRecords: {
            id: string;
            allergies: string | null;
            patientId: string;
            triageLevel: import(".prisma/client").$Enums.TriageLevel;
            triageAt: Date;
            visitId: string;
            chiefComplaint: string;
            bloodPressure: string | null;
            heartRate: number | null;
            respiratoryRate: number | null;
            temperature: import("@prisma/client/runtime/library").Decimal | null;
            oxygenSaturation: number | null;
            weight: import("@prisma/client/runtime/library").Decimal | null;
            height: import("@prisma/client/runtime/library").Decimal | null;
            bmi: import("@prisma/client/runtime/library").Decimal | null;
            painScore: number | null;
            isPregnant: boolean | null;
            lmp: Date | null;
            chronicIllnesses: string | null;
            routedTo: import(".prisma/client").$Enums.ServiceType;
            alertSent: boolean;
            triageById: string;
        }[];
        vitalSigns: {
            id: string;
            patientId: string;
            visitId: string;
            bloodPressure: string | null;
            heartRate: number | null;
            respiratoryRate: number | null;
            temperature: import("@prisma/client/runtime/library").Decimal | null;
            oxygenSaturation: number | null;
            weight: import("@prisma/client/runtime/library").Decimal | null;
            height: import("@prisma/client/runtime/library").Decimal | null;
            bmi: import("@prisma/client/runtime/library").Decimal | null;
            painScore: number | null;
            notes: string | null;
            isAbnormal: boolean;
            recordedById: string;
            recordedAt: Date;
        }[];
        patient: {
            id: string;
            fullName: string;
            cardNumber: string;
            photoUrl: string;
        };
        assignedDoctor: {
            id: string;
            fullName: string;
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
    })[]>;
}
export declare const nurseService: NurseService;
//# sourceMappingURL=nurse.service.d.ts.map