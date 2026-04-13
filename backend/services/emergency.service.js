"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergencyService = exports.EmergencyService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EmergencyService {
    // ============================================
    // EMERGENCY CASE MANAGEMENT
    // ============================================
    async createEmergencyCase(data) {
        // Generate case number
        const caseNumber = `EMG-${Date.now()}`;
        const emergencyCase = await prisma.emergencyCase.create({
            data: {
                ...data,
                caseNumber,
                status: 'ACTIVE',
                triageCompletedAt: new Date(),
            },
            include: {
                registeredBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        // Send critical alert if needed
        if (data.triageLevel === 'CRITICAL') {
            // Find available emergency doctors
            const emergencyDoctors = await prisma.user.findMany({
                where: {
                    role: {
                        in: ['DOCTOR', 'EMERGENCY'],
                    },
                    isActive: true,
                },
            });
            // Notify all emergency doctors
            for (const doctor of emergencyDoctors) {
                await prisma.notification.create({
                    data: {
                        userId: doctor.id,
                        notificationType: 'EMERGENCY_CRITICAL',
                        title: 'CRITICAL EMERGENCY',
                        message: `Critical emergency case: ${data.temporaryName || 'Unknown'} - ${data.chiefComplaint}`,
                        relatedId: emergencyCase.id,
                    },
                });
            }
        }
        return emergencyCase;
    }
    async updateEmergencyCase(id, data) {
        const updateData = { ...data };
        // Update status based on vitals improvement
        if (data.glasgowComaScale && data.glasgowComaScale >= 13) {
            updateData.status = 'STABILIZED';
            updateData.stabilizedAt = new Date();
        }
        if (!updateData.treatmentStartedAt) {
            updateData.treatmentStartedAt = new Date();
        }
        return await prisma.emergencyCase.update({
            where: { id },
            data: updateData,
            include: {
                patient: true,
                registeredBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async setDisposition(id, data) {
        return await prisma.emergencyCase.update({
            where: { id },
            data: {
                ...data,
                status: 'COMPLETED',
                dispositionAt: new Date(),
            },
        });
    }
    async convertToFullRegistration(emergencyCaseId, patientData) {
        const emergencyCase = await prisma.emergencyCase.findUnique({
            where: { id: emergencyCaseId },
        });
        if (!emergencyCase) {
            throw new Error('Emergency case not found');
        }
        if (emergencyCase.isConverted) {
            throw new Error('Emergency case already converted');
        }
        // Create patient record
        const cardNumber = `CARD-${Date.now()}`;
        const patient = await prisma.patient.create({
            data: {
                ...patientData,
                cardNumber,
            },
        });
        // Create visit record
        const visit = await prisma.patientVisit.create({
            data: {
                patientId: patient.id,
                visitNumber: 1,
                visitType: 'NEW',
                serviceType: 'EMERGENCY',
                cardFee: 0, // No card fee for emergency
                status: 'IN_CONSULTATION',
                registeredById: patientData.registeredById,
            },
        });
        // Update emergency case
        await prisma.emergencyCase.update({
            where: { id: emergencyCaseId },
            data: {
                patientId: patient.id,
                isConverted: true,
                convertedVisitId: visit.id,
            },
        });
        // Create triage record from emergency data
        await prisma.triageRecord.create({
            data: {
                visitId: visit.id,
                patientId: patient.id,
                triageLevel: emergencyCase.triageLevel,
                chiefComplaint: emergencyCase.chiefComplaint,
                bloodPressure: emergencyCase.bloodPressure,
                heartRate: emergencyCase.heartRate,
                respiratoryRate: emergencyCase.respiratoryRate,
                temperature: emergencyCase.temperature ? Number(emergencyCase.temperature) : undefined,
                oxygenSaturation: emergencyCase.oxygenSaturation,
                routedTo: 'EMERGENCY',
                triageById: patientData.registeredById,
            },
        });
        return {
            patient,
            visit,
        };
    }
    async getActiveEmergencyCases() {
        return await prisma.emergencyCase.findMany({
            where: {
                status: {
                    in: ['ACTIVE', 'STABILIZED'],
                },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                        photoUrl: true,
                    },
                },
                registeredBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: [
                { triageLevel: 'asc' },
                { arrivedAt: 'asc' },
            ],
        });
    }
    async getEmergencyCaseById(id) {
        return await prisma.emergencyCase.findUnique({
            where: { id },
            include: {
                patient: true,
                convertedVisit: {
                    include: {
                        patient: true,
                        assignedDoctor: true,
                    },
                },
                registeredBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async getEmergencyStatistics(dateFrom, dateTo) {
        const where = {};
        if (dateFrom || dateTo) {
            where.arrivedAt = {};
            if (dateFrom)
                where.arrivedAt.gte = dateFrom;
            if (dateTo)
                where.arrivedAt.lte = dateTo;
        }
        const [totalCases, criticalCases, activeCases, completedCases, convertedCases, dischargedCases, admittedCases, referredCases,] = await Promise.all([
            prisma.emergencyCase.count({ where }),
            prisma.emergencyCase.count({ where: { ...where, triageLevel: 'CRITICAL' } }),
            prisma.emergencyCase.count({ where: { ...where, status: 'ACTIVE' } }),
            prisma.emergencyCase.count({ where: { ...where, status: 'COMPLETED' } }),
            prisma.emergencyCase.count({ where: { ...where, isConverted: true } }),
            prisma.emergencyCase.count({ where: { ...where, disposition: 'DISCHARGED' } }),
            prisma.emergencyCase.count({ where: { ...where, disposition: 'ADMITTED' } }),
            prisma.emergencyCase.count({ where: { ...where, disposition: 'REFERRED' } }),
        ]);
        return {
            totalCases,
            criticalCases,
            activeCases,
            completedCases,
            convertedCases,
            dischargedCases,
            admittedCases,
            referredCases,
            conversionRate: totalCases > 0 ? (convertedCases / totalCases) * 100 : 0,
        };
    }
}
exports.EmergencyService = EmergencyService;
exports.emergencyService = new EmergencyService();
//# sourceMappingURL=emergency.service.js.map