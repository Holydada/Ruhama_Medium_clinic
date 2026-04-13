"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emergency_controller_1 = require("../controllers/emergency.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// All emergency routes require EMERGENCY or DOCTOR role
const emergencyRoles = ['EMERGENCY', 'DOCTOR', 'NURSE'];
// ============================================
// EMERGENCY CASE ROUTES
// ============================================
// Create emergency case (fast registration)
router.post('/cases', (0, auth_1.authorize)(emergencyRoles), (req, res) => emergency_controller_1.emergencyController.createEmergencyCase(req, res));
// Get active emergency cases
router.get('/cases/active', (0, auth_1.authorize)(emergencyRoles), (req, res) => emergency_controller_1.emergencyController.getActiveEmergencyCases(req, res));
// Get emergency case by ID
router.get('/cases/:id', (0, auth_1.authorize)(emergencyRoles), (req, res) => emergency_controller_1.emergencyController.getEmergencyCaseById(req, res));
// Update emergency case (treatment notes, vitals, etc.)
router.put('/cases/:id', (0, auth_1.authorize)(emergencyRoles), (req, res) => emergency_controller_1.emergencyController.updateEmergencyCase(req, res));
// Set disposition (discharge, admit, refer, etc.)
router.post('/cases/:id/disposition', (0, auth_1.authorize)(['EMERGENCY', 'DOCTOR']), (req, res) => emergency_controller_1.emergencyController.setDisposition(req, res));
// Convert to full patient registration
router.post('/cases/:id/convert', (0, auth_1.authorize)(emergencyRoles), (req, res) => emergency_controller_1.emergencyController.convertToFullRegistration(req, res));
// Get emergency statistics
router.get('/statistics', (0, auth_1.authorize)(['EMERGENCY', 'DOCTOR', 'SUPER_ADMIN']), (req, res) => emergency_controller_1.emergencyController.getEmergencyStatistics(req, res));
exports.default = router;
//# sourceMappingURL=emergency.routes.js.map