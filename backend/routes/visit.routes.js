"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visit_controller_1 = require("../controllers/visit.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const visitController = new visit_controller_1.VisitController();
// Validation schemas
const createVisitSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    visitType: zod_1.z.enum(['NEW', 'REPEAT', 'FOLLOW_UP']),
    serviceType: zod_1.z.enum(['OPD', 'ULTRASOUND', 'EMERGENCY', 'INJECTION']),
    assignedDoctorId: zod_1.z.string().uuid().optional(),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['REGISTERED', 'IN_QUEUE', 'IN_CONSULTATION', 'COMPLETED']),
});
const assignDoctorSchema = zod_1.z.object({
    doctorId: zod_1.z.string().uuid(),
});
const saveSoapSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    chiefComplaint: zod_1.z.string().min(3),
    subjective: zod_1.z.string().min(10),
    objective: zod_1.z.string().min(10),
    assessment: zod_1.z.string().min(10),
    plan: zod_1.z.string().min(10),
    vitalSigns: zod_1.z
        .object({
        bloodPressure: zod_1.z.string().optional(),
        temperature: zod_1.z.string().optional(),
        heartRate: zod_1.z.string().optional(),
        respiratoryRate: zod_1.z.string().optional(),
        oxygenSaturation: zod_1.z.string().optional(),
    })
        .optional(),
    isDraft: zod_1.z.boolean().optional(),
});
const nurseVitalsSchema = zod_1.z.object({
    bloodPressureSystolic: zod_1.z.number().min(50).max(250),
    bloodPressureDiastolic: zod_1.z.number().min(30).max(150),
    temperature: zod_1.z.number().min(35).max(42),
    heartRate: zod_1.z.number().min(40).max(200),
    respiratoryRate: zod_1.z.number().min(8).max(40),
    oxygenSaturation: zod_1.z.number().min(70).max(100),
    weight: zod_1.z.number().min(1).max(300).optional(),
    height: zod_1.z.number().min(50).max(250).optional(),
    bmi: zod_1.z.number().optional(),
    notes: zod_1.z.string().optional(),
});
// All routes require authentication
router.use(auth_1.authenticate);
// Routes
router.post('/', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN', 'NURSE'), (0, validation_1.validate)(createVisitSchema), visitController.createVisit.bind(visitController));
router.get('/', visitController.getVisits.bind(visitController));
router.post('/:id/nurse-vitals', (0, auth_1.authorize)('NURSE', 'SUPER_ADMIN'), (0, validation_1.validate)(nurseVitalsSchema), visitController.recordNurseVitals.bind(visitController));
router.get('/:id', visitController.getVisitById.bind(visitController));
router.patch('/:id/status', (0, validation_1.validate)(updateStatusSchema), visitController.updateVisitStatus.bind(visitController));
router.patch('/:id/assign-doctor', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), (0, validation_1.validate)(assignDoctorSchema), visitController.assignDoctor.bind(visitController));
router.post('/:id/soap', (0, auth_1.authorize)('DOCTOR', 'SUPER_ADMIN'), (0, validation_1.validate)(saveSoapSchema), visitController.saveSoapNote.bind(visitController));
router.get('/:id/timeline', (0, auth_1.authorize)('DOCTOR', 'NURSE', 'SUPER_ADMIN'), visitController.getEncounterTimeline.bind(visitController));
exports.default = router;
//# sourceMappingURL=visit.routes.js.map