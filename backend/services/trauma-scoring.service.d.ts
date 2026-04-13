export declare class TraumaScoringService {
    /**
     * Calculate Glasgow Coma Scale (GCS)
     */
    calculateGCS(eyeOpening: number, verbalResponse: number, motorResponse: number): {
        score: number;
        severity: 'SEVERE' | 'MODERATE' | 'MILD';
        interpretation: string;
    };
    /**
     * Calculate Revised Trauma Score (RTS)
     */
    calculateRTS(glasgowComaScale: number, systolicBP: number, respiratoryRate: number): {
        score: number;
        survival: string;
    };
    /**
     * Calculate Pediatric Trauma Score
     */
    calculatePediatricTraumaScore(params: {
        weight: number;
        airway: 'NORMAL' | 'MAINTAINABLE' | 'UNMAINTAINABLE';
        systolicBP: number;
        consciousness: 'AWAKE' | 'OBTUNDED' | 'COMA';
        wounds: 'NONE' | 'MINOR' | 'MAJOR';
        fractures: 'NONE' | 'CLOSED' | 'OPEN_MULTIPLE';
    }): {
        score: number;
        severity: 'CRITICAL' | 'SERIOUS' | 'STABLE';
        recommendation: string;
    };
    /**
     * Assess trauma severity and provide recommendations
     */
    assessTrauma(params: {
        gcs: number;
        systolicBP: number;
        respiratoryRate: number;
        heartRate: number;
        oxygenSaturation: number;
        injuries: string[];
    }): {
        gcsAssessment: any;
        rtsAssessment: any;
        overallSeverity: 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'MILD';
        immediateActions: string[];
        disposition: string;
    };
}
export declare const traumaScoringService: TraumaScoringService;
//# sourceMappingURL=trauma-scoring.service.d.ts.map