"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateController = exports.CertificateController = void 0;
const certificate_service_1 = require("../services/certificate.service");
class CertificateController {
    // ============================================
    // SICK LEAVE CERTIFICATES
    // ============================================
    async createSickLeaveCertificate(req, res) {
        try {
            const certificateData = {
                ...req.body,
                issuedById: req.user.id,
            };
            const certificate = await certificate_service_1.certificateService.createSickLeaveCertificate(certificateData);
            res.status(201).json({
                success: true,
                data: certificate,
                message: 'Sick leave certificate created successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getSickLeaveCertificate(req, res) {
        try {
            const { id } = req.params;
            const certificate = await certificate_service_1.certificateService.getSickLeaveCertificate(id);
            if (!certificate) {
                res.status(404).json({
                    success: false,
                    message: 'Sick leave certificate not found',
                });
                return;
            }
            res.json({
                success: true,
                data: certificate,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getPatientSickLeaveCertificates(req, res) {
        try {
            const { patientId } = req.params;
            const certificates = await certificate_service_1.certificateService.getPatientSickLeaveCertificates(patientId);
            res.json({
                success: true,
                data: certificates,
                count: certificates.length,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    // ============================================
    // MEDICAL CERTIFICATES
    // ============================================
    async createMedicalCertificate(req, res) {
        try {
            const certificateData = {
                ...req.body,
                issuedById: req.user.id,
            };
            const certificate = await certificate_service_1.certificateService.createMedicalCertificate(certificateData);
            res.status(201).json({
                success: true,
                data: certificate,
                message: 'Medical certificate created successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async updateMedicalCertificate(req, res) {
        try {
            const { id } = req.params;
            const certificate = await certificate_service_1.certificateService.updateMedicalCertificate(id, req.body);
            res.json({
                success: true,
                data: certificate,
                message: 'Medical certificate updated successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async signMedicalCertificate(req, res) {
        try {
            const { id } = req.params;
            const certificate = await certificate_service_1.certificateService.signMedicalCertificate(id, req.body);
            res.json({
                success: true,
                data: certificate,
                message: 'Medical certificate signed successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getMedicalCertificate(req, res) {
        try {
            const { id } = req.params;
            const certificate = await certificate_service_1.certificateService.getMedicalCertificate(id);
            if (!certificate) {
                res.status(404).json({
                    success: false,
                    message: 'Medical certificate not found',
                });
                return;
            }
            res.json({
                success: true,
                data: certificate,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getPatientMedicalCertificates(req, res) {
        try {
            const { patientId } = req.params;
            const certificates = await certificate_service_1.certificateService.getPatientMedicalCertificates(patientId);
            res.json({
                success: true,
                data: certificates,
                count: certificates.length,
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
exports.CertificateController = CertificateController;
exports.certificateController = new CertificateController();
//# sourceMappingURL=certificate.controller.js.map