import { AppointmentStatus, ServiceType } from '@prisma/client';
export declare class AppointmentService {
    /**
     * Create a new appointment with conflict detection
     */
    createAppointment(data: {
        patientId: string;
        doctorId: string;
        appointmentDate: Date;
        startTime: Date;
        endTime: Date;
        serviceType: ServiceType;
        reason?: string;
        notes?: string;
    }): Promise<{
        patient: {
            id: string;
            fullName: string;
            phone: string;
            cardNumber: string;
            photoUrl: string;
        };
        doctor: {
            id: string;
            fullName: string;
            department: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        patientId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        doctorId: string;
        completedAt: Date | null;
        notes: string | null;
        appointmentNumber: string;
        appointmentDate: Date;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        checkedInAt: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        cancellationReason: string | null;
        rescheduledFrom: string | null;
        rescheduledTo: string | null;
    }>;
    /**
     * Check for appointment conflicts
     */
    private checkConflict;
    /**
     * Get appointments with filters
     */
    getAppointments(params: {
        doctorId?: string;
        patientId?: string;
        status?: AppointmentStatus;
        date?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        appointments: ({
            patient: {
                id: string;
                fullName: string;
                phone: string;
                cardNumber: string;
                photoUrl: string;
            };
            doctor: {
                id: string;
                fullName: string;
                department: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            patientId: string;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            doctorId: string;
            completedAt: Date | null;
            notes: string | null;
            appointmentNumber: string;
            appointmentDate: Date;
            startTime: Date;
            endTime: Date;
            reason: string | null;
            checkedInAt: Date | null;
            cancelledAt: Date | null;
            cancelledBy: string | null;
            cancellationReason: string | null;
            rescheduledFrom: string | null;
            rescheduledTo: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get appointment by ID
     */
    getAppointmentById(id: string): Promise<{
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
            id: string;
            fullName: string;
            phone: string;
            department: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        patientId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        doctorId: string;
        completedAt: Date | null;
        notes: string | null;
        appointmentNumber: string;
        appointmentDate: Date;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        checkedInAt: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        cancellationReason: string | null;
        rescheduledFrom: string | null;
        rescheduledTo: string | null;
    }>;
    /**
     * Check in appointment and create visit
     */
    checkInAppointment(id: string, registeredById: string): Promise<{
        appointment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            patientId: string;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            doctorId: string;
            completedAt: Date | null;
            notes: string | null;
            appointmentNumber: string;
            appointmentDate: Date;
            startTime: Date;
            endTime: Date;
            reason: string | null;
            checkedInAt: Date | null;
            cancelledAt: Date | null;
            cancelledBy: string | null;
            cancellationReason: string | null;
            rescheduledFrom: string | null;
            rescheduledTo: string | null;
        };
        visit: {
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
    }>;
    /**
     * Cancel appointment
     */
    cancelAppointment(id: string, reason: string, cancelledBy: string): Promise<{
        patient: {
            fullName: string;
            phone: string;
        };
        doctor: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        patientId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        doctorId: string;
        completedAt: Date | null;
        notes: string | null;
        appointmentNumber: string;
        appointmentDate: Date;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        checkedInAt: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        cancellationReason: string | null;
        rescheduledFrom: string | null;
        rescheduledTo: string | null;
    }>;
    /**
     * Reschedule appointment
     */
    rescheduleAppointment(id: string, newDate: Date, newStartTime: Date, newEndTime: Date): Promise<{
        patient: {
            fullName: string;
            phone: string;
        };
        doctor: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        patientId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        doctorId: string;
        completedAt: Date | null;
        notes: string | null;
        appointmentNumber: string;
        appointmentDate: Date;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        checkedInAt: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        cancellationReason: string | null;
        rescheduledFrom: string | null;
        rescheduledTo: string | null;
    }>;
    /**
     * Mark appointment as no-show
     */
    markNoShow(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        patientId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        doctorId: string;
        completedAt: Date | null;
        notes: string | null;
        appointmentNumber: string;
        appointmentDate: Date;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        checkedInAt: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        cancellationReason: string | null;
        rescheduledFrom: string | null;
        rescheduledTo: string | null;
    }>;
    /**
     * Uncheck-in appointment (reverse check-in)
     */
    uncheckInAppointment(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        patientId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        doctorId: string;
        completedAt: Date | null;
        notes: string | null;
        appointmentNumber: string;
        appointmentDate: Date;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        checkedInAt: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        cancellationReason: string | null;
        rescheduledFrom: string | null;
        rescheduledTo: string | null;
    }>;
    /**
     * Update appointment status
     */
    updateStatus(id: string, status: AppointmentStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        patientId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        doctorId: string;
        completedAt: Date | null;
        notes: string | null;
        appointmentNumber: string;
        appointmentDate: Date;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        checkedInAt: Date | null;
        cancelledAt: Date | null;
        cancelledBy: string | null;
        cancellationReason: string | null;
        rescheduledFrom: string | null;
        rescheduledTo: string | null;
    }>;
}
//# sourceMappingURL=appointment.service.d.ts.map