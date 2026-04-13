"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const prescription_service_1 = require("../../services/prescription.service");
const visit_service_1 = require("../../services/visit.service");
const testUtils_1 = require("./testUtils");
describe('PrescriptionService integration', () => {
    const service = new prescription_service_1.PrescriptionService();
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
    async function seedVisit() {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const doctor = await (0, testUtils_1.createUser)('DOCTOR');
        const pharmacist = await (0, testUtils_1.createUser)('PHARMACIST');
        const patient = await (0, testUtils_1.createPatient)(registrar.id);
        const visit = await visitService.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            assignedDoctorId: doctor.id,
            registeredById: registrar.id,
        });
        return { patient, doctor, pharmacist, visit };
    }
    it('Create prescription -> success', async () => {
        const { patient, doctor, visit } = await seedVisit();
        const created = await service.createPrescription({
            visitId: visit.id,
            patientId: patient.id,
            doctorId: doctor.id,
            items: [{ drugName: 'Paracetamol', dosage: '500mg', frequency: 'BID', duration: '5 days', quantity: 10 }],
        });
        expect(created.id).toBeTruthy();
        expect(created.status).toBe('PENDING');
    });
    it('Dispense prescription -> status changes to DISPENSED', async () => {
        const { patient, doctor, pharmacist, visit } = await seedVisit();
        const created = await service.createPrescription({
            visitId: visit.id,
            patientId: patient.id,
            doctorId: doctor.id,
            items: [{ drugName: 'Amoxicillin', dosage: '250mg', frequency: 'TID', duration: '7 days', quantity: 21 }],
        });
        const dispensed = await service.dispensePrescription(created.id, pharmacist.id);
        expect(dispensed.status).toBe('DISPENSED');
    });
    it('Dispense already dispensed -> error', async () => {
        const { patient, doctor, pharmacist, visit } = await seedVisit();
        const created = await service.createPrescription({
            visitId: visit.id,
            patientId: patient.id,
            doctorId: doctor.id,
            items: [{ drugName: 'Ibuprofen', dosage: '400mg', frequency: 'BID', duration: '3 days', quantity: 6 }],
        });
        await service.dispensePrescription(created.id, pharmacist.id);
        await expect(service.dispensePrescription(created.id, pharmacist.id)).rejects.toThrow('Only pending prescriptions can be dispensed');
    });
    it('Cancel prescription -> status changes to CANCELLED', async () => {
        const { patient, doctor, visit } = await seedVisit();
        const created = await service.createPrescription({
            visitId: visit.id,
            patientId: patient.id,
            doctorId: doctor.id,
            items: [{ drugName: 'Cetirizine', dosage: '10mg', frequency: 'OD', duration: '5 days', quantity: 5 }],
        });
        const cancelled = await service.cancelPrescription(created.id);
        expect(cancelled.status).toBe('CANCELLED');
    });
    it('Get prescription queue -> returns pending prescriptions', async () => {
        const { patient, doctor, visit } = await seedVisit();
        await service.createPrescription({
            visitId: visit.id,
            patientId: patient.id,
            doctorId: doctor.id,
            items: [{ drugName: 'Vitamin C', dosage: '500mg', frequency: 'OD', duration: '10 days', quantity: 10 }],
        });
        const queue = await service.getPrescriptionQueue({ limit: 10 });
        expect(queue.length).toBe(1);
        expect(queue[0].status).toBe('PENDING');
    });
});
//# sourceMappingURL=prescription.test.js.map