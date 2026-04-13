"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionService = void 0;
const database_1 = __importDefault(require("../config/database"));
const withDb_1 = require("../utils/withDb");
class PrescriptionService {
    async createPrescription(data) {
        if (!data.items?.length) {
            throw new Error('Prescription must include at least one line item');
        }
        for (const item of data.items) {
            if (!item.drugName?.trim()) {
                throw new Error('Each item requires drugName');
            }
            if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
                throw new Error('Each item requires quantity greater than 0');
            }
        }
        const visit = await database_1.default.patientVisit.findUnique({
            where: { id: data.visitId },
            select: { id: true, patientId: true },
        });
        if (!visit) {
            throw new Error('Visit not found');
        }
        if (visit.patientId !== data.patientId) {
            throw new Error('patientId does not match this visit');
        }
        const doctor = await database_1.default.user.findUnique({
            where: { id: data.doctorId },
            select: { role: true },
        });
        if (!doctor || (doctor.role !== 'DOCTOR' && doctor.role !== 'SUPER_ADMIN')) {
            throw new Error('Invalid prescribing user');
        }
        for (const item of data.items) {
            if (item.drugId) {
                const drug = await database_1.default.drug.findUnique({
                    where: { id: item.drugId },
                    select: { id: true, isActive: true },
                });
                if (!drug) {
                    throw new Error(`Drug not found: ${item.drugId}`);
                }
                if (!drug.isActive) {
                    throw new Error(`Drug is inactive: ${item.drugId}`);
                }
            }
        }
        // Generate prescription number
        const count = await database_1.default.prescription.count();
        const prescriptionNumber = `RX-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        const prescription = await (0, withDb_1.withDb)(() => database_1.default.prescription.create({
            data: {
                prescriptionNumber,
                visitId: data.visitId,
                patientId: data.patientId,
                doctorId: data.doctorId,
                notes: data.notes,
                status: 'PENDING',
                items: {
                    create: data.items.map(item => ({
                        drugId: item.drugId,
                        drugName: item.drugName,
                        dosage: item.dosage,
                        frequency: item.frequency,
                        duration: item.duration,
                        quantity: item.quantity,
                        instructions: item.instructions,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        drug: true,
                    },
                },
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                    },
                },
                doctor: {
                    select: {
                        fullName: true,
                        department: true,
                    },
                },
                visit: {
                    select: {
                        visitNumber: true,
                        visitDate: true,
                    },
                },
            },
        }));
        return prescription;
    }
    async getPrescriptions(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.status) {
            where.status = params.status;
        }
        if (params.patientId) {
            where.patientId = params.patientId;
        }
        if (params.doctorId) {
            where.doctorId = params.doctorId;
        }
        if (params.date) {
            const startDate = new Date(params.date);
            const endDate = new Date(params.date);
            endDate.setHours(23, 59, 59, 999);
            where.createdAt = {
                gte: startDate,
                lte: endDate,
            };
        }
        const [prescriptions, total] = await Promise.all([
            database_1.default.prescription.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            drug: true,
                        },
                    },
                    patient: {
                        select: {
                            cardNumber: true,
                            fullName: true,
                            sex: true,
                            dateOfBirth: true,
                        },
                    },
                    doctor: {
                        select: {
                            fullName: true,
                            department: true,
                        },
                    },
                    dispensedBy: {
                        select: {
                            fullName: true,
                        },
                    },
                },
            }),
            database_1.default.prescription.count({ where }),
        ]);
        return {
            prescriptions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getPrescriptionById(id) {
        const prescription = await database_1.default.prescription.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        drug: true,
                    },
                },
                patient: true,
                doctor: {
                    select: {
                        fullName: true,
                        department: true,
                        phone: true,
                    },
                },
                visit: true,
                dispensedBy: {
                    select: {
                        fullName: true,
                    },
                },
            },
        });
        if (!prescription) {
            throw new Error('Prescription not found');
        }
        return prescription;
    }
    async dispensePrescription(id, dispensedById, dispenseDetails) {
        const existing = await database_1.default.prescription.findUnique({
            where: { id },
            select: { status: true },
        });
        if (!existing) {
            throw new Error('Prescription not found');
        }
        if (existing.status !== 'PENDING') {
            throw new Error('Only pending prescriptions can be dispensed');
        }
        const prescription = await (0, withDb_1.withDb)(() => database_1.default.prescription.update({
            where: { id },
            data: {
                status: 'DISPENSED',
                dispensedAt: new Date(),
                dispensedById,
            },
            include: {
                items: true,
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                    },
                },
            },
        }));
        await database_1.default.auditLog.create({
            data: {
                userId: dispensedById,
                action: 'PRESCRIPTION_DISPENSED',
                resource: 'prescriptions',
                resourceId: id,
                newValues: (dispenseDetails || {}),
            },
        });
        return prescription;
    }
    async cancelPrescription(id) {
        const existing = await database_1.default.prescription.findUnique({
            where: { id },
            select: { status: true },
        });
        if (!existing) {
            throw new Error('Prescription not found');
        }
        if (existing.status !== 'PENDING') {
            throw new Error('Only pending prescriptions can be cancelled');
        }
        return (0, withDb_1.withDb)(() => database_1.default.prescription.update({
            where: { id },
            data: {
                status: 'CANCELLED',
            },
        }));
    }
    // Get prescription queue for pharmacy
    async getPrescriptionQueue(params) {
        const take = params?.limit && params.limit > 0 ? Math.min(params.limit, 500) : 300;
        const prescriptions = await database_1.default.prescription.findMany({
            where: {
                status: 'PENDING',
            },
            orderBy: { createdAt: 'asc' },
            take,
            include: {
                items: true,
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                        sex: true,
                        dateOfBirth: true,
                    },
                },
                doctor: {
                    select: {
                        fullName: true,
                    },
                },
            },
        });
        return prescriptions;
    }
}
exports.PrescriptionService = PrescriptionService;
//# sourceMappingURL=prescription.service.js.map