"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clinical_decision_support_controller_1 = require("../controllers/clinical-decision-support.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Clinical decision support routes (doctors and pharmacists)
const authorizedRoles = ['DOCTOR', 'PHARMACIST', 'SUPER_ADMIN'];
// Check drug interactions
router.post('/drug-interactions', (0, auth_1.authorize)(authorizedRoles), (req, res) => clinical_decision_support_controller_1.clinicalDecisionSupportController.checkDrugInteractions(req, res));
// Check drug allergies
router.post('/drug-allergy', (0, auth_1.authorize)(authorizedRoles), (req, res) => clinical_decision_support_controller_1.clinicalDecisionSupportController.checkDrugAllergy(req, res));
// Assess lab value
router.post('/assess-lab-value', (0, auth_1.authorize)(authorizedRoles), (req, res) => clinical_decision_support_controller_1.clinicalDecisionSupportController.assessLabValue(req, res));
// Get clinical guidelines
router.get('/clinical-guidelines', (0, auth_1.authorize)(authorizedRoles), (req, res) => clinical_decision_support_controller_1.clinicalDecisionSupportController.getClinicalGuidelines(req, res));
// Check contraindications
router.post('/contraindications', (0, auth_1.authorize)(authorizedRoles), (req, res) => clinical_decision_support_controller_1.clinicalDecisionSupportController.checkContraindications(req, res));
// Comprehensive drug check (all checks at once)
router.post('/comprehensive-drug-check', (0, auth_1.authorize)(authorizedRoles), (req, res) => clinical_decision_support_controller_1.clinicalDecisionSupportController.comprehensiveDrugCheck(req, res));
exports.default = router;
//# sourceMappingURL=clinical-decision-support.routes.js.map