export declare class InjectionService {
    createInjectionOrder(data: {
        visitId: string;
        patientId: string;
        medicationName: string;
        dosage: string;
        route: string;
        frequency?: string;
        duration?: string;
        notes?: string;
        orderedById: string;
    }): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
            allergies: string;
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
    }>;
    administerInjection(data: {
        orderId: string;
        administeredById: string;
        rightPatientChecked: boolean;
        rightMedicationChecked: boolean;
        rightDoseChecked: boolean;
        rightRouteChecked: boolean;
        rightTimeChecked: boolean;
        site: string;
        route: string;
        batchNumber?: string;
        lotNumber?: string;
        expiryDate?: Date;
        vitalsBefore?: {
            bp?: string;
            pulse?: number;
            temp?: number;
            spo2?: number;
        };
        vitalsAfter?: {
            bp?: string;
            pulse?: number;
            temp?: number;
            spo2?: number;
        };
        adverseReaction?: boolean;
        reactionType?: string;
        reactionSeverity?: 'Mild' | 'Moderate' | 'Severe';
        reactionDetails?: string;
        actionTaken?: string;
        consumablesUsed?: Array<{
            item: string;
            quantity: number;
        }>;
        witnessedById?: string;
        notes?: string;
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
    getInjectionOrders(params: {
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
                allergies: string;
            };
            orderedBy: {
                fullName: string;
            };
            administrations: ({
                administeredBy: {
                    fullName: string;
                };
            } & {
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
            })[];
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getInjectionOrderById(id: string): Promise<{
        patient: {
            visits: ({
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
            })[];
        } & {
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
        administrations: ({
            administeredBy: {
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
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
        })[];
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
    }>;
    cancelInjectionOrder(id: string, reason?: string): Promise<{
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
    }>;
    getInjectionQueue(): Promise<({
        patient: {
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
            allergies: string;
        };
        orderedBy: {
            fullName: string;
        };
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
    getAdministrationHistory(orderId: string): Promise<({
        administeredBy: {
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
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
    })[]>;
}
export declare const injectionService: InjectionService;
//# sourceMappingURL=injection.service.d.ts.map