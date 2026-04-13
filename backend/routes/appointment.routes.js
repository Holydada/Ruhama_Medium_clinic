"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const appointmentController = new appointment_controller_1.AppointmentController();
// Validation schemas
const createAppointmentSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    doctorId: zod_1.z.string().uuid(),
    appointmentDate: zod_1.z.string(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    serviceType: zod_1.z.enum(['OPD', 'ULTRASOUND', 'EMERGENCY', 'INJECTION']),
    reason: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
const cancelAppointmentSchema = zod_1.z.object({
    reason: zod_1.z.string().min(5, 'Cancellation reason must be at least 5 characters'),
});
const rescheduleAppointmentSchema = zod_1.z.object({
    appointmentDate: zod_1.z.string(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
});
// All routes require authentication
router.use(auth_1.authenticate);
// Routes
router.post('/', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN', 'DOCTOR'), (0, validation_1.validate)(createAppointmentSchema), appointmentController.createAppointment.bind(appointmentController));
router.get('/', appointmentController.getAppointments.bind(appointmentController));
router.get('/:id', appointmentController.getAppointmentById.bind(appointmentController));
router.put('/:id/check-in', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), appointmentController.checkInAppointment.bind(appointmentController));
router.put('/:id/cancel', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN', 'DOCTOR'), (0, validation_1.validate)(cancelAppointmentSchema), appointmentController.cancelAppointment.bind(appointmentController));
router.put('/:id/reschedule', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), (0, validation_1.validate)(rescheduleAppointmentSchema), appointmentController.rescheduleAppointment.bind(appointmentController));
router.put('/:id/no-show', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), appointmentController.markNoShow.bind(appointmentController));
router.put('/:id/uncheck-in', (0, auth_1.authorize)('RECEPTIONIST', 'SUPER_ADMIN'), appointmentController.uncheckInAppointment.bind(appointmentController));
exports.default = router;
//# sourceMappingURL=appointment.routes.js.map