"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nurseService = exports.NurseService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NurseService {
    // ============================================
    // TRIAGE MANAGEMENT
    // ============================================
    async createTriageRecord(data) {
        // Calculate BMI if weight and height provided
        let bmi;
        if (data.weight && data.height) {
            const heightInMeters = data.height / 100;
            bmi = data.weight / (heightInMeters * heightInMeters);
        }
        const triageRecord = await prisma.triageRecord.create({
            data: {
                ...data,
                bmi,
                alertSent: data.triageLevel === 'CRITICAL',
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                        sex: true,
                        dateOfBirth: true,
                        photoUrl: true,
                    },
                },
                visit: true,
                triageBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        // Update visit status
        await prisma.patientVisit.update({
            where: { id: data.visitId },
            data: {
                triageLevel: data.triageLevel,
                status: 'IN_QUEUE',
            },
        });
        // Send notification to assigned doctor if critical
        if (data.triageLevel === 'CRITICAL') {
            const visit = await prisma.patientVisit.findUnique({
                where: { id: data.visitId },
                include: { assignedDoctor: true },
            });
            if (visit?.assignedDoctorId) {
                await prisma.notification.create({
                    data: {
                        userId: visit.assignedDoctorId,
                        notificationType: 'CRITICAL_PATIENT',
                        title: 'Critical Patient Alert',
                        message: `Critical patient: ${triageRecord.patient.fullName} - ${data.chiefComplaint}`,
                        relatedId: data.visitId,
                    },
                });
            }
        }
        return triageRecord;
    }
    async getTriageQueue(filters) {
        const where = {};
        if (filters?.triageLevel) {
            where.triageLevel = filters.triageLevel;
        }
        if (filters?.routedTo) {
            where.routedTo = filters.routedTo;
        }
        if (filters?.date) {
            const startOfDay = new Date(filters.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filters.date);
            endOfDay.setHours(23, 59, 59, 999);
            where.triageAt = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        return await prisma.triageRecord.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                        sex: true,
                        dateOfBirth: true,
                        photoUrl: true,
                    },
                },
                visit: {
                    include: {
                        assignedDoctor: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                },
                triageBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: [
                { triageLevel: 'asc' }, // Critical first
                { triageAt: 'asc' },
            ],
        });
    }
    // ============================================
    // VITAL SIGNS MANAGEMENT
    // ============================================
    async recordVitalSigns(data) {
        // Calculate BMI
        let bmi;
        if (data.weight && data.height) {
            const heightInMeters = data.height / 100;
            bmi = data.weight / (heightInMeters * heightInMeters);
        }
        // Check if vitals are abnormal
        const isAbnormal = this.checkAbnormalVitals({
            heartRate: data.heartRate,
            respiratoryRate: data.respiratoryRate,
            temperature: data.temperature,
            oxygenSaturation: data.oxygenSaturation,
        });
        const vitalSigns = await prisma.vitalSigns.create({
            data: {
                ...data,
                bmi,
                isAbnormal,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                    },
                },
                recordedBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        // Send alert if abnormal
        if (isAbnormal) {
            const visit = await prisma.patientVisit.findUnique({
                where: { id: data.visitId },
                include: { assignedDoctor: true },
            });
            if (visit?.assignedDoctorId) {
                await prisma.notification.create({
                    data: {
                        userId: visit.assignedDoctorId,
                        notificationType: 'ABNORMAL_VITALS',
                        title: 'Abnormal Vital Signs',
                        message: `Abnormal vitals for ${vitalSigns.patient.fullName}`,
                        relatedId: data.visitId,
                    },
                });
            }
        }
        return vitalSigns;
    }
    checkAbnormalVitals(vitals) {
        if (vitals.heartRate && (vitals.heartRate < 60 || vitals.heartRate > 100)) {
            return true;
        }
        if (vitals.respiratoryRate && (vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20)) {
            return true;
        }
        if (vitals.temperature && (vitals.temperature < 36.1 || vitals.temperature > 37.2)) {
            return true;
        }
        if (vitals.oxygenSaturation && vitals.oxygenSaturation < 95) {
            return true;
        }
        return false;
    }
    async getVitalSignsHistory(patientId, visitId) {
        const where = { patientId };
        if (visitId) {
            where.visitId = visitId;
        }
        return await prisma.vitalSigns.findMany({
            where,
            include: {
                recordedBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { recordedAt: 'desc' },
        });
    }
    // ============================================
    // NURSING NOTES
    // ============================================
    async createNursingNote(data) {
        return await prisma.nursingNote.create({
            data,
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async updateNursingNote(id, data) {
        // Check if note is locked
        const note = await prisma.nursingNote.findUnique({
            where: { id },
        });
        if (note?.isLocked) {
            throw new Error('Cannot update locked nursing note');
        }
        // Check if note is older than 15 minutes
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        if (note && note.createdAt < fifteenMinutesAgo) {
            throw new Error('Cannot update note older than 15 minutes');
        }
        return await prisma.nursingNote.update({
            where: { id },
            data,
        });
    }
    async lockNursingNote(id) {
        return await prisma.nursingNote.update({
            where: { id },
            data: {
                isLocked: true,
                lockedAt: new Date(),
            },
        });
    }
    async getNursingNotes(visitId) {
        return await prisma.nursingNote.findMany({
            where: { visitId },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // ============================================
    // INJECTION ADMINISTRATION
    // ============================================
    async getInjectionQueue(filters) {
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.date) {
            const startOfDay = new Date(filters.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filters.date);
            endOfDay.setHours(23, 59, 59, 999);
            where.createdAt = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        return await prisma.injectionOrder.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                        sex: true,
                        dateOfBirth: true,
                        photoUrl: true,
                        allergies: true,
                    },
                },
                visit: {
                    include: {
                        vitalSigns: {
                            orderBy: { recordedAt: 'desc' },
                            take: 1,
                        },
                    },
                },
                orderedBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
                administrations: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async administerInjection(data) {
        // Create administration record
        const administration = await prisma.injectionAdministration.create({
            data: {
                ...data,
                patientVerified: true,
                medicationVerified: true,
                doseVerified: true,
                routeVerified: true,
                timeVerified: true,
            },
            include: {
                order: {
                    include: {
                        patient: true,
                        orderedBy: true,
                    },
                },
                administeredBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        // Update order status
        await prisma.injectionOrder.update({
            where: { id: data.orderId },
            data: { status: 'ADMINISTERED' },
        });
        // Create financial transaction for injection fee
        await prisma.financialTransaction.create({
            data: {
                transactionNumber: `INJ-${Date.now()}`,
                patientId: administration.order.patientId,
                visitId: administration.order.visitId,
                transactionType: 'INJECTION_FEE',
                amount: 50, // Default injection fee
                paymentMethod: 'CASH',
                paymentStatus: 'PAID',
                description: `Injection: ${administration.order.medicationName}`,
            },
        });
        // Notify doctor if adverse event
        if (data.hasAdverseEvent) {
            await prisma.notification.create({
                data: {
                    userId: administration.order.orderedById,
                    notificationType: 'ADVERSE_EVENT',
                    title: 'Adverse Reaction Reported',
                    message: `Adverse reaction for ${administration.order.patient.fullName} - ${data.adverseEventType}`,
                    relatedId: data.orderId,
                },
            });
        }
        else {
            // Notify doctor of completion
            await prisma.notification.create({
                data: {
                    userId: administration.order.orderedById,
                    notificationType: 'INJECTION_COMPLETED',
                    title: 'Injection Completed',
                    message: `Injection administered for ${administration.order.patient.fullName}`,
                    relatedId: data.orderId,
                },
            });
        }
        return administration;
    }
    // ============================================
    // OBSERVATION BOARD
    // ============================================
    async getObservationBoard(location) {
        const where = {
            status: {
                in: ['IN_QUEUE', 'IN_CONSULTATION'],
            },
        };
        if (location) {
            where.serviceType = location;
        }
        const visits = await prisma.patientVisit.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                        photoUrl: true,
                    },
                },
                assignedDoctor: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
                triageRecords: {
                    orderBy: { triageAt: 'desc' },
                    take: 1,
                },
                vitalSigns: {
                    orderBy: { recordedAt: 'desc' },
                    take: 1,
                },
                injectionOrders: {
                    where: { status: 'PENDING' },
                },
                labOrders: {
                    where: { status: 'PENDING' },
                },
            },
            orderBy: [
                { triageLevel: 'asc' },
                { visitDate: 'asc' },
            ],
        });
        return visits;
    }
}
exports.NurseService = NurseService;
exports.nurseService = new NurseService();
//# sourceMappingURL=nurse.service.js.map