import { Prisma } from '@prisma/client';
export declare class PatientService {
    createPatient(data: any, registeredById: string): Promise<{
        registeredBy: {
            id: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
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
    }>;
    getPatients(params: {
        page?: number;
        limit?: number;
        search?: string;
        isIncomplete?: boolean;
        showArchived?: boolean;
    }): Promise<{
        patients: ({
            registeredBy: {
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
            visits: {
                visitDate: Date;
            }[];
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPatientById(id: string): Promise<{
        registeredBy: {
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        visits: ({
            assignedDoctor: {
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
            cardFee: Prisma.Decimal;
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
    }>;
    updatePatient(id: string, data: Record<string, unknown>): Promise<{
        registeredBy: {
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
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
    }>;
    getPatientHistory(id: string): Promise<{
        visits: ({
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
                price: Prisma.Decimal;
                clinicalIndication: string | null;
                scheduledDate: Date | null;
            }[];
            assignedDoctor: {
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
            cardFee: Prisma.Decimal;
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
    }>;
    deletePatient(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    /**
     * Check for duplicate patients using fuzzy matching
     */
    checkDuplicates(data: {
        fullName: string;
        dateOfBirth?: string;
        phone?: string;
    }): Promise<{
        patient: any;
        similarityScore: number;
        matchReasons: string[];
    }[]>;
    /**
     * Simple name similarity calculation
     */
    private calculateNameSimilarity;
    /**
     * Archive a patient (soft delete)
     */
    archivePatient(id: string, reason: string, archivedBy: string): Promise<{
        registeredBy: {
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
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
    }>;
    /**
     * Restore an archived patient
     */
    restorePatient(id: string): Promise<{
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
    }>;
    /**
     * Complete an incomplete patient registration
     */
    completeRegistration(id: string, data: any): Promise<{
        registeredBy: {
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
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
    }>;
    /**
     * Get patient visits with full details
     */
    getPatientVisits(patientId: string): Promise<{
        id: string;
        visitDate: Date;
        visitType: import(".prisma/client").$Enums.VisitType;
        chiefComplaint: string;
        diagnosis: string;
        doctorName: string;
        status: import(".prisma/client").$Enums.VisitStatus;
    }[]>;
    /**
     * Get patient lab results
     */
    getPatientLabResults(patientId: string): Promise<any[]>;
    /**
     * Get patient prescriptions
     */
    getPatientPrescriptions(patientId: string): Promise<any[]>;
    /**
     * Get patient vital signs history
     */
    getPatientVitals(patientId: string): Promise<{
        id: string;
        recordedDate: Date;
        bloodPressure: string;
        heartRate: number;
        temperature: Prisma.Decimal;
        oxygenSaturation: number;
        weight: Prisma.Decimal;
    }[]>;
}
//# sourceMappingURL=patient.service.d.ts.map