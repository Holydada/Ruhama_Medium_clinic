"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const lab_service_1 = require("../../services/lab.service");
const visit_service_1 = require("../../services/visit.service");
const testUtils_1 = require("./testUtils");
describe('LabService integration', () => {
    const service = new lab_service_1.LabService();
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
    async function seedLabOrder() {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const doctor = await (0, testUtils_1.createUser)('DOCTOR');
        const labTech = await (0, testUtils_1.createUser)('LAB_TECH');
        const patient = await (0, testUtils_1.createPatient)(registrar.id);
        const visit = await visitService.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            registeredById: registrar.id,
            assignedDoctorId: doctor.id,
        });
        const labTest = await service.createLabTest({ testCode: 'CBC', testName: 'Complete Blood Count', price: 150 });
        const order = await service.createLabOrder({
            visitId: visit.id,
            patientId: patient.id,
            orderedById: doctor.id,
            tests: [{ testId: labTest.id, testName: labTest.testName }],
        });
        return { order, labTech };
    }
    it('Create lab order -> success', async () => {
        const { order } = await seedLabOrder();
        expect(order.id).toBeTruthy();
        expect(order.items.length).toBe(1);
    });
    it('Update order status -> success', async () => {
        const { order } = await seedLabOrder();
        const updated = await service.updateLabOrderStatus(order.id, 'IN_PROGRESS');
        expect(updated.status).toBe('IN_PROGRESS');
    });
    it('Enter lab results -> success', async () => {
        const { order } = await seedLabOrder();
        const item = order.items[0];
        const updatedItem = await service.updateLabResult(item.id, { result: 'Normal', notes: 'No issues' });
        expect(updatedItem.result).toBe('Normal');
        expect(updatedItem.status).toBe('COMPLETED');
    });
    it('Verify results -> status changes to VERIFIED', async () => {
        const { order, labTech } = await seedLabOrder();
        const item = order.items[0];
        await service.updateLabResult(item.id, { result: 'All good' });
        const verified = await service.verifyLabOrder(order.id, labTech.id);
        expect(verified.status).toBe('VERIFIED');
    });
    it('Cannot verify when no results entered -> error', async () => {
        const { order, labTech } = await seedLabOrder();
        await expect(service.verifyLabOrder(order.id, labTech.id)).rejects.toThrow('Enter at least one test result before releasing results to the doctor');
    });
    it('Verify with only one result on multi-line order -> success', async () => {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const doctor = await (0, testUtils_1.createUser)('DOCTOR');
        const labTech = await (0, testUtils_1.createUser)('LAB_TECH');
        const patient = await (0, testUtils_1.createPatient)(registrar.id);
        const visit = await visitService.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            registeredById: registrar.id,
            assignedDoctorId: doctor.id,
        });
        const t1 = await service.createLabTest({ testCode: 'A', testName: 'Test A', price: 1 });
        const t2 = await service.createLabTest({ testCode: 'B', testName: 'Test B', price: 1 });
        const order = await service.createLabOrder({
            visitId: visit.id,
            patientId: patient.id,
            orderedById: doctor.id,
            tests: [
                { testId: t1.id, testName: t1.testName },
                { testId: t2.id, testName: t2.testName },
            ],
        });
        const firstItem = order.items[0];
        await service.updateLabResult(firstItem.id, { result: '12.0' });
        const verified = await service.verifyLabOrder(order.id, labTech.id);
        expect(verified.status).toBe('VERIFIED');
        expect(verified.items.some((i) => !i.result?.trim())).toBe(true);
    });
});
//# sourceMappingURL=lab.test.js.map