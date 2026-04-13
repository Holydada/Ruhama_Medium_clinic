"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prescription_controller_1 = require("../controllers/prescription.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prescriptionController = new prescription_controller_1.PrescriptionController();
// Validation schemas
const createPrescriptionSchema = zod_1.z.object({
    visitId: zod_1.z.string().uuid(),
    patientId: zod_1.z.string().uuid(),
    items: zod_1.z.array(zod_1.z.object({
        drugId: zod_1.z.string().uuid().optional(),
        drugName: zod_1.z.string().min(1),
        dosage: zod_1.z.string().min(1),
        frequency: zod_1.z.string().min(1),
        duration: zod_1.z.string().min(1),
        quantity: zod_1.z.number().positive(),
        instructions: zod_1.z.string().optional(),
    })).min(1),
    notes: zod_1.z.string().optional(),
});
// All routes require authentication
router.use(auth_1.authenticate);
// Routes
router.post('/', (0, auth_1.authorize)('DOCTOR', 'SUPER_ADMIN'), (0, validation_1.validate)(createPrescriptionSchema), prescriptionController.createPrescription.bind(prescriptionController));
router.get('/', prescriptionController.getPrescriptions.bind(prescriptionController));
router.get('/queue', (0, auth_1.authorize)('PHARMACIST', 'SUPER_ADMIN'), prescriptionController.getPrescriptionQueue.bind(prescriptionController));
router.get('/:id', prescriptionController.getPrescriptionById.bind(prescriptionController));
router.post('/:id/dispense', (0, auth_1.authorize)('PHARMACIST', 'SUPER_ADMIN'), prescriptionController.dispensePrescription.bind(prescriptionController));
router.post('/:id/cancel', (0, auth_1.authorize)('DOCTOR', 'PHARMACIST', 'SUPER_ADMIN'), prescriptionController.cancelPrescription.bind(prescriptionController));
exports.default = router;
//# sourceMappingURL=prescription.routes.js.map