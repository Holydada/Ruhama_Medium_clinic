"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const finance_service_1 = require("../../services/finance.service");
const visit_service_1 = require("../../services/visit.service");
const testUtils_1 = require("./testUtils");
describe('FinanceService integration', () => {
    const service = new finance_service_1.FinanceService();
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
    async function seedBillingContext() {
        const registrar = await (0, testUtils_1.createUser)('RECEPTIONIST');
        const financeUser = await (0, testUtils_1.createUser)('FINANCE');
        const patient = await (0, testUtils_1.createPatient)(registrar.id);
        const visit = await visitService.createVisit({
            patientId: patient.id,
            visitType: 'NEW',
            serviceType: 'OPD',
            registeredById: registrar.id,
        });
        return { registrar, financeUser, patient, visit };
    }
    it('Create transaction -> success', async () => {
        const { financeUser, patient, visit } = await seedBillingContext();
        const txn = await service.createTransaction({
            patientId: patient.id,
            visitId: visit.id,
            transactionType: 'CONSULTATION_FEE',
            amount: 200,
            paymentMethod: 'CASH',
            collectedById: financeUser.id,
        });
        expect(txn.id).toBeTruthy();
        expect(txn.paymentStatus).toBe('PAID');
    });
    it('Generate invoice -> success', async () => {
        const { financeUser, patient, visit } = await seedBillingContext();
        const invoice = await service.createInvoice({
            patientId: patient.id,
            visitId: visit.id,
            issuedById: financeUser.id,
            items: [{ itemType: 'LAB', itemDescription: 'CBC', quantity: 1, unitPrice: 150 }],
        });
        expect(invoice.id).toBeTruthy();
        expect(Number(invoice.totalAmount)).toBe(150);
    });
    it('Record payment -> invoice status updates', async () => {
        const { financeUser, patient } = await seedBillingContext();
        const invoice = await service.createInvoice({
            patientId: patient.id,
            issuedById: financeUser.id,
            items: [{ itemType: 'SERVICE', itemDescription: 'Procedure', quantity: 1, unitPrice: 300 }],
        });
        const updated = await service.payInvoice(invoice.id, 300);
        expect(updated.status).toBe('PAID');
        expect(Number(updated.paidAmount)).toBe(300);
    });
    it('Get daily report -> returns correct totals', async () => {
        const { financeUser, patient, visit } = await seedBillingContext();
        await service.createTransaction({
            patientId: patient.id,
            visitId: visit.id,
            transactionType: 'CARD_FEE',
            amount: 30,
            paymentMethod: 'CASH',
            collectedById: financeUser.id,
        });
        await service.createTransaction({
            patientId: patient.id,
            visitId: visit.id,
            transactionType: 'LAB_FEE',
            amount: 120,
            paymentMethod: 'CASH',
            collectedById: financeUser.id,
        });
        const today = new Date().toISOString().slice(0, 10);
        const report = await service.getDailyRevenue(today);
        expect(report.transactionCount).toBeGreaterThanOrEqual(2);
        expect(report.totalRevenue).toBeGreaterThanOrEqual(150);
    });
});
//# sourceMappingURL=finance.test.js.map