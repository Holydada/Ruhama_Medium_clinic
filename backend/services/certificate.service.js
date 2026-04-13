"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateService = exports.CertificateService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CertificateService {
    // ============================================
    // SICK LEAVE CERTIFICATES
    // ============================================
    async createSickLeaveCertificate(data) {
        const certificateNumber = `SL-${Date.now()}`;
        // Calculate end date
        const endDate = new Date(data.startDate);
        endDate.setDate(endDate.getDate() + data.sickLeaveDays);
        const certificate = await prisma.sickLeaveCertificate.create({
            data: {
                ...data,
                certificateNumber,
                endDate,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                        sex: true,
                        dateOfBirth: true,
                        phone: true,
                        address: true,
                    },
                },
                visit: true,
                issuedBy: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
        // TODO: Generate PDF
        // const pdfPath = await this.generateSickLeavePDF(certificate);
        // await prisma.sickLeaveCertificate.update({
        //   where: { id: certificate.id },
        //   data: {
        //     pdfPath,
        //     pdfGeneratedAt: new Date(),
        //   },
        // });
        return certificate;
    }
    async getSickLeaveCertificate(id) {
        return await prisma.sickLeaveCertificate.findUnique({
            where: { id },
            include: {
                patient: true,
                visit: true,
                issuedBy: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getPatientSickLeaveCertificates(patientId) {
        return await prisma.sickLeaveCertificate.findMany({
            where: { patientId },
            include: {
                issuedBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    // ============================================
    // MEDICAL CERTIFICATES
    // ============================================
    async createMedicalCertificate(data) {
        const certificateNumber = `MC-${Date.now()}`;
        const certificate = await prisma.medicalCertificate.create({
            data: {
                ...data,
                certificateNumber,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        fullName: true,
                        cardNumber: true,
                        sex: true,
                        dateOfBirth: true,
                        phone: true,
                        address: true,
                    },
                },
                visit: true,
                issuedBy: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
        // TODO: Generate PDF
        // const pdfPath = await this.generateMedicalCertificatePDF(certificate);
        // await prisma.medicalCertificate.update({
        //   where: { id: certificate.id },
        //   data: {
        //     pdfPath,
        //     pdfGeneratedAt: new Date(),
        //   },
        // });
        return certificate;
    }
    async updateMedicalCertificate(id, data) {
        return await prisma.medicalCertificate.update({
            where: { id },
            data,
            include: {
                patient: true,
                issuedBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async signMedicalCertificate(id, data) {
        const updateData = {};
        if (data.patientSignature) {
            updateData.patientSignature = data.patientSignature;
            updateData.patientSignedAt = new Date();
        }
        if (data.doctorSignature) {
            updateData.doctorSignature = data.doctorSignature;
        }
        return await prisma.medicalCertificate.update({
            where: { id },
            data: updateData,
        });
    }
    async getMedicalCertificate(id) {
        return await prisma.medicalCertificate.findUnique({
            where: { id },
            include: {
                patient: true,
                visit: true,
                issuedBy: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getPatientMedicalCertificates(patientId) {
        return await prisma.medicalCertificate.findMany({
            where: { patientId },
            include: {
                issuedBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    // ============================================
    // PDF GENERATION (Placeholder)
    // ============================================
    async generateSickLeavePDF(certificate) {
        // TODO: Implement PDF generation using a library like PDFKit or Puppeteer
        // This should generate a professional sick leave certificate with:
        // - Clinic letterhead
        // - Patient details
        // - Diagnosis
        // - Sick leave period
        // - Doctor signature
        // - Clinic stamp
        return `/certificates/sick-leave/${certificate.certificateNumber}.pdf`;
    }
    async generateMedicalCertificatePDF(certificate) {
        // TODO: Implement PDF generation
        // This should generate a comprehensive medical certificate with:
        // - All examination sections
        // - Lab results
        // - Final determination (FIT/UNFIT)
        // - Signatures
        // - Clinic stamp
        return `/certificates/medical/${certificate.certificateNumber}.pdf`;
    }
}
exports.CertificateService = CertificateService;
exports.certificateService = new CertificateService();
//# sourceMappingURL=certificate.service.js.map