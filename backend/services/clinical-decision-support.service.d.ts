interface DrugInteraction {
    severity: 'CRITICAL' | 'MAJOR' | 'MODERATE' | 'MINOR';
    description: string;
    recommendation: string;
}
interface AllergyCheck {
    hasAllergy: boolean;
    allergyType: string;
    severity: 'SEVERE' | 'MODERATE' | 'MILD';
    recommendation: string;
}
interface LabValueAssessment {
    isAbnormal: boolean;
    severity: 'CRITICAL' | 'HIGH' | 'LOW' | 'NORMAL';
    referenceRange: string;
    interpretation: string;
    recommendations: string[];
}
export declare class ClinicalDecisionSupportService {
    /**
     * Check for drug interactions
     */
    checkDrugInteractions(patientId: string, newDrugName: string): Promise<DrugInteraction[]>;
    /**
     * Check for drug allergies
     */
    checkDrugAllergy(patientId: string, drugName: string): Promise<AllergyCheck | null>;
    /**
     * Assess lab value abnormality
     */
    assessLabValue(testName: string, value: number, unit: string, patientAge?: number, patientSex?: 'MALE' | 'FEMALE'): LabValueAssessment;
    /**
     * Get clinical guidelines for diagnosis
     */
    getClinicalGuidelines(diagnosis: string): Promise<{
        guidelines: string[];
        recommendedTests: string[];
        recommendedTreatments: string[];
        redFlags: string[];
    }>;
    /**
     * Check for contraindications
     */
    checkContraindications(patientId: string, drugName: string): Promise<string[]>;
    private getKnownInteractions;
    private checkDrugClassAllergy;
    private getLabReferenceRanges;
    private adjustRangeForDemographics;
    private getDiagnosisGuidelines;
    private getDrugContraindications;
}
export declare const clinicalDecisionSupportService: ClinicalDecisionSupportService;
export {};
//# sourceMappingURL=clinical-decision-support.service.d.ts.map