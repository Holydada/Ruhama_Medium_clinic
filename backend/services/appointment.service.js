"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const database_1 = __importDefault(require("../config/database"));
const withDb_1 = require("../utils/withDb");
class AppointmentService {
    /**
     * Create a new appointment with conflict detection
     */
    async createAppointment(data) {
        return (0, withDb_1.withDb)(async () => {
            // Verify patient exists
            const patient = await database_1.default.patient.findUnique({
                where: { id: data.patientId },
            });
            if (!patient) {
                throw new Error('Patient not found');
            }
            // Verify doctor exists and is a doctor
            const doctor = await database_1.default.user.findUnique({
                where: { id: data.doctorId },
            });
            if (!doctor || doctor.role !== 'DOCTOR') {
                throw new Error('Invalid doctor');
            }
            // Check for conflicts
            const conflict = await this.checkConflict(data.doctorId, data.startTime, data.endTime);
            if (conflict) {
                throw new Error(`Appointment conflict: ${conflict}`);
            }
            // Generate appointment number
            const year = new Date().getFullYear();
            const count = await database_1.default.appointment.count();
            const appointmentNumber = `APT-${year}-${String(count + 1).padStart(5, '0')}`;
            // Create appointment
            return database_1.default.appointment.create({
                data: {
                    appointmentNumber,
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    appointmentDate: new Date(data.appointmentDate), // Convert to DateTime
                    startTime: data.startTime,
                    endTime: data.endTime,
                    serviceType: data.serviceType,
                    reason: data.reason,
                    notes: data.notes,
                    status: 'SCHEDULED',
                },
                include: {
                    patient: {
                        select: {
                            id: true,
                            cardNumber: true,
                            fullName: true,
                            phone: true,
                            photoUrl: true,
                        },
                    },
                    doctor: {
                        select: {
                            id: true,
                            fullName: true,
                            department: true,
                        },
                    },
                },
            });
        });
    }
    /**
     * Check for appointment conflicts
     */
    async checkConflict(doctorId, startTime, endTime, excludeAppointmentId) {
        const conflicts = await database_1.default.appointment.findMany({
            where: {
                doctorId,
                id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
                status: {
                    in: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'],
                },
                OR: [
                    {
                        AND: [
                            { startTime: { lte: startTime } },
                            { endTime: { gt: startTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lt: endTime } },
                            { endTime: { gte: endTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { gte: startTime } },
                            { endTime: { lte: endTime } },
                        ],
                    },
                ],
            },
        });
        if (conflicts.length > 0) {
            return `Doctor already has an appointment at this time`;
        }
        return null;
    }
    /**
     * Get appointments with filters
     */
    async getAppointments(params) {
        const page = params.page || 1;
        const limit = params.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.doctorId)
            where.doctorId = params.doctorId;
        if (params.patientId)
            where.patientId = params.patientId;
        if (params.status)
            where.status = params.status;
        if (params.date) {
            const date = new Date(params.date);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            where.appointmentDate = {
                gte: date,
                lt: nextDay,
            };
        }
        const [appointments, total] = await Promise.all([
            database_1.default.appointment.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ appointmentDate: 'asc' }, { startTime: 'asc' }],
                include: {
                    patient: {
                        select: {
                            id: true,
                            cardNumber: true,
                            fullName: true,
                            phone: true,
                            photoUrl: true,
                        },
                    },
                    doctor: {
                        select: {
                            id: true,
                            fullName: true,
                            department: true,
                        },
                    },
                },
            }),
            database_1.default.appointment.count({ where }),
        ]);
        return {
            appointments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get appointment by ID
     */
    async getAppointmentById(id) {
        const appointment = await database_1.default.appointment.findUnique({
            where: { id },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        fullName: true,
                        department: true,
                        phone: true,
                    },
                },
                visit: true,
            },
        });
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    }
    /**
     * Check in appointment and create visit
     */
    async checkInAppointment(id, registeredById) {
        return (0, withDb_1.withDb)(async () => {
            const appointment = await database_1.default.appointment.findUnique({
                where: { id },
                include: { patient: true },
            });
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            if (appointment.status !== 'SCHEDULED' && appointment.status !== 'CONFIRMED') {
                throw new Error(`Cannot check in appointment with status: ${appointment.status}`);
            }
            // Update appointment status
            const updated = await database_1.default.appointment.update({
                where: { id },
                data: {
                    status: 'CHECKED_IN',
                    checkedInAt: new Date(),
                },
            });
            // Create patient visit
            const visitCount = await database_1.default.patientVisit.count({
                where: { patientId: appointment.patientId },
            });
            const visit = await database_1.default.patientVisit.create({
                data: {
                    patientId: appointment.patientId,
                    visitNumber: visitCount + 1,
                    visitType: 'FOLLOW_UP',
                    serviceType: appointment.serviceType,
                    assignedDoctorId: appointment.doctorId,
                    registeredById,
                    isWalkIn: false,
                    appointmentId: appointment.id,
                    arrivedAt: new Date(),
                    status: 'IN_QUEUE',
                },
                include: {
                    patient: true,
                    assignedDoctor: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            });
            return { appointment: updated, visit };
        });
    }
    /**
     * Cancel appointment
     */
    async cancelAppointment(id, reason, cancelledBy) {
        return (0, withDb_1.withDb)(async () => {
            const appointment = await database_1.default.appointment.findUnique({
                where: { id },
            });
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
                throw new Error(`Cannot cancel appointment with status: ${appointment.status}`);
            }
            return database_1.default.appointment.update({
                where: { id },
                data: {
                    status: 'CANCELLED',
                    cancelledAt: new Date(),
                    cancelledBy,
                    cancellationReason: reason,
                },
                include: {
                    patient: {
                        select: {
                            fullName: true,
                            phone: true,
                        },
                    },
                    doctor: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            });
        });
    }
    /**
     * Reschedule appointment
     */
    async rescheduleAppointment(id, newDate, newStartTime, newEndTime) {
        return (0, withDb_1.withDb)(async () => {
            const appointment = await database_1.default.appointment.findUnique({
                where: { id },
            });
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            if (appointment.status !== 'SCHEDULED' && appointment.status !== 'CONFIRMED') {
                throw new Error(`Cannot reschedule appointment with status: ${appointment.status}`);
            }
            // Check for conflicts at new time
            const conflict = await this.checkConflict(appointment.doctorId, newStartTime, newEndTime, id);
            if (conflict) {
                throw new Error(`Rescheduling conflict: ${conflict}`);
            }
            return database_1.default.appointment.update({
                where: { id },
                data: {
                    appointmentDate: newDate,
                    startTime: newStartTime,
                    endTime: newEndTime,
                    status: 'RESCHEDULED',
                    rescheduledFrom: appointment.startTime.toISOString(),
                },
                include: {
                    patient: {
                        select: {
                            fullName: true,
                            phone: true,
                        },
                    },
                    doctor: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            });
        });
    }
    /**
     * Mark appointment as no-show
     */
    async markNoShow(id) {
        return (0, withDb_1.withDb)(async () => {
            const appointment = await database_1.default.appointment.findUnique({
                where: { id },
            });
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            // Check if appointment time has passed
            const now = new Date();
            if (appointment.startTime > now) {
                throw new Error('Cannot mark as no-show before appointment time');
            }
            if (appointment.status === 'CHECKED_IN' || appointment.status === 'COMPLETED') {
                throw new Error(`Cannot mark as no-show with status: ${appointment.status}`);
            }
            return database_1.default.appointment.update({
                where: { id },
                data: {
                    status: 'NO_SHOW',
                },
            });
        });
    }
    /**
     * Uncheck-in appointment (reverse check-in)
     */
    async uncheckInAppointment(id) {
        return (0, withDb_1.withDb)(async () => {
            const appointment = await database_1.default.appointment.findUnique({
                where: { id },
                include: { visit: true },
            });
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            if (appointment.status !== 'CHECKED_IN') {
                throw new Error(`Cannot uncheck-in appointment with status: ${appointment.status}`);
            }
            // Update appointment status back to scheduled
            const updated = await database_1.default.appointment.update({
                where: { id },
                data: {
                    status: 'SCHEDULED',
                    checkedInAt: null,
                },
            });
            // Delete the associated visit if it exists and hasn't been processed
            if (appointment.visit && appointment.visit.status === 'IN_QUEUE') {
                await database_1.default.patientVisit.delete({
                    where: { id: appointment.visit.id },
                });
            }
            return updated;
        });
    }
    /**
     * Update appointment status
     */
    async updateStatus(id, status) {
        return database_1.default.appointment.update({
            where: { id },
            data: { status },
        });
    }
}
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=appointment.service.js.map