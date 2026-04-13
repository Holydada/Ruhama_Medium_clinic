"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nurse_controller_1 = require("../controllers/nurse.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// ============================================
// TRIAGE ROUTES
// ============================================
// Create triage record
router.post('/triage', (0, auth_1.authorize)(['NURSE', 'EMERGENCY']), (req, res) => nurse_controller_1.nurseController.createTriage(req, res));
// Get triage queue
router.get('/triage/queue', (0, auth_1.authorize)(['NURSE', 'DOCTOR', 'EMERGENCY']), (req, res) => nurse_controller_1.nurseController.getTriageQueue(req, res));
// ============================================
// VITAL SIGNS ROUTES
// ============================================
// Record vital signs
router.post('/vital-signs', (0, auth_1.authorize)(['NURSE', 'DOCTOR', 'EMERGENCY']), (req, res) => nurse_controller_1.nurseController.recordVitalSigns(req, res));
// Get vital signs history
router.get('/vital-signs/:patientId', (0, auth_1.authorize)(['NURSE', 'DOCTOR', 'EMERGENCY']), (req, res) => nurse_controller_1.nurseController.getVitalSignsHistory(req, res));
// ============================================
// NURSING NOTES ROUTES
// ============================================
// Create nursing note
router.post('/nursing-notes', (0, auth_1.authorize)(['NURSE']), (req, res) => nurse_controller_1.nurseController.createNursingNote(req, res));
// Update nursing note
router.put('/nursing-notes/:id', (0, auth_1.authorize)(['NURSE']), (req, res) => nurse_controller_1.nurseController.updateNursingNote(req, res));
// Lock nursing note
router.post('/nursing-notes/:id/lock', (0, auth_1.authorize)(['NURSE']), (req, res) => nurse_controller_1.nurseController.lockNursingNote(req, res));
// Get nursing notes for a visit
router.get('/nursing-notes/visit/:visitId', (0, auth_1.authorize)(['NURSE', 'DOCTOR']), (req, res) => nurse_controller_1.nurseController.getNursingNotes(req, res));
// ============================================
// INJECTION ROOM ROUTES
// ============================================
// Get injection queue
router.get('/injection-queue', (0, auth_1.authorize)(['NURSE', 'INJECTION_ROOM']), (req, res) => nurse_controller_1.nurseController.getInjectionQueue(req, res));
// Administer injection
router.post('/injection-administration', (0, auth_1.authorize)(['NURSE', 'INJECTION_ROOM']), (req, res) => nurse_controller_1.nurseController.administerInjection(req, res));
// ============================================
// OBSERVATION BOARD ROUTES
// ============================================
// Get observation board
router.get('/observation-board', (0, auth_1.authorize)(['NURSE', 'DOCTOR', 'EMERGENCY']), (req, res) => nurse_controller_1.nurseController.getObservationBoard(req, res));
exports.default = router;
//# sourceMappingURL=nurse.routes.js.map