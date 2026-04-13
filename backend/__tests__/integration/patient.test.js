"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const patient_service_1 = require("../../services/patient.service");
const visit_service_1 = require("../../services/visit.service");
const testUtils_1 = require("./testUtils");
describe('PatientService integration', () => {
    const service = new patient_service_1.PatientService();
    const visitService = new visit_service_1.VisitService();
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
    it('Create patient with valid data -> success', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const patient = await service.createPatient({ fullName: 'John Doe', sex: 'MALE', dateOfBirth: '1992-02-02' }, registrar.id);
        expect(patient.id).toBeTruthy();
        expect(patient.fullName).toBe('John Doe');
        expect(patient.registeredBy.id).toBe(registrar.id);
    });
    it('Create patient with missing required fields -> error', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        await expect(service.createPatient({ sex: 'MALE', dateOfBirth: '1992-02-02' }, registrar.id)).rejects.toThrow('fullName is required');
    });
    it('Get patient by ID -> returns patient', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const created = await (0, testUtils_1.createPatient)(registrar.id, 'Jane Smith');
        const found = await service.getPatientById(created.id);
        expect(found.id).toBe(created.id);
        expect(found.fullName).toBe('Jane Smith');
    });
    it('Get non-existent patient -> 404 error', async () => {
        await expect(service.getPatientById('missing-id')).rejects.toThrow('Patient not found');
    });
    it('Update patient -> success', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const created = await (0, testUtils_1.createPatient)(registrar.id, 'Old Name');
        const updated = await service.updatePatient(created.id, { fullName: 'New Name', phone: '0911000000' });
        expect(updated.fullName).toBe('New Name');
        expect(updated.phone).toBe('0911000000');
    });
    it('Search patients -> returns filtered results', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        await (0, testUtils_1.createPatient)(registrar.id, 'Filter Me');
        await (0, testUtils_1.createPatient)(registrar.id, 'Another Person');
        const result = await service.getPatients({ search: 'Filter', page: 1, limit: 10 });
        expect(result.patients.length).toBe(1);
        expect(result.patients[0].fullName).toContain('Filter');
    });
    it('Get patient history -> returns visits', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const doctor = await (0, testUtils_1.createUser)('DOCTOR');
        const patient = await (0, testUtils_1.createPatient)(registrar.id, 'History User');
        await visitService.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            assignedDoctorId: doctor.id,
            registeredById: registrar.id,
        });
        const history = await service.getPatientHistory(patient.id);
        expect(history.visits.length).toBeGreaterThan(0);
        expect(history.visits[0].patientId).toBe(patient.id);
    });
});
//# sourceMappingURL=patient.test.js.map