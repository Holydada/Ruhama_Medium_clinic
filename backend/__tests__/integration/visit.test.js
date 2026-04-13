"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const visit_service_1 = require("../../services/visit.service");
const testUtils_1 = require("./testUtils");
describe('VisitService integration', () => {
    const service = new visit_service_1.VisitService();
    beforeAll(async () => {
        await database_1.default.$connect();
    });
    beforeEach(async () => {
        await (0, testUtils_1.resetDb)();
    });
    afterAll(async () => {
        await (0, testUtils_1.resetDb)();
        await database_1.default.$disconnect();
    });
    it('Create visit for existing patient -> success', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const doctor = await (0, testUtils_1.createUser)('DOCTOR');
        const patient = await (0, testUtils_1.createPatient)(registrar.id);
        const visit = await service.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            assignedDoctorId: doctor.id,
            registeredById: registrar.id,
        });
        expect(visit.id).toBeTruthy();
        expect(visit.patientId).toBe(patient.id);
    });
    it('Create visit for non-existent patient -> error', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        await expect(service.createVisit({
            patientId: 'missing',
            visitType: 'NEW',
            serviceType: 'OPD',
            registeredById: registrar.id,
        })).rejects.toThrow('Patient not found');
    });
    it('Update visit status -> success', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const patient = await (0, testUtils_1.createPatient)(registrar.id);
        const visit = await service.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            registeredById: registrar.id,
        });
        const updated = await service.updateVisitStatus(visit.id, 'IN_QUEUE');
        expect(updated.status).toBe('IN_QUEUE');
    });
    it('Invalid status transition -> error', async () => {
        await expect(service.updateVisitStatus('any-id', 'BAD_STATUS')).rejects.toThrow('Invalid visit status');
    });
    it('Assign doctor to visit -> success', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const doctor = await (0, testUtils_1.createUser)('DOCTOR');
        const patient = await (0, testUtils_1.createPatient)(registrar.id);
        const visit = await service.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            registeredById: registrar.id,
        });
        const assigned = await service.assignDoctor(visit.id, doctor.id);
        expect(assigned.assignedDoctorId).toBe(doctor.id);
        expect(assigned.status).toBe('IN_QUEUE');
    });
    it('Save SOAP notes -> success', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const doctor = await (0, testUtils_1.createUser)('DOCTOR');
        const patient = await (0, testUtils_1.createPatient)(registrar.id);
        const visit = await service.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            registeredById: registrar.id,
        });
        const result = await service.saveSoapNote(visit.id, doctor.id, {
            patientId: patient.id,
            chiefComplaint: 'Headache',
            subjective: 'Pain for 2 days',
            objective: 'Mild distress',
            assessment: 'Tension headache likely',
            plan: 'Hydration and analgesics',
        });
        expect(result.saved).toBe(true);
    });
});
//# sourceMappingURL=visit.test.js.map