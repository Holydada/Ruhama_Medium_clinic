"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRules = exports.BusinessRulesService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BusinessRulesService {
    rules = new Map();
    constructor() {
        this.initializeRules();
    }
    initializeRules() {
        // Patient registration rules
        this.addRule('patient.create', {
            name: 'duplicate_patient_check',
            description: 'Prevent duplicate patient registration',
            condition: async (data) => {
                const existing = await prisma.patient.findFirst({
                    where: {
                        OR: [
                            { cardNumber: data.cardNumber },
                            {
                                AND: [
                                    { fullName: data.fullName },
                                    { dateOfBirth: data.dateOfBirth },
                                ],
                            },
                        ],
                    },
                });
                return !existing;
            },
            action: 'BLOCK',
            message: 'Patient with same card number or name/DOB already exists',
        });
        this.addRule('patient.create', {
            name: 'age_validation',
            description: 'Validate patient age is reasonable',
            condition: (data) => {
                const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
                return age >= 0 && age <= 150;
            },
            action: 'BLOCK',
            message: 'Patient age must be between 0 and 150 years',
        });
        // Prescription rules
        this.addRule('prescription.create', {
            name: 'allergy_check',
            description: 'Check for drug allergies',
            condition: async (data) => {
                const patient = await prisma.patient.findUnique({
                    where: { id: data.patientId },
                    select: { allergies: true, hasAllergies: true },
                });
                if (!patient?.hasAllergies || !patient.allergies)
                    return true;
                const allergies = patient.allergies.toLowerCase();
                return !data.items.some((item) => allergies.includes(item.drugName.toLowerCase()));
            },
            action: 'BLOCK',
            message: 'Patient is allergic to one or more prescribed medications',
        });
        this.addRule('prescription.create', {
            name: 'dosage_validation',
            description: 'Validate medication dosages',
            condition: (data) => {
                return data.items.every((item) => {
                    const dosage = parseFloat(item.dosage);
                    return !isNaN(dosage) && dosage > 0 && dosage <= 10000;
                });
            },
            action: 'BLOCK',
            message: 'Invalid medication dosage detected',
        });
        // Lab order rules
        this.addRule('lab_order.create', {
            name: 'duplicate_test_check',
            description: 'Prevent duplicate tests within 24 hours',
            condition: async (data) => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const recentOrders = await prisma.labOrder.findMany({
                    where: {
                        patientId: data.patientId,
                        createdAt: { gte: yesterday },
                    },
                    include: { items: true },
                });
                const recentTests = recentOrders.flatMap(order => order.items.map(item => item.testName));
                return !data.testIds.some((testId) => recentTests.includes(testId));
            },
            action: 'WARN',
            message: 'Some tests were ordered within the last 24 hours',
        });
        // Financial rules
        this.addRule('payment.create', {
            name: 'payment_amount_validation',
            description: 'Validate payment amount',
            condition: (data) => {
                return data.amount > 0 && data.amount <= 1000000;
            },
            action: 'BLOCK',
            message: 'Payment amount must be between 0 and 1,000,000 ETB',
        });
        this.addRule('payment.create', {
            name: 'overpayment_check',
            description: 'Prevent overpayment',
            condition: async (data, context) => {
                if (!context?.outstandingAmount)
                    return true;
                return data.amount <= context.outstandingAmount * 1.1;
            },
            action: 'WARN',
            message: 'Payment amount exceeds outstanding balance',
        });
        // Emergency rules
        this.addRule('emergency.triage', {
            name: 'critical_vitals_check',
            description: 'Flag critical vital signs',
            condition: (data) => {
                const { systolicBP, heartRate, temperature, oxygenSaturation } = data;
                return !(systolicBP < 70 || systolicBP > 200 ||
                    heartRate < 40 || heartRate > 150 ||
                    temperature < 35 || temperature > 40 ||
                    oxygenSaturation < 85);
            },
            action: 'WARN',
            message: 'Critical vital signs detected - immediate attention required',
        });
        // Inventory rules
        this.addRule('inventory.dispense', {
            name: 'expiry_check',
            description: 'Prevent dispensing expired items',
            condition: async (data) => {
                const item = await prisma.inventoryItem.findUnique({
                    where: { id: data.inventoryItemId },
                });
                if (!item)
                    return false;
                return item.expiryDate > new Date();
            },
            action: 'BLOCK',
            message: 'Cannot dispense expired medication',
        });
        this.addRule('inventory.dispense', {
            name: 'near_expiry_warning',
            description: 'Warn about near-expiry items',
            condition: async (data) => {
                const item = await prisma.inventoryItem.findUnique({
                    where: { id: data.inventoryItemId },
                });
                if (!item)
                    return true;
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                return item.expiryDate > thirtyDaysFromNow;
            },
            action: 'WARN',
            message: 'Item expires within 30 days',
        });
    }
    addRule(context, rule) {
        if (!this.rules.has(context)) {
            this.rules.set(context, []);
        }
        this.rules.get(context).push(rule);
    }
    async validateBusinessRules(context, data, additionalContext) {
        const rules = this.rules.get(context) || [];
        const errors = [];
        const warnings = [];
        for (const rule of rules) {
            try {
                const isValid = await rule.condition(data, additionalContext);
                if (!isValid) {
                    switch (rule.action) {
                        case 'BLOCK':
                            errors.push(rule.message);
                            break;
                        case 'WARN':
                            warnings.push(rule.message);
                            break;
                        case 'LOG':
                            console.warn(`[BUSINESS RULE] ${rule.name}: ${rule.message}`);
                            break;
                    }
                }
            }
            catch (error) {
                console.error(`Error evaluating rule ${rule.name}:`, error);
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
    validatePatientData(data) {
        const errors = [];
        if (!data.fullName?.trim())
            errors.push('Full name is required');
        if (!data.dateOfBirth)
            errors.push('Date of birth is required');
        if (!data.sex)
            errors.push('Sex is required');
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Invalid email format');
        }
        if (data.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(data.phone)) {
            errors.push('Invalid phone number format');
        }
        if (data.dateOfBirth) {
            const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
            if (age < 0 || age > 150) {
                errors.push('Invalid age');
            }
        }
        return { valid: errors.length === 0, errors };
    }
    validateVitalSigns(data) {
        const errors = [];
        const warnings = [];
        if (data.systolicBP) {
            if (data.systolicBP < 50 || data.systolicBP > 250) {
                errors.push('Systolic BP out of valid range (50-250)');
            }
            else if (data.systolicBP < 90 || data.systolicBP > 180) {
                warnings.push('Abnormal systolic BP detected');
            }
        }
        if (data.diastolicBP) {
            if (data.diastolicBP < 30 || data.diastolicBP > 150) {
                errors.push('Diastolic BP out of valid range (30-150)');
            }
            else if (data.diastolicBP < 60 || data.diastolicBP > 100) {
                warnings.push('Abnormal diastolic BP detected');
            }
        }
        if (data.heartRate) {
            if (data.heartRate < 20 || data.heartRate > 250) {
                errors.push('Heart rate out of valid range (20-250)');
            }
            else if (data.heartRate < 60 || data.heartRate > 100) {
                warnings.push('Abnormal heart rate detected');
            }
        }
        if (data.temperature) {
            if (data.temperature < 30 || data.temperature > 45) {
                errors.push('Temperature out of valid range (30-45°C)');
            }
            else if (data.temperature < 36 || data.temperature > 38) {
                warnings.push('Abnormal temperature detected');
            }
        }
        if (data.oxygenSaturation) {
            if (data.oxygenSaturation < 50 || data.oxygenSaturation > 100) {
                errors.push('Oxygen saturation out of valid range (50-100%)');
            }
            else if (data.oxygenSaturation < 95) {
                warnings.push('Low oxygen saturation detected');
            }
        }
        return { valid: errors.length === 0, errors, warnings };
    }
}
exports.BusinessRulesService = BusinessRulesService;
exports.businessRules = new BusinessRulesService();
//# sourceMappingURL=business-rules.service.js.map