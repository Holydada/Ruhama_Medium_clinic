"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientPortalService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const patient_service_1 = require("./patient.service");
const patientService = new patient_service_1.PatientService();
class PatientPortalService {
    async getDashboard(userId, audit) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { role: true, patientLinkId: true },
        });
        if (!user || user.role !== client_1.UserRole.PATIENT || !user.patientLinkId) {
            throw new Error('Portal profile is not linked to a patient record');
        }
        const patient = await patientService.getPatientById(user.patientLinkId);
        await database_1.default.auditLog.create({
            data: {
                userId,
                action: 'PATIENT_PORTAL_DASHBOARD_ACCESS',
                resource: 'patients',
                resourceId: user.patientLinkId,
                newValues: { scope: 'portal_dashboard' },
                ipAddress: audit?.ipAddress,
                userAgent: audit?.userAgent,
            },
        });
        return {
            profile: {
                fullName: patient.fullName,
                cardNumber: patient.cardNumber,
                sex: patient.sex,
                dateOfBirth: patient.dateOfBirth,
                phone: patient.phone,
                allergies: patient.allergies,
                bloodType: patient.bloodType,
            },
            recentVisits: patient.visits.map((v) => ({
                id: v.id,
                visitDate: v.visitDate,
                status: v.status,
                serviceType: v.serviceType,
                doctor: v.assignedDoctor?.fullName ?? null,
            })),
        };
    }
}
exports.PatientPortalService = PatientPortalService;
//# sourceMappingURL=patientPortal.service.js.map