"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const pharmacy_service_1 = require("../../services/pharmacy.service");
const testUtils_1 = require("./testUtils");
describe('PharmacyService integration', () => {
    const service = new pharmacy_service_1.PharmacyService();
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
    it('Create drug -> success', async () => {
        const drug = await service.createDrug({ drugName: 'Paracetamol' });
        expect(drug.id).toBeTruthy();
        expect(drug.drugName).toBe('Paracetamol');
    });
    it('Add stock -> quantity increases', async () => {
        const drug = await service.createDrug({ drugName: 'Amoxicillin' });
        const stock = await service.addStock({
            drugId: drug.id,
            batchNumber: 'B-1',
            quantityInStock: 50,
            unitPrice: 10,
            sellingPrice: 12,
            expiryDate: '2099-01-01',
        });
        expect(stock.quantityInStock).toBe(50);
    });
    it('Dispense medication -> stock decreases', async () => {
        const drug = await service.createDrug({ drugName: 'Ibuprofen' });
        const stock = await service.addStock({
            drugId: drug.id,
            batchNumber: 'B-2',
            quantityInStock: 20,
            unitPrice: 5,
            sellingPrice: 7,
            expiryDate: '2099-01-01',
        });
        const dispensed = await service.dispenseStock({ stockId: stock.id, quantity: 3 });
        expect(dispensed.quantityInStock).toBe(17);
    });
    it('Dispense more than available -> error', async () => {
        const drug = await service.createDrug({ drugName: 'Azithromycin' });
        const stock = await service.addStock({
            drugId: drug.id,
            batchNumber: 'B-3',
            quantityInStock: 2,
            unitPrice: 20,
            sellingPrice: 25,
            expiryDate: '2099-01-01',
        });
        await expect(service.dispenseStock({ stockId: stock.id, quantity: 5 })).rejects.toThrow('Insufficient stock');
    });
    it('Get low stock alerts -> returns items below reorder level', async () => {
        const drug = await service.createDrug({ drugName: 'Metformin' });
        await service.addStock({
            drugId: drug.id,
            batchNumber: 'B-4',
            quantityInStock: 3,
            unitPrice: 4,
            sellingPrice: 5,
            expiryDate: '2099-01-01',
            reorderLevel: 10,
        });
        const alerts = await service.getLowStockAlerts();
        expect(alerts.length).toBe(1);
        expect(alerts[0].quantityInStock).toBeLessThanOrEqual(alerts[0].reorderLevel);
    });
});
//# sourceMappingURL=pharmacy.test.js.map