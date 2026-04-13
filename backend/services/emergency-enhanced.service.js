"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergencyEnhancedService = exports.EmergencyEnhancedService = void 0;
const database_1 = __importDefault(require("../config/database"));
const withDb_1 = require("../utils/withDb");
const finance_service_1 = require("./finance.service");
const financeService = new finance_service_1.FinanceService();
class EmergencyEnhancedService {
    // ============================================
    // QUICK REGISTRATION (Minimal Data)
    // ============================================
    async createEmergencyCase(data) {
        const count = await database_1.default.emergencyCase.count();
        const caseNumber = `EMG-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        const emergencyCase = await (0, withDb_1.withDb)(() => database_1.default.emergencyCase.create({
            data: {
                caseNumber,
                temporaryName: data.temporaryName || 'Unknown',
                approximateAge: data.approximateAge,
                sex: data.sex,
                phone: data.phone,
                guardianName: data.guardianName,
                guardianPhone: data.guardianPhone,
                triageLevel: data.triageLevel,
                chiefComplaint: data.chiefComplaint,
                modeOfArrival: data.modeOfArrival,
                vitalSigns: data.vitalSigns,
                status: 'ACTIVE',
                triageById: data.triageById,
            },
            include: {
                triageBy: {
                    select: {
                        fullName: true,
                        role: true,
                    },
                },
            },
        }));
        // Create notification for emergency doctors
        const emergencyDoctors = await database_1.default.user.findMany({
            where: {
                role: {
                    in: ['EMERGENCY', 'DOCTOR', 'SUPER_ADMIN'],
                },
                isActive: true,
            },
        });
        for (const doctor of emergencyDoctors) {
            await database_1.default.notification.create({
                data: {
                    userId: doctor.id,
                    notificationType: 'EMERGENCY_CASE',
                    title: `🚨 ${data.triageLevel} Emergency Case`,
                    message: `New emergency case: ${data.temporaryName || 'Unknown'} - ${data.chiefComplaint}`,
                    relatedId: emergencyCase.id,
                },
            });
        }
        return emergencyCase;
    }
    // ============================================
    // EMERGENCY TREATMENT
    // ============================================
    async updateEmergencyTreatment(caseId, data) {
        return (0, withDb_1.withDb)(() => database_1.default.emergencyCase.update({
            where: { id: caseId },
            data: {
                immediateActions: data.immediateActions,
                treatmentGiven: data.treatmentGiven,
                medicationsGiven: data.medicationsGiven,
                proceduresPerformed: data.proceduresPerformed,
                attendingDoctorId: data.attendingDoctorId,
                status: 'STABILIZED',
            },
            include: {
                triageBy: {
                    select: {
                        fullName: true,
                    },
                },
            },
        }));
    }
    // ============================================
    // CONVERT TO FULL PATIENT REGISTRATION
    // ============================================
    async convertToFullPatient(caseId, patientData, registeredById) {
        const emergencyCase = await database_1.default.emergencyCase.findUnique({
            where: { id: caseId },
        });
        if (!emergencyCase) {
            throw new Error('Emergency case not found');
        }
        if (emergencyCase.isConverted) {
            throw new Error('Emergency case already converted to full patient');
        }
        return (0, withDb_1.withDb)(() => database_1.default.$transaction(async (tx) => {
            // Generate card number
            const patientCount = await tx.patient.count();
            const cardNumber = `P-${new Date().getFullYear()}-${String(patientCount + 1).padStart(6, '0')}`;
            // Create full patient record
            const patient = await tx.patient.create({
                data: {
                    cardNumber,
                    fullName: patientData.fullName,
                    sex: patientData.sex,
                    dateOfBirth: patientData.dateOfBirth,
                    phone: patientData.phone || emergencyCase.phone,
                    address: patientData.address,
                    kebele: patientData.kebele,
                    wereda: patientData.wereda,
                    photoUrl: patientData.photoUrl,
                    medicalHistory: patientData.medicalHistory,
                    allergies: patientData.allergies,
                    emergencyContactName: patientData.emergencyContactName || emergencyCase.guardianName,
                    emergencyContactPhone: patientData.emergencyContactPhone || emergencyCase.guardianPhone,
                    registeredById,
                },
            });
            // Create patient visit
            const visitCount = await tx.patientVisit.count({
                where: { patientId: patient.id },
            });
            const visit = await tx.patientVisit.create({
                data: {
                    patientId: patient.id,
                    visitNumber: visitCount + 1,
                    visitType: 'NEW',
                    visitDate: emergencyCase.arrivedAt,
                    cardFee: 30, // Emergency card fee
                    serviceType: 'EMERGENCY',
                    status: 'IN_CONSULTATION',
                    registeredById,
                },
            });
            // Update emergency case
            await tx.emergencyCase.update({
                where: { id: caseId },
                data: {
                    patientId: patient.id,
                    visitId: visit.id,
                    isConverted: true,
                    convertedAt: new Date(),
                },
            });
            // Create financial transaction for card fee
            await financeService.createSystemCharge({
                patientId: patient.id,
                visitId: visit.id,
                transactionType: 'CARD_FEE',
                amount: 30,
                description: 'Emergency patient registration card fee',
            });
            return {
                patient,
                visit,
                emergencyCase,
            };
        }));
    }
    // ============================================
    // DISPOSITION
    // ============================================
    async setDisposition(caseId, data) {
        return (0, withDb_1.withDb)(() => database_1.default.emergencyCase.update({
            where: { id: caseId },
            data: {
                disposition: data.disposition,
                dispositionNotes: data.dispositionNotes,
                referredTo: data.referredTo,
                admittedTo: data.admittedTo,
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        }));
    }
    // ============================================
    // QUERIES
    // ============================================
    async getEmergencyCases(params) {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.triageLevel) {
            where.triageLevel = params.triageLevel;
        }
        if (params?.isConverted !== undefined) {
            where.isConverted = params.isConverted;
        }
        if (params?.date) {
            const startOfDay = new Date(params.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(params.date);
            endOfDay.setHours(23, 59, 59, 999);
            where.arrivedAt = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const skip = (page - 1) * limit;
        const [cases, total] = await Promise.all([
            database_1.default.emergencyCase.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { triageLevel: 'asc' },
                    { arrivedAt: 'desc' },
                ],
                include: {
                    patient: {
                        select: {
                            cardNumber: true,
                            fullName: true,
                        },
                    },
                    visit: {
                        select: {
                            visitNumber: true,
                        },
                    },
                    triageBy: {
                        select: {
                            fullName: true,
                            role: true,
                        },
                    },
                },
            }),
            database_1.default.emergencyCase.count({ where }),
        ]);
        return {
            cases,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getEmergencyCaseById(id) {
        const emergencyCase = await database_1.default.emergencyCase.findUnique({
            where: { id },
            include: {
                patient: true,
                visit: {
                    include: {
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
                        injectionOrders: true,
                    },
                },
                triageBy: {
                    select: {
                        fullName: true,
                        role: true,
                        phone: true,
                    },
                },
            },
        });
        if (!emergencyCase) {
            throw new Error('Emergency case not found');
        }
        return emergencyCase;
    }
    async getActiveEmergencyCases() {
        return await database_1.default.emergencyCase.findMany({
            where: {
                status: {
                    in: ['ACTIVE', 'STABILIZED'],
                },
            },
            orderBy: [
                { triageLevel: 'asc' },
                { arrivedAt: 'asc' },
            ],
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                    },
                },
                triageBy: {
                    select: {
                        fullName: true,
                    },
                },
            },
        });
    }
}
exports.EmergencyEnhancedService = EmergencyEnhancedService;
exports.emergencyEnhancedService = new EmergencyEnhancedService();
//# sourceMappingURL=emergency-enhanced.service.js.map