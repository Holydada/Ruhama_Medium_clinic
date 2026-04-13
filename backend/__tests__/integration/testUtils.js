"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextRef = void 0;
exports.resetDb = resetDb;
exports.createUser = createUser;
exports.createPatient = createPatient;
const database_1 = __importDefault(require("../../config/database"));
let seq = 0;
const nextRef = (prefix) => {
    seq += 1;
    return `${prefix}-${Date.now()}-${seq}`;
};
exports.nextRef = nextRef;
async function resetDb() {
    await database_1.default.notification.deleteMany();
    await database_1.default.auditLog.deleteMany();
    await database_1.default.userSession.deleteMany();
    await database_1.default.invoiceItem.deleteMany();
    await database_1.default.invoice.deleteMany();
    await database_1.default.financialTransaction.deleteMany();
    await database_1.default.injectionOrder.deleteMany();
    await database_1.default.ultrasoundOrder.deleteMany();
    await database_1.default.labOrderItem.deleteMany();
    await database_1.default.labOrder.deleteMany();
    await database_1.default.prescriptionItem.deleteMany();
    await database_1.default.prescription.deleteMany();
    await database_1.default.patientVisit.deleteMany();
    await database_1.default.pharmacyStock.deleteMany();
    await database_1.default.drug.deleteMany();
    await database_1.default.labTest.deleteMany();
    await database_1.default.patient.deleteMany();
    await database_1.default.user.deleteMany();
}
async function createUser(role, name = role) {
    const token = (0, exports.nextRef)('verify');
    return database_1.default.user.create({
        data: {
            email: `${(0, exports.nextRef)('u')}@test.local`,
            passwordHash: 'hash',
            fullName: `${name} ${(0, exports.nextRef)('n')}`,
            role,
            isApproved: true,
            isActive: true,
            emailVerified: true,
            emailVerificationToken: token,
        },
    });
}
async function createPatient(registeredById, fullName = 'Test Patient') {
    return database_1.default.patient.create({
        data: {
            cardNumber: (0, exports.nextRef)('RH-CARD'),
            fullName,
            sex: 'MALE',
            dateOfBirth: new Date('1990-01-01'),
            registeredById,
        },
    });
}
//# sourceMappingURL=testUtils.js.map