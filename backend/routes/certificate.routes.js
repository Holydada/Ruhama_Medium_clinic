"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificate_controller_1 = require("../controllers/certificate.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Certificate routes require DOCTOR role
const doctorRoles = ['DOCTOR', 'SUPER_ADMIN'];
// ============================================
// SICK LEAVE CERTIFICATE ROUTES
// ============================================
// Create sick leave certificate
router.post('/sick-leave', (0, auth_1.authorize)(doctorRoles), (req, res) => certificate_controller_1.certificateController.createSickLeaveCertificate(req, res));
// Get sick leave certificate by ID
router.get('/sick-leave/:id', (0, auth_1.authorize)([...doctorRoles, 'RECEPTIONIST', 'FINANCE']), (req, res) => certificate_controller_1.certificateController.getSickLeaveCertificate(req, res));
// Get patient's sick leave certificates
router.get('/sick-leave/patient/:patientId', (0, auth_1.authorize)([...doctorRoles, 'RECEPTIONIST']), (req, res) => certificate_controller_1.certificateController.getPatientSickLeaveCertificates(req, res));
// ============================================
// MEDICAL CERTIFICATE ROUTES
// ============================================
// Create medical certificate
router.post('/medical', (0, auth_1.authorize)(doctorRoles), (req, res) => certificate_controller_1.certificateController.createMedicalCertificate(req, res));
// Update medical certificate
router.put('/medical/:id', (0, auth_1.authorize)(doctorRoles), (req, res) => certificate_controller_1.certificateController.updateMedicalCertificate(req, res));
// Sign medical certificate
router.post('/medical/:id/sign', (0, auth_1.authorize)(doctorRoles), (req, res) => certificate_controller_1.certificateController.signMedicalCertificate(req, res));
// Get medical certificate by ID
router.get('/medical/:id', (0, auth_1.authorize)([...doctorRoles, 'RECEPTIONIST', 'FINANCE']), (req, res) => certificate_controller_1.certificateController.getMedicalCertificate(req, res));
// Get patient's medical certificates
router.get('/medical/patient/:patientId', (0, auth_1.authorize)([...doctorRoles, 'RECEPTIONIST']), (req, res) => certificate_controller_1.certificateController.getPatientMedicalCertificates(req, res));
exports.default = router;
//# sourceMappingURL=certificate.routes.js.map