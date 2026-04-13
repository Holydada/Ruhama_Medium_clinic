"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const database_1 = __importDefault(require("../config/database"));
const withDb_1 = require("../utils/withDb");
class PatientService {
    async createPatient(data, registeredById) {
        if (!data?.fullName || !String(data.fullName).trim()) {
            throw new Error('fullName is required');
        }
        if (!data?.sex || !['MALE', 'FEMALE'].includes(data.sex)) {
            throw new Error('sex must be MALE or FEMALE');
        }
        if (!data?.dateOfBirth) {
            throw new Error('dateOfBirth is required');
        }
        const dob = new Date(data.dateOfBirth);
        if (Number.isNaN(dob.getTime())) {
            throw new Error('dateOfBirth is invalid');
        }
        // Medical history is completely optional - no validation required
        const registrar = await database_1.default.user.findUnique({
            where: { id: registeredById },
            select: { id: true },
        });
        if (!registrar) {
            throw new Error('Registering user not found');
        }
        return (0, withDb_1.withDb)(async () => {
            const year = new Date().getFullYear();
            const count = await database_1.default.patient.count();
            const cardNumber = `RH-${year}-${String(count + 1).padStart(5, '0')}`;
            return database_1.default.patient.create({
                data: {
                    cardNumber,
                    fullName: String(data.fullName).trim(),
                    sex: data.sex,
                    dateOfBirth: dob,
                    phone: data.phone,
                    address: data.address,
                    kebele: data.kebele,
                    wereda: data.wereda,
                    photoUrl: data.photoUrl,
                    medicalHistory: data.medicalHistory,
                    allergies: data.allergies,
                    bloodType: data.bloodType,
                    emergencyContactName: data.emergencyContactName,
                    emergencyContactPhone: data.emergencyContactPhone,
                    // Enhanced medical history fields
                    hasAllergies: data.hasAllergies || false,
                    allergyDetails: data.allergyDetails,
                    hasDiabetes: data.hasDiabetes || false,
                    hasHypertension: data.hasHypertension || false,
                    hasAsthma: data.hasAsthma || false,
                    hasHeartDisease: data.hasHeartDisease || false,
                    hasKidneyDisease: data.hasKidneyDisease || false,
                    hasEpilepsy: data.hasEpilepsy || false,
                    currentMedications: data.currentMedications,
                    familyHistory: data.familyHistory,
                    surgicalHistory: data.surgicalHistory,
                    socialHistory: data.socialHistory,
                    // Data integrity fields
                    isIncomplete: data.isIncomplete || false,
                    incompleteReason: data.incompleteReason,
                    registeredById,
                },
                include: {
                    registeredBy: {
                        select: {
                            id: true,
                            fullName: true,
                            role: true,
                        },
                    },
                },
            });
        });
    }
    async getPatients(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        // Filter by incomplete status
        if (params.isIncomplete !== undefined) {
            where.isIncomplete = params.isIncomplete;
        }
        // Filter archived patients
        if (!params.showArchived) {
            where.archivedAt = null;
        }
        // Search filter
        if (params.search) {
            where.OR = [
                { fullName: { contains: params.search, mode: 'insensitive' } },
                { cardNumber: { contains: params.search, mode: 'insensitive' } },
                { phone: { contains: params.search } },
            ];
        }
        const [patients, total] = await Promise.all([
            database_1.default.patient.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    registeredBy: {
                        select: {
                            fullName: true,
                            role: true,
                        },
                    },
                    visits: {
                        select: {
                            visitDate: true,
                        },
                        orderBy: {
                            visitDate: 'desc',
                        },
                        take: 1,
                    },
                },
            }),
            database_1.default.patient.count({ where }),
        ]);
        return {
            patients,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getPatientById(id) {
        const patient = await database_1.default.patient.findUnique({
            where: { id },
            include: {
                registeredBy: {
                    select: {
                        fullName: true,
                        role: true,
                    },
                },
                visits: {
                    orderBy: { visitDate: 'desc' },
                    take: 10,
                    include: {
                        assignedDoctor: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    }
    async updatePatient(id, data) {
        return (0, withDb_1.withDb)(async () => {
            const existing = await database_1.default.patient.findUnique({ where: { id } });
            if (!existing) {
                throw new Error('Patient not found');
            }
            const patch = {};
            const assign = (key, val) => {
                if (val === undefined)
                    return;
                patch[key] = val;
            };
            assign('fullName', data.fullName !== undefined ? String(data.fullName).trim() : undefined);
            assign('phone', data.phone);
            assign('address', data.address);
            assign('kebele', data.kebele);
            assign('wereda', data.wereda);
            assign('photoUrl', data.photoUrl);
            assign('medicalHistory', data.medicalHistory);
            assign('allergies', data.allergies);
            assign('bloodType', data.bloodType);
            assign('emergencyContactName', data.emergencyContactName);
            assign('emergencyContactPhone', data.emergencyContactPhone);
            if (Object.keys(patch).length === 0) {
                throw new Error('No valid fields to update');
            }
            return database_1.default.patient.update({
                where: { id },
                data: patch,
                include: {
                    registeredBy: {
                        select: {
                            fullName: true,
                            role: true,
                        },
                    },
                },
            });
        });
    }
    async getPatientHistory(id) {
        const patient = await database_1.default.patient.findUnique({
            where: { id },
            include: {
                visits: {
                    orderBy: { visitDate: 'desc' },
                    include: {
                        assignedDoctor: {
                            select: {
                                fullName: true,
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
                    },
                },
            },
        });
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    }
    async deletePatient(id) {
        return (0, withDb_1.withDb)(async () => {
            const patient = await database_1.default.patient.findUnique({
                where: { id },
                include: {
                    visits: true,
                    prescriptions: true,
                    labOrders: true,
                    ultrasoundOrders: true,
                    injectionOrders: true,
                    transactions: true,
                    invoices: true,
                },
            });
            if (!patient) {
                throw new Error('Patient not found');
            }
            // Check if patient has any visits
            if (patient.visits.length > 0) {
                throw new Error('Cannot delete patient with existing visits. Please archive instead.');
            }
            // Delete patient (cascade will handle related records)
            await database_1.default.patient.delete({
                where: { id },
            });
            return { id, deleted: true };
        });
    }
    /**
     * Check for duplicate patients using fuzzy matching
     */
    async checkDuplicates(data) {
        const matches = [];
        // Find potential matches
        const candidates = await database_1.default.patient.findMany({
            where: {
                archivedAt: null, // Only check active patients
                OR: [
                    // Fuzzy name match
                    { fullName: { contains: data.fullName.split(' ')[0], mode: 'insensitive' } },
                    // Phone match
                    ...(data.phone ? [{ phone: data.phone }] : []),
                ],
            },
            include: {
            // visits: { // visits relation doesn't exist on Patient model
            // orderBy: { visitDate: 'desc' },
            // take: 1,
            // },
            },
            take: 10,
        });
        // Calculate similarity scores
        for (const candidate of candidates) {
            let score = 0;
            const reasons = [];
            // Name similarity (Levenshtein-like simple comparison)
            const nameSimilarity = this.calculateNameSimilarity(data.fullName.toLowerCase(), candidate.fullName.toLowerCase());
            if (nameSimilarity > 0.7) {
                score += nameSimilarity * 50;
                reasons.push(`Name similarity: ${Math.round(nameSimilarity * 100)}%`);
            }
            // Exact DOB match
            if (data.dateOfBirth && candidate.dateOfBirth) {
                const inputDob = new Date(data.dateOfBirth).toISOString().split('T')[0];
                candidateDob = candidate.dateOfBirth.toISOString().split('T')[0];
                if (inputDob === candidateDob) {
                    score += 30;
                    reasons.push('Exact date of birth match');
                }
            }
            // Phone match
            if (data.phone && candidate.phone && data.phone === candidate.phone) {
                score += 20;
                reasons.push('Phone number match');
            }
            // Only include if score is significant
            if (score >= 50) {
                matches.push({
                    patient: {
                        id: candidate.id,
                        cardNumber: candidate.cardNumber,
                        fullName: candidate.fullName,
                        sex: candidate.sex,
                        dateOfBirth: candidate.dateOfBirth,
                        phone: candidate.phone,
                        photoUrl: candidate.photoUrl,
                        lastVisit: null, // candidate.visits[0]?.visitDate || null,
                    },
                    similarityScore: Math.min(Math.round(score), 100),
                    matchReasons: reasons,
                });
            }
        }
        // Sort by similarity score
        matches.sort((a, b) => b.similarityScore - a.similarityScore);
        return matches;
    }
    /**
     * Simple name similarity calculation
     */
    calculateNameSimilarity(name1, name2) {
        // Simple word-based comparison
        const words1 = name1.split(/\s+/).filter(w => w.length > 2);
        const words2 = name2.split(/\s+/).filter(w => w.length > 2);
        if (words1.length === 0 || words2.length === 0)
            return 0;
        let matches = 0;
        for (const word1 of words1) {
            for (const word2 of words2) {
                if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
                    matches++;
                    break;
                }
            }
        }
        return matches / Math.max(words1.length, words2.length);
    }
    /**
     * Archive a patient (soft delete)
     */
    async archivePatient(id, reason, archivedBy) {
        return (0, withDb_1.withDb)(async () => {
            const patient = await database_1.default.patient.findUnique({
                where: { id },
                include: {
                    visits: true,
                },
            });
            if (!patient) {
                throw new Error('Patient not found');
            }
            if (patient.archivedAt) {
                throw new Error('Patient is already archived');
            }
            // Archive the patient
            const archived = await database_1.default.patient.update({
                where: { id },
                data: {
                    archivedAt: new Date(),
                    archivedBy,
                    archivedReason: reason,
                },
                include: {
                    registeredBy: {
                        select: {
                            fullName: true,
                            role: true,
                        },
                    },
                },
            });
            // TODO: Create audit log entry when PatientAuditService is implemented
            return archived;
        });
    }
    /**
     * Restore an archived patient
     */
    async restorePatient(id) {
        return (0, withDb_1.withDb)(async () => {
            const patient = await database_1.default.patient.findUnique({
                where: { id },
            });
            if (!patient) {
                throw new Error('Patient not found');
            }
            if (!patient.archivedAt) {
                throw new Error('Patient is not archived');
            }
            return database_1.default.patient.update({
                where: { id },
                data: {
                    archivedAt: null,
                    archivedBy: null,
                    archivedReason: null,
                },
            });
        });
    }
    /**
     * Complete an incomplete patient registration
     */
    async completeRegistration(id, data) {
        return (0, withDb_1.withDb)(async () => {
            const patient = await database_1.default.patient.findUnique({
                where: { id },
            });
            if (!patient) {
                throw new Error('Patient not found');
            }
            if (!patient.isIncomplete) {
                throw new Error('Patient registration is already complete');
            }
            // Update with complete information
            const patch = {
                isIncomplete: false,
                incompleteReason: null,
            };
            // Update all provided fields
            if (data.phone)
                patch.phone = data.phone;
            if (data.address)
                patch.address = data.address;
            if (data.emergencyContactName)
                patch.emergencyContactName = data.emergencyContactName;
            if (data.emergencyContactPhone)
                patch.emergencyContactPhone = data.emergencyContactPhone;
            if (data.medicalHistory)
                patch.medicalHistory = data.medicalHistory;
            if (data.allergies)
                patch.allergies = data.allergies;
            if (data.bloodType)
                patch.bloodType = data.bloodType;
            // Enhanced medical history
            if (data.hasAllergies !== undefined)
                patch.hasAllergies = data.hasAllergies;
            if (data.allergyDetails)
                patch.allergyDetails = data.allergyDetails;
            if (data.hasDiabetes !== undefined)
                patch.hasDiabetes = data.hasDiabetes;
            if (data.hasHypertension !== undefined)
                patch.hasHypertension = data.hasHypertension;
            if (data.hasAsthma !== undefined)
                patch.hasAsthma = data.hasAsthma;
            if (data.hasHeartDisease !== undefined)
                patch.hasHeartDisease = data.hasHeartDisease;
            if (data.hasKidneyDisease !== undefined)
                patch.hasKidneyDisease = data.hasKidneyDisease;
            if (data.hasEpilepsy !== undefined)
                patch.hasEpilepsy = data.hasEpilepsy;
            if (data.currentMedications)
                patch.currentMedications = data.currentMedications;
            if (data.familyHistory)
                patch.familyHistory = data.familyHistory;
            if (data.surgicalHistory)
                patch.surgicalHistory = data.surgicalHistory;
            if (data.socialHistory)
                patch.socialHistory = data.socialHistory;
            return database_1.default.patient.update({
                where: { id },
                data: patch,
                include: {
                    registeredBy: {
                        select: {
                            fullName: true,
                            role: true,
                        },
                    },
                },
            });
        });
    }
    /**
     * Get patient visits with full details
     */
    async getPatientVisits(patientId) {
        const visits = await database_1.default.patientVisit.findMany({
            where: { patientId },
            orderBy: { visitDate: 'desc' },
            include: {
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
                doctorEncounters: {
                    orderBy: { startedAt: 'desc' },
                },
            },
        });
        return visits.map(visit => ({
            id: visit.id,
            visitDate: visit.visitDate,
            visitType: visit.visitType,
            chiefComplaint: visit.triageRecords[0]?.chiefComplaint,
            diagnosis: visit.doctorEncounters[0]?.primaryDiagnosis,
            doctorName: visit.assignedDoctor?.fullName || 'Not assigned',
            status: visit.status,
        }));
    }
    /**
     * Get patient lab results
     */
    async getPatientLabResults(patientId) {
        const labOrders = await database_1.default.labOrder.findMany({
            where: { patientId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        test: true,
                    },
                },
            },
        });
        const results = [];
        for (const order of labOrders) {
            for (const item of order.items) {
                results.push({
                    id: item.id,
                    testName: item.testName,
                    result: item.result || 'Pending',
                    status: item.status,
                    orderedDate: order.createdAt,
                    completedDate: item.completedAt,
                    isAbnormal: item.isAbnormal || false,
                });
            }
        }
        return results;
    }
    /**
     * Get patient prescriptions
     */
    async getPatientPrescriptions(patientId) {
        const prescriptions = await database_1.default.prescription.findMany({
            where: { patientId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        drug: true,
                    },
                },
            },
        });
        const results = [];
        for (const prescription of prescriptions) {
            for (const item of prescription.items) {
                results.push({
                    id: item.id,
                    medicationName: item.drugName,
                    dosage: item.dosage,
                    frequency: item.frequency,
                    duration: item.duration,
                    prescribedDate: prescription.createdAt,
                    status: prescription.status,
                });
            }
        }
        return results;
    }
    /**
     * Get patient vital signs history
     */
    async getPatientVitals(patientId) {
        const vitals = await database_1.default.vitalSigns.findMany({
            where: {
                visit: {
                    patientId,
                },
            },
            orderBy: { recordedAt: 'desc' },
            take: 50, // Last 50 vital sign records
        });
        return vitals.map(vital => ({
            id: vital.id,
            recordedDate: vital.recordedAt,
            bloodPressure: vital.bloodPressure,
            heartRate: vital.heartRate,
            temperature: vital.temperature,
            oxygenSaturation: vital.oxygenSaturation,
            weight: vital.weight,
        }));
    }
}
exports.PatientService = PatientService;
//# sourceMappingURL=patient.service.js.map