"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicalDecisionSupportService = exports.ClinicalDecisionSupportService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ClinicalDecisionSupportService {
    /**
     * Check for drug interactions
     */
    async checkDrugInteractions(patientId, newDrugName) {
        const interactions = [];
        // Get patient's current medications
        const currentMedications = await prisma.prescription.findMany({
            where: {
                patientId,
                status: {
                    in: ['PENDING', 'DISPENSED', 'PARTIALLY_DISPENSED'],
                },
            },
            include: {
                items: true,
            },
        });
        const activeDrugs = currentMedications.flatMap(rx => rx.items.map(item => item.drugName.toLowerCase()));
        // Check against known interactions database
        const knownInteractions = this.getKnownInteractions();
        const newDrugLower = newDrugName.toLowerCase();
        for (const activeDrug of activeDrugs) {
            const interactionKey = [activeDrug, newDrugLower].sort().join('|');
            const interaction = knownInteractions[interactionKey];
            if (interaction) {
                interactions.push(interaction);
            }
        }
        return interactions;
    }
    /**
     * Check for drug allergies
     */
    async checkDrugAllergy(patientId, drugName) {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            select: {
                allergies: true,
                hasAllergies: true,
                allergyDetails: true,
            },
        });
        if (!patient || !patient.hasAllergies || !patient.allergies) {
            return null;
        }
        const allergies = patient.allergies.toLowerCase();
        const drugLower = drugName.toLowerCase();
        // Check for direct drug name match
        if (allergies.includes(drugLower)) {
            return {
                hasAllergy: true,
                allergyType: drugName,
                severity: 'SEVERE',
                recommendation: `CONTRAINDICATED: Patient has documented allergy to ${drugName}. DO NOT PRESCRIBE.`,
            };
        }
        // Check for drug class allergies
        const drugClassAllergies = this.checkDrugClassAllergy(drugLower, allergies);
        if (drugClassAllergies) {
            return drugClassAllergies;
        }
        return null;
    }
    /**
     * Assess lab value abnormality
     */
    assessLabValue(testName, value, unit, patientAge, patientSex) {
        const referenceRanges = this.getLabReferenceRanges();
        const testKey = testName.toLowerCase();
        const range = referenceRanges[testKey];
        if (!range) {
            return {
                isAbnormal: false,
                severity: 'NORMAL',
                referenceRange: 'Not available',
                interpretation: 'Reference range not defined',
                recommendations: [],
            };
        }
        // Adjust for age/sex if needed
        const adjustedRange = this.adjustRangeForDemographics(range, patientAge, patientSex);
        // Assess the value
        if (value < adjustedRange.min) {
            const percentBelow = ((adjustedRange.min - value) / adjustedRange.min) * 100;
            return {
                isAbnormal: true,
                severity: percentBelow > 50 ? 'CRITICAL' : percentBelow > 25 ? 'HIGH' : 'LOW',
                referenceRange: `${adjustedRange.min}-${adjustedRange.max} ${unit}`,
                interpretation: `Below normal range (${value} ${unit})`,
                recommendations: adjustedRange.lowRecommendations || [],
            };
        }
        else if (value > adjustedRange.max) {
            const percentAbove = ((value - adjustedRange.max) / adjustedRange.max) * 100;
            return {
                isAbnormal: true,
                severity: percentAbove > 50 ? 'CRITICAL' : percentAbove > 25 ? 'HIGH' : 'LOW',
                referenceRange: `${adjustedRange.min}-${adjustedRange.max} ${unit}`,
                interpretation: `Above normal range (${value} ${unit})`,
                recommendations: adjustedRange.highRecommendations || [],
            };
        }
        return {
            isAbnormal: false,
            severity: 'NORMAL',
            referenceRange: `${adjustedRange.min}-${adjustedRange.max} ${unit}`,
            interpretation: 'Within normal range',
            recommendations: [],
        };
    }
    /**
     * Get clinical guidelines for diagnosis
     */
    async getClinicalGuidelines(diagnosis) {
        const guidelines = this.getDiagnosisGuidelines();
        const diagnosisKey = diagnosis.toLowerCase();
        return guidelines[diagnosisKey] || {
            guidelines: [],
            recommendedTests: [],
            recommendedTreatments: [],
            redFlags: [],
        };
    }
    /**
     * Check for contraindications
     */
    async checkContraindications(patientId, drugName) {
        const contraindications = [];
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            select: {
                hasDiabetes: true,
                hasHypertension: true,
                hasAsthma: true,
                hasHeartDisease: true,
                hasKidneyDisease: true,
                hasEpilepsy: true,
                chronicIllnesses: true,
            },
        });
        if (!patient)
            return contraindications;
        const drugLower = drugName.toLowerCase();
        const drugContraindications = this.getDrugContraindications();
        // Check each condition
        if (patient.hasDiabetes && drugContraindications.diabetes?.includes(drugLower)) {
            contraindications.push('Caution: Patient has diabetes. Monitor blood glucose closely.');
        }
        if (patient.hasHypertension && drugContraindications.hypertension?.includes(drugLower)) {
            contraindications.push('Caution: Patient has hypertension. Monitor blood pressure.');
        }
        if (patient.hasAsthma && drugContraindications.asthma?.includes(drugLower)) {
            contraindications.push('WARNING: May trigger asthma exacerbation. Consider alternative.');
        }
        if (patient.hasHeartDisease && drugContraindications.heartDisease?.includes(drugLower)) {
            contraindications.push('WARNING: Contraindicated in heart disease. Consult cardiologist.');
        }
        if (patient.hasKidneyDisease && drugContraindications.kidneyDisease?.includes(drugLower)) {
            contraindications.push('WARNING: Adjust dose for renal impairment. Check kidney function.');
        }
        return contraindications;
    }
    // ============================================
    // PRIVATE HELPER METHODS
    // ============================================
    getKnownInteractions() {
        return {
            'warfarin|aspirin': {
                severity: 'CRITICAL',
                description: 'Increased risk of bleeding',
                recommendation: 'Avoid combination. If necessary, monitor INR closely and watch for bleeding.',
            },
            'metformin|contrast': {
                severity: 'MAJOR',
                description: 'Risk of lactic acidosis',
                recommendation: 'Hold metformin 48 hours before and after contrast administration.',
            },
            'digoxin|furosemide': {
                severity: 'MAJOR',
                description: 'Increased risk of digoxin toxicity due to hypokalemia',
                recommendation: 'Monitor potassium levels and digoxin levels regularly.',
            },
            'ace inhibitor|nsaid': {
                severity: 'MODERATE',
                description: 'Reduced antihypertensive effect, increased risk of renal impairment',
                recommendation: 'Monitor blood pressure and renal function.',
            },
            'ssri|nsaid': {
                severity: 'MODERATE',
                description: 'Increased risk of GI bleeding',
                recommendation: 'Consider gastroprotection with PPI.',
            },
        };
    }
    checkDrugClassAllergy(drug, allergies) {
        // Penicillin class
        if ((drug.includes('cillin') || drug.includes('penicillin')) &&
            (allergies.includes('penicillin') || allergies.includes('cillin'))) {
            return {
                hasAllergy: true,
                allergyType: 'Penicillin class',
                severity: 'SEVERE',
                recommendation: 'CONTRAINDICATED: Patient allergic to penicillin class. Use alternative antibiotic.',
            };
        }
        // Sulfa drugs
        if (drug.includes('sulfa') && allergies.includes('sulfa')) {
            return {
                hasAllergy: true,
                allergyType: 'Sulfonamide class',
                severity: 'SEVERE',
                recommendation: 'CONTRAINDICATED: Patient allergic to sulfa drugs. Avoid all sulfonamides.',
            };
        }
        // NSAIDs
        if ((drug.includes('ibuprofen') || drug.includes('diclofenac') || drug.includes('nsaid')) &&
            (allergies.includes('nsaid') || allergies.includes('ibuprofen') || allergies.includes('aspirin'))) {
            return {
                hasAllergy: true,
                allergyType: 'NSAID class',
                severity: 'MODERATE',
                recommendation: 'Caution: Patient may be allergic to NSAIDs. Consider alternative pain management.',
            };
        }
        return null;
    }
    getLabReferenceRanges() {
        return {
            'hemoglobin': {
                min: 12,
                max: 16,
                unit: 'g/dL',
                lowRecommendations: ['Check for anemia', 'Consider iron supplementation', 'Rule out bleeding'],
                highRecommendations: ['Check for dehydration', 'Rule out polycythemia'],
            },
            'wbc': {
                min: 4000,
                max: 11000,
                unit: 'cells/μL',
                lowRecommendations: ['Rule out infection', 'Check for bone marrow suppression'],
                highRecommendations: ['Rule out infection', 'Consider inflammatory process'],
            },
            'glucose': {
                min: 70,
                max: 100,
                unit: 'mg/dL',
                lowRecommendations: ['Risk of hypoglycemia', 'Adjust diabetes medications'],
                highRecommendations: ['Screen for diabetes', 'Lifestyle modifications', 'Consider medication'],
            },
            'creatinine': {
                min: 0.6,
                max: 1.2,
                unit: 'mg/dL',
                lowRecommendations: ['Usually not clinically significant'],
                highRecommendations: ['Assess renal function', 'Adjust medication doses', 'Nephrology referral if severe'],
            },
            'alt': {
                min: 7,
                max: 56,
                unit: 'U/L',
                lowRecommendations: ['Usually not clinically significant'],
                highRecommendations: ['Assess liver function', 'Rule out hepatitis', 'Review medications'],
            },
        };
    }
    adjustRangeForDemographics(range, age, sex) {
        // Simple adjustment - in production, this would be more sophisticated
        if (sex === 'FEMALE' && range.unit === 'g/dL') {
            return { ...range, min: range.min - 1, max: range.max - 1 };
        }
        return range;
    }
    getDiagnosisGuidelines() {
        return {
            'hypertension': {
                guidelines: [
                    'Lifestyle modifications: diet, exercise, weight loss',
                    'Target BP < 140/90 mmHg (< 130/80 for diabetes/CKD)',
                    'Start with ACE inhibitor or ARB for most patients',
                ],
                recommendedTests: ['Basic metabolic panel', 'Lipid panel', 'ECG', 'Urinalysis'],
                recommendedTreatments: ['ACE inhibitor', 'Calcium channel blocker', 'Thiazide diuretic'],
                redFlags: ['BP > 180/120', 'Chest pain', 'Shortness of breath', 'Altered mental status'],
            },
            'diabetes': {
                guidelines: [
                    'Target HbA1c < 7% for most patients',
                    'Lifestyle modifications first-line',
                    'Metformin as first-line medication',
                ],
                recommendedTests: ['HbA1c', 'Fasting glucose', 'Lipid panel', 'Kidney function', 'Urine microalbumin'],
                recommendedTreatments: ['Metformin', 'Lifestyle modifications', 'Patient education'],
                redFlags: ['Glucose > 400', 'DKA symptoms', 'Severe hypoglycemia', 'Foot ulcers'],
            },
            'pneumonia': {
                guidelines: [
                    'Assess severity with CURB-65 score',
                    'Chest X-ray for diagnosis',
                    'Empiric antibiotics based on severity',
                ],
                recommendedTests: ['Chest X-ray', 'CBC', 'CRP', 'Blood culture if severe'],
                recommendedTreatments: ['Amoxicillin', 'Azithromycin', 'Supportive care'],
                redFlags: ['Respiratory distress', 'Hypoxia', 'Altered mental status', 'Sepsis'],
            },
        };
    }
    getDrugContraindications() {
        return {
            diabetes: ['steroid', 'prednisone', 'dexamethasone'],
            hypertension: ['nsaid', 'pseudoephedrine', 'decongestant'],
            asthma: ['beta blocker', 'propranolol', 'aspirin', 'nsaid'],
            heartDisease: ['nsaid', 'cox-2 inhibitor'],
            kidneyDisease: ['nsaid', 'metformin', 'contrast'],
        };
    }
}
exports.ClinicalDecisionSupportService = ClinicalDecisionSupportService;
exports.clinicalDecisionSupportService = new ClinicalDecisionSupportService();
//# sourceMappingURL=clinical-decision-support.service.js.map