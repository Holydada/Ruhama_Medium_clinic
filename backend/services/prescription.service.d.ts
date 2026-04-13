export declare class PrescriptionService {
    createPrescription(data: {
        visitId: string;
        patientId: string;
        doctorId: string;
        items: Array<{
            drugId?: string;
            drugName: string;
            dosage: string;
            frequency: string;
            duration: string;
            quantity: number;
            instructions?: string;
        }>;
        notes?: string;
    }): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
        };
        visit: {
            visitNumber: number;
            visitDate: Date;
        };
        doctor: {
            fullName: string;
            department: string;
        };
        items: ({
            drug: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                drugName: string;
                description: string | null;
                genericName: string | null;
                brandName: string | null;
                drugCategory: string | null;
                dosageForm: string | null;
                strength: string | null;
                unit: string | null;
                sideEffects: string | null;
                contraindications: string | null;
                storageConditions: string | null;
            };
        } & {
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
        })[];
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
    }>;
    getPrescriptions(params: {
        page?: number;
        limit?: number;
        status?: string;
        patientId?: string;
        doctorId?: string;
        date?: string;
    }): Promise<{
        prescriptions: ({
            patient: {
                fullName: string;
                cardNumber: string;
                sex: import(".prisma/client").$Enums.Sex;
                dateOfBirth: Date;
            };
            doctor: {
                fullName: string;
                department: string;
            };
            items: ({
                drug: {
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    drugName: string;
                    description: string | null;
                    genericName: string | null;
                    brandName: string | null;
                    drugCategory: string | null;
                    dosageForm: string | null;
                    strength: string | null;
                    unit: string | null;
                    sideEffects: string | null;
                    contraindications: string | null;
                    storageConditions: string | null;
                };
            } & {
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
            })[];
            dispensedBy: {
                fullName: string;
            };
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
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPrescriptionById(id: string): Promise<{
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
        doctor: {
            fullName: string;
            phone: string;
            department: string;
        };
        items: ({
            drug: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                drugName: string;
                description: string | null;
                genericName: string | null;
                brandName: string | null;
                drugCategory: string | null;
                dosageForm: string | null;
                strength: string | null;
                unit: string | null;
                sideEffects: string | null;
                contraindications: string | null;
                storageConditions: string | null;
            };
        } & {
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
        })[];
        dispensedBy: {
            fullName: string;
        };
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
    }>;
    dispensePrescription(id: string, dispensedById: string, dispenseDetails?: {
        labelPrinted?: boolean;
        substitutionMade?: boolean;
        substitutionReason?: string;
        counselProvided?: boolean;
        notes?: string;
    }): Promise<{
        patient: {
            fullName: string;
            cardNumber: string;
        };
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
    }>;
    cancelPrescription(id: string): Promise<{
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
    }>;
    getPrescriptionQueue(params?: {
        limit?: number;
    }): Promise<({
        patient: {
            fullName: string;
            cardNumber: string;
            sex: import(".prisma/client").$Enums.Sex;
            dateOfBirth: Date;
        };
        doctor: {
            fullName: string;
        };
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
    })[]>;
}
//# sourceMappingURL=prescription.service.d.ts.map