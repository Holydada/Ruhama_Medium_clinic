"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitService = void 0;
const database_1 = __importDefault(require("../config/database"));
const notification_service_1 = require("./notification.service");
const finance_service_1 = require("./finance.service");
const withDb_1 = require("../utils/withDb");
const notificationService = new notification_service_1.NotificationService();
const financeService = new finance_service_1.FinanceService();
const VISIT_STATUSES = ['REGISTERED', 'IN_QUEUE', 'IN_CONSULTATION', 'COMPLETED'];
async function assertDoctorUser(userId) {
    const user = await database_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
    });
    if (!user) {
        throw new Error('Doctor not found');
    }
    if (user.role !== 'DOCTOR' && user.role !== 'SUPER_ADMIN') {
        throw new Error('Assigned user must be a doctor');
    }
}
class VisitService {
    async createVisit(data) {
        const patient = await database_1.default.patient.findUnique({
            where: { id: data.patientId },
            select: { id: true },
        });
        if (!patient) {
            throw new Error('Patient not found');
        }
        if (data.assignedDoctorId) {
            await assertDoctorUser(data.assignedDoctorId);
        }
        // Get patient's last visit to determine card fee
        const lastVisit = await database_1.default.patientVisit.findFirst({
            where: { patientId: data.patientId },
            orderBy: { visitDate: 'desc' },
        });
        // Calculate card fee based on 30-day rule
        let cardFee = 30.00; // Default for new card
        if (lastVisit && data.visitType === 'REPEAT') {
            const daysSinceLastVisit = Math.floor((Date.now() - lastVisit.visitDate.getTime()) / (1000 * 60 * 60 * 24));
            // If within 30 days, card fee is 0
            if (daysSinceLastVisit <= 30) {
                cardFee = 0;
            }
        }
        // Get visit number for this patient
        const visitCount = await database_1.default.patientVisit.count({
            where: { patientId: data.patientId },
        });
        // Create visit
        const visit = await (0, withDb_1.withDb)(() => database_1.default.patientVisit.create({
            data: {
                patientId: data.patientId,
                visitNumber: visitCount + 1,
                visitType: data.visitType,
                visitDate: new Date(),
                cardFee,
                serviceType: data.serviceType,
                assignedDoctorId: data.assignedDoctorId,
                status: 'REGISTERED',
                registeredById: data.registeredById,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                        phone: true,
                    },
                },
                assignedDoctor: {
                    select: {
                        id: true,
                        fullName: true,
                        department: true,
                    },
                },
            },
        }));
        // Create financial transactions for card fee and service fee
        let totalRevenue = 0;
        if (Number(visit.cardFee) > 0) {
            await financeService.createPaidSystemCharge({
                patientId: visit.patientId,
                visitId: visit.id,
                transactionType: 'CARD_FEE',
                amount: Number(visit.cardFee),
                description: `Card fee for visit ${visit.visitNumber}`,
                collectedById: data.registeredById,
            });
            totalRevenue += Number(visit.cardFee);
        }
        // Handle ultrasound service fee
        if (data.serviceType === 'ULTRASOUND' && data.ultrasoundFee && data.ultrasoundFee > 0) {
            await financeService.createPaidSystemCharge({
                patientId: visit.patientId,
                visitId: visit.id,
                transactionType: 'ULTRASOUND_FEE',
                amount: data.ultrasoundFee,
                description: `Ultrasound service fee - ${data.visitType === 'FOLLOW_UP' ? 'Follow-up' : 'One-time'}`,
                collectedById: data.registeredById,
            });
            totalRevenue += data.ultrasoundFee;
        }
        return { ...visit, totalRevenue };
    }
    async getVisits(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.date) {
            const startDate = new Date(params.date);
            const endDate = new Date(params.date);
            endDate.setHours(23, 59, 59, 999);
            where.visitDate = {
                gte: startDate,
                lte: endDate,
            };
        }
        if (params.status) {
            where.status = params.status;
        }
        if (params.doctorId) {
            where.assignedDoctorId = params.doctorId;
        }
        if (params.serviceType) {
            where.serviceType = params.serviceType;
        }
        if (params.unassignedOnly) {
            where.assignedDoctorId = null;
        }
        const [visits, total] = await Promise.all([
            database_1.default.patientVisit.findMany({
                where,
                skip,
                take: limit,
                orderBy: { visitDate: 'desc' },
                include: {
                    patient: {
                        select: {
                            id: true,
                            cardNumber: true,
                            fullName: true,
                            sex: true,
                            dateOfBirth: true,
                            photoUrl: true,
                        },
                    },
                    assignedDoctor: {
                        select: {
                            fullName: true,
                            department: true,
                        },
                    },
                },
            }),
            database_1.default.patientVisit.count({ where }),
        ]);
        // Get stats
        const stats = await database_1.default.patientVisit.groupBy({
            by: ['status'],
            where: params.date ? {
                visitDate: {
                    gte: new Date(params.date),
                    lte: new Date(new Date(params.date).setHours(23, 59, 59, 999)),
                },
            } : {},
            _count: true,
        });
        return {
            visits,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            stats: stats.reduce((acc, stat) => {
                acc[stat.status.toLowerCase()] = stat._count;
                return acc;
            }, {}),
        };
    }
    async getVisitById(id) {
        const visit = await database_1.default.patientVisit.findUnique({
            where: { id },
            include: {
                patient: true,
                assignedDoctor: {
                    select: {
                        fullName: true,
                        department: true,
                        phone: true,
                    },
                },
                prescriptions: {
                    include: {
                        items: true,
                    },
                },
                labOrders: {
                    include: {
                        items: true,
                    },
                },
                ultrasoundOrders: true,
                injectionOrders: true,
                transactions: true,
            },
        });
        if (!visit) {
            throw new Error('Visit not found');
        }
        return visit;
    }
    async updateVisitStatus(id, status) {
        if (!VISIT_STATUSES.includes(status)) {
            throw new Error(`Invalid visit status: ${status}`);
        }
        return (0, withDb_1.withDb)(() => database_1.default.patientVisit.update({
            where: { id },
            data: { status: status },
            include: {
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                    },
                },
            },
        }));
    }
    async assignDoctor(visitId, doctorId) {
        await assertDoctorUser(doctorId);
        const visit = await (0, withDb_1.withDb)(() => database_1.default.patientVisit.update({
            where: { id: visitId },
            data: {
                assignedDoctorId: doctorId,
                status: 'IN_QUEUE',
            },
            include: {
                patient: true,
                assignedDoctor: {
                    select: {
                        fullName: true,
                        department: true,
                    },
                },
            },
        }));
        // Notify doctor about new patient assignment
        // await notificationService.notifyNewPatient(doctorId, visit.patient.fullName, visit.id);
        return visit;
    }
    async saveSoapNote(visitId, authorId, payload) {
        const visit = await database_1.default.patientVisit.findUnique({ where: { id: visitId } });
        if (!visit) {
            throw new Error('Visit not found');
        }
        if (!payload.patientId || payload.patientId !== visit.patientId) {
            throw new Error('patientId does not match this visit');
        }
        if (payload.isDraft !== true) {
            const required = ['chiefComplaint', 'subjective', 'objective', 'assessment', 'plan'];
            for (const key of required) {
                const v = payload[key];
                if (!v || !String(v).trim()) {
                    throw new Error(`${key} is required`);
                }
            }
            if (String(payload.assessment).trim().length < 10) {
                throw new Error('assessment must be at least 10 characters');
            }
        }
        await database_1.default.auditLog.create({
            data: {
                userId: authorId,
                action: payload.isDraft ? 'SOAP_NOTE_DRAFT_SAVED' : 'SOAP_NOTE_SAVED',
                resource: 'patient_visits',
                resourceId: visitId,
                newValues: payload,
            },
        });
        return { visitId, saved: true };
    }
    async getEncounterTimeline(visitId) {
        const [visit, prescriptionRows, labRows, injectionRows, ultrasoundRows, txRows, logs] = await Promise.all([
            database_1.default.patientVisit.findUnique({
                where: { id: visitId },
                include: {
                    registeredBy: { select: { fullName: true, role: true } },
                    assignedDoctor: { select: { fullName: true, role: true } },
                },
            }),
            database_1.default.prescription.findMany({
                where: { visitId },
                select: { id: true, createdAt: true, status: true, doctor: { select: { fullName: true, role: true } } },
            }),
            database_1.default.labOrder.findMany({
                where: { visitId },
                select: { id: true, orderedAt: true, status: true, orderedBy: { select: { fullName: true, role: true } } },
            }),
            database_1.default.injectionOrder.findMany({
                where: { visitId },
                select: { id: true, createdAt: true, status: true, orderedBy: { select: { fullName: true, role: true } } },
            }),
            database_1.default.ultrasoundOrder.findMany({
                where: { visitId },
                select: { id: true, createdAt: true, status: true, orderedBy: { select: { fullName: true, role: true } } },
            }),
            database_1.default.financialTransaction.findMany({
                where: { visitId },
                select: {
                    id: true,
                    createdAt: true,
                    transactionType: true,
                    paymentStatus: true,
                    collectedBy: { select: { fullName: true, role: true } },
                },
            }),
            database_1.default.auditLog.findMany({
                where: {
                    OR: [{ resourceId: visitId }, { resource: 'patient_visits', resourceId: visitId }],
                },
                orderBy: { timestamp: 'desc' },
                include: { user: { select: { fullName: true, role: true } } },
                take: 100,
            }),
        ]);
        if (!visit) {
            throw new Error('Visit not found');
        }
        const synthesized = [
            {
                id: `visit-${visit.id}`,
                action: `VISIT_${visit.status}`,
                createdAt: visit.createdAt,
                resource: 'patient_visits',
                user: visit.registeredBy || null,
            },
            ...prescriptionRows.map((p) => ({
                id: `rx-${p.id}`,
                action: `PRESCRIPTION_${p.status}`,
                createdAt: p.createdAt,
                resource: 'prescriptions',
                user: p.doctor || null,
            })),
            ...labRows.map((l) => ({
                id: `lab-${l.id}`,
                action: `LAB_ORDER_${l.status}`,
                createdAt: l.orderedAt,
                resource: 'lab_orders',
                user: l.orderedBy || null,
            })),
            ...injectionRows.map((i) => ({
                id: `inj-${i.id}`,
                action: `INJECTION_ORDER_${i.status}`,
                createdAt: i.createdAt,
                resource: 'injection_orders',
                user: i.orderedBy || null,
            })),
            ...ultrasoundRows.map((u) => ({
                id: `us-${u.id}`,
                action: `ULTRASOUND_ORDER_${u.status}`,
                createdAt: u.createdAt,
                resource: 'ultrasound_orders',
                user: u.orderedBy || null,
            })),
            ...txRows.map((t) => ({
                id: `txn-${t.id}`,
                action: `${t.transactionType}_${t.paymentStatus}`,
                createdAt: t.createdAt,
                resource: 'financial_transactions',
                user: t.collectedBy || null,
            })),
        ];
        const merged = [...logs, ...synthesized]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 200);
        return merged;
    }
    async recordNurseVitals(visitId, userId, vitals) {
        const visit = await database_1.default.patientVisit.findUnique({ where: { id: visitId } });
        if (!visit) {
            throw new Error('Visit not found');
        }
        const nums = [
            ['bloodPressureSystolic', vitals.bloodPressureSystolic],
            ['bloodPressureDiastolic', vitals.bloodPressureDiastolic],
            ['temperature', vitals.temperature],
            ['heartRate', vitals.heartRate],
            ['respiratoryRate', vitals.respiratoryRate],
            ['oxygenSaturation', vitals.oxygenSaturation],
        ];
        for (const [name, val] of nums) {
            if (!Number.isFinite(val)) {
                throw new Error(`${name} must be a valid number`);
            }
        }
        if (vitals.weight !== undefined && !Number.isFinite(vitals.weight)) {
            throw new Error('weight must be a valid number');
        }
        if (vitals.height !== undefined && !Number.isFinite(vitals.height)) {
            throw new Error('height must be a valid number');
        }
        if (vitals.bmi !== undefined && !Number.isFinite(vitals.bmi)) {
            throw new Error('bmi must be a valid number');
        }
        await database_1.default.auditLog.create({
            data: {
                userId,
                action: 'NURSE_VITALS_RECORDED',
                resource: 'patient_visits',
                resourceId: visitId,
                newValues: vitals,
            },
        });
        return { visitId, recorded: true };
    }
}
exports.VisitService = VisitService;
//# sourceMappingURL=visit.service.js.map