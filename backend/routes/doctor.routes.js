"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const auth_1 = require("../middleware/auth");

const router = (0, express_1.Router)();
const doctorController = new doctor_controller_1.DoctorController();

// All routes require authentication
router.use(auth_1.authenticate);

// All doctor routes require DOCTOR or SUPER_ADMIN role
const doctorRoles = ['DOCTOR', 'SUPER_ADMIN'];

// ============================================
// QUEUE & DASHBOARD ROUTES
// ============================================

// Get doctor's patient queue
router.get('/queue', (0, auth_1.authorize)(...doctorRoles), 
  (req, res) => doctorController.getQueue(req, res));

// Get doctor statistics
router.get('/stats', (0, auth_1.authorize)(...doctorRoles),
  (req, res) => doctorController.getStats(req, res));

// ============================================
// VISIT & ENCOUNTER ROUTES
// ============================================

// Get visit details for encounter
router.get('/visit/:visitId', (0, auth_1.authorize)(...doctorRoles),
  (req, res) => doctorController.getVisitDetails(req, res));

// Create doctor encounter
router.post('/encounter', (0, auth_1.authorize)(...doctorRoles),
  (req, res) => doctorController.createEncounter(req, res));

// Complete visit
router.patch('/visit/:visitId/complete', (0, auth_1.authorize)(...doctorRoles),
  (req, res) => doctorController.completeVisit(req, res));

// ============================================
// ORDER ROUTES
// ============================================

// Create prescription (send to pharmacy)
router.post('/prescription', (0, auth_1.authorize)(...doctorRoles),
  (req, res) => doctorController.createPrescription(req, res));

// Create lab order (send to laboratory)
router.post('/lab-order', (0, auth_1.authorize)(...doctorRoles),
  (req, res) => {
    console.log('[DOCTOR ROUTES] Lab order endpoint hit!', req.body);
    return doctorController.createLabOrder(req, res);
  });

// Create injection order (send to injection room)
router.post('/injection-order', (0, auth_1.authorize)(...doctorRoles),
  (req, res) => doctorController.createInjectionOrder(req, res));

exports.default = router;
//# sourceMappingURL=doctor.routes.js.map