"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const patientController = new patient_controller_1.PatientController();
// Validation schemas
const createPatientSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name is required'),
    sex: zod_1.z.enum(['MALE', 'FEMALE']),
    dateOfBirth: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    kebele: zod_1.z.string().optional(),
    wereda: zod_1.z.string().optional(),
    photoUrl: zod_1.z.string().optional(),
    medicalHistory: zod_1.z.string().optional(),
    allergies: zod_1.z.string().optional(),
    bloodType: zod_1.z.string().optional(),
    emergencyContactName: zod_1.z.string().optional(),
    emergencyContactPhone: zod_1.z.string().optional(),
    // Enhanced medical history fields
    hasAllergies: zod_1.z.boolean().optional(),
    allergyDetails: zod_1.z.string().optional(),
    hasDiabetes: zod_1.z.boolean().optional(),
    hasHypertension: zod_1.z.boolean().optional(),
    hasAsthma: zod_1.z.boolean().optional(),
    hasHeartDisease: zod_1.z.boolean().optional(),
    hasKidneyDisease: zod_1.z.boolean().optional(),
    hasEpilepsy: zod_1.z.boolean().optional(),
    currentMedications: zod_1.z.string().optional(),
    familyHistory: zod_1.z.string().optional(),
    surgicalHistory: zod_1.z.string().optional(),
    socialHistory: zod_1.z.string().optional(),
    // Data integrity fields
    isIncomplete: zod_1.z.boolean().optional(),
    incompleteReason: zod_1.z.string().optional(),
});
const checkDuplicatesSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name is required'),
    dateOfBirth: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
});
const archivePatientSchema = zod_1.z.object({
    reason: zod_1.z.string().min(5, 'Archive reason must be at least 5 characters'),
});
// All routes require authentication
router.use(auth_1.authenticate);
// Routes
router.post('/', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), (0, validation_1.validate)(createPatientSchema), patientController.createPatient.bind(patientController));
router.get('/', patientController.getPatients.bind(patientController));
router.get('/:id', patientController.getPatientById.bind(patientController));
router.get('/:id/history', patientController.getPatientHistory.bind(patientController));
// Patient medical data endpoints
router.get('/:patientId/visits', patientController.getPatientVisits.bind(patientController));
router.get('/:patientId/lab-results', patientController.getPatientLabResults.bind(patientController));
router.get('/:patientId/prescriptions', patientController.getPatientPrescriptions.bind(patientController));
router.get('/:patientId/vitals', patientController.getPatientVitals.bind(patientController));
router.put('/:id', patientController.updatePatient.bind(patientController));
router.delete('/:id', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), patientController.deletePatient.bind(patientController));
// New enhanced endpoints
router.post('/check-duplicates', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), (0, validation_1.validate)(checkDuplicatesSchema), patientController.checkDuplicates.bind(patientController));
router.put('/:id/archive', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), (0, validation_1.validate)(archivePatientSchema), patientController.archivePatient.bind(patientController));
router.put('/:id/restore', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), patientController.restorePatient.bind(patientController));
router.put('/:id/complete-registration', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), patientController.completeRegistration.bind(patientController));
exports.default = router;
//# sourceMappingURL=patient.routes.js.map