"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicalDecisionSupportController = exports.ClinicalDecisionSupportController = void 0;
const clinical_decision_support_service_1 = require("../services/clinical-decision-support.service");
class ClinicalDecisionSupportController {
    async checkDrugInteractions(req, res) {
        try {
            const { patientId, drugName } = req.body;
            if (!patientId || !drugName) {
                res.status(400).json({
                    success: false,
                    message: 'Patient ID and drug name are required',
                });
                return;
            }
            const interactions = await clinical_decision_support_service_1.clinicalDecisionSupportService.checkDrugInteractions(patientId, drugName);
            res.json({
                success: true,
                data: {
                    hasInteractions: interactions.length > 0,
                    interactions,
                },
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async checkDrugAllergy(req, res) {
        try {
            const { patientId, drugName } = req.body;
            if (!patientId || !drugName) {
                res.status(400).json({
                    success: false,
                    message: 'Patient ID and drug name are required',
                });
                return;
            }
            const allergyCheck = await clinical_decision_support_service_1.clinicalDecisionSupportService.checkDrugAllergy(patientId, drugName);
            res.json({
                success: true,
                data: {
                    hasAllergy: allergyCheck !== null,
                    allergyCheck,
                },
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async assessLabValue(req, res) {
        try {
            const { testName, value, unit, patientAge, patientSex } = req.body;
            if (!testName || value === undefined || !unit) {
                res.status(400).json({
                    success: false,
                    message: 'Test name, value, and unit are required',
                });
                return;
            }
            const assessment = clinical_decision_support_service_1.clinicalDecisionSupportService.assessLabValue(testName, parseFloat(value), unit, patientAge ? parseInt(patientAge) : undefined, patientSex);
            res.json({
                success: true,
                data: assessment,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getClinicalGuidelines(req, res) {
        try {
            const { diagnosis } = req.query;
            if (!diagnosis) {
                res.status(400).json({
                    success: false,
                    message: 'Diagnosis is required',
                });
                return;
            }
            const guidelines = await clinical_decision_support_service_1.clinicalDecisionSupportService.getClinicalGuidelines(diagnosis);
            res.json({
                success: true,
                data: guidelines,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async checkContraindications(req, res) {
        try {
            const { patientId, drugName } = req.body;
            if (!patientId || !drugName) {
                res.status(400).json({
                    success: false,
                    message: 'Patient ID and drug name are required',
                });
                return;
            }
            const contraindications = await clinical_decision_support_service_1.clinicalDecisionSupportService.checkContraindications(patientId, drugName);
            res.json({
                success: true,
                data: {
                    hasContraindications: contraindications.length > 0,
                    contraindications,
                },
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async comprehensiveDrugCheck(req, res) {
        try {
            const { patientId, drugName } = req.body;
            if (!patientId || !drugName) {
                res.status(400).json({
                    success: false,
                    message: 'Patient ID and drug name are required',
                });
                return;
            }
            // Run all checks in parallel
            const [interactions, allergyCheck, contraindications] = await Promise.all([
                clinical_decision_support_service_1.clinicalDecisionSupportService.checkDrugInteractions(patientId, drugName),
                clinical_decision_support_service_1.clinicalDecisionSupportService.checkDrugAllergy(patientId, drugName),
                clinical_decision_support_service_1.clinicalDecisionSupportService.checkContraindications(patientId, drugName),
            ]);
            const hasIssues = interactions.length > 0 ||
                allergyCheck !== null ||
                contraindications.length > 0;
            const criticalIssues = [
                ...interactions.filter(i => i.severity === 'CRITICAL'),
                ...(allergyCheck?.severity === 'SEVERE' ? [allergyCheck] : []),
            ];
            res.json({
                success: true,
                data: {
                    safe: !hasIssues,
                    hasCriticalIssues: criticalIssues.length > 0,
                    interactions,
                    allergyCheck,
                    contraindications,
                    recommendation: hasIssues
                        ? 'Review warnings before prescribing'
                        : 'No significant issues detected',
                },
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.ClinicalDecisionSupportController = ClinicalDecisionSupportController;
exports.clinicalDecisionSupportController = new ClinicalDecisionSupportController();
//# sourceMappingURL=clinical-decision-support.controller.js.map