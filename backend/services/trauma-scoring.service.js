"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traumaScoringService = exports.TraumaScoringService = void 0;
class TraumaScoringService {
    /**
     * Calculate Glasgow Coma Scale (GCS)
     */
    calculateGCS(eyeOpening, verbalResponse, motorResponse) {
        const score = eyeOpening + verbalResponse + motorResponse;
        let severity;
        let interpretation;
        if (score <= 8) {
            severity = 'SEVERE';
            interpretation = 'Severe brain injury - Immediate intubation required';
        }
        else if (score <= 12) {
            severity = 'MODERATE';
            interpretation = 'Moderate brain injury - Close monitoring required';
        }
        else {
            severity = 'MILD';
            interpretation = 'Mild brain injury - Observation required';
        }
        return { score, severity, interpretation };
    }
    /**
     * Calculate Revised Trauma Score (RTS)
     */
    calculateRTS(glasgowComaScale, systolicBP, respiratoryRate) {
        // GCS component
        let gcsValue = 0;
        if (glasgowComaScale >= 13)
            gcsValue = 4;
        else if (glasgowComaScale >= 9)
            gcsValue = 3;
        else if (glasgowComaScale >= 6)
            gcsValue = 2;
        else if (glasgowComaScale >= 4)
            gcsValue = 1;
        // Systolic BP component
        let bpValue = 0;
        if (systolicBP >= 90)
            bpValue = 4;
        else if (systolicBP >= 76)
            bpValue = 3;
        else if (systolicBP >= 50)
            bpValue = 2;
        else if (systolicBP >= 1)
            bpValue = 1;
        // Respiratory Rate component
        let rrValue = 0;
        if (respiratoryRate >= 10 && respiratoryRate <= 29)
            rrValue = 4;
        else if (respiratoryRate > 29)
            rrValue = 3;
        else if (respiratoryRate >= 6)
            rrValue = 2;
        else if (respiratoryRate >= 1)
            rrValue = 1;
        const score = (0.9368 * gcsValue) + (0.7326 * bpValue) + (0.2908 * rrValue);
        let survival;
        if (score >= 7)
            survival = '>95% survival probability';
        else if (score >= 5)
            survival = '75-95% survival probability';
        else if (score >= 3)
            survival = '50-75% survival probability';
        else
            survival = '<50% survival probability - Critical';
        return { score: Math.round(score * 100) / 100, survival };
    }
    /**
     * Calculate Pediatric Trauma Score
     */
    calculatePediatricTraumaScore(params) {
        let score = 0;
        // Weight
        if (params.weight > 20)
            score += 2;
        else if (params.weight >= 10)
            score += 1;
        else
            score -= 1;
        // Airway
        if (params.airway === 'NORMAL')
            score += 2;
        else if (params.airway === 'MAINTAINABLE')
            score += 1;
        else
            score -= 1;
        // Systolic BP
        if (params.systolicBP > 90)
            score += 2;
        else if (params.systolicBP >= 50)
            score += 1;
        else
            score -= 1;
        // Consciousness
        if (params.consciousness === 'AWAKE')
            score += 2;
        else if (params.consciousness === 'OBTUNDED')
            score += 1;
        else
            score -= 1;
        // Wounds
        if (params.wounds === 'NONE')
            score += 2;
        else if (params.wounds === 'MINOR')
            score += 1;
        else
            score -= 1;
        // Fractures
        if (params.fractures === 'NONE')
            score += 2;
        else if (params.fractures === 'CLOSED')
            score += 1;
        else
            score -= 1;
        let severity;
        let recommendation;
        if (score <= 0) {
            severity = 'CRITICAL';
            recommendation = 'Immediate transfer to pediatric trauma center';
        }
        else if (score <= 8) {
            severity = 'SERIOUS';
            recommendation = 'Consider transfer to trauma center';
        }
        else {
            severity = 'STABLE';
            recommendation = 'Can be managed at current facility';
        }
        return { score, severity, recommendation };
    }
    /**
     * Assess trauma severity and provide recommendations
     */
    assessTrauma(params) {
        const gcsAssessment = this.calculateGCS(Math.floor(params.gcs / 3), Math.floor(params.gcs / 3), params.gcs - 2 * Math.floor(params.gcs / 3));
        const rtsAssessment = this.calculateRTS(params.gcs, params.systolicBP, params.respiratoryRate);
        const immediateActions = [];
        let overallSeverity = 'MILD';
        // Critical indicators
        if (params.gcs <= 8) {
            immediateActions.push('IMMEDIATE INTUBATION REQUIRED');
            overallSeverity = 'CRITICAL';
        }
        if (params.systolicBP < 90) {
            immediateActions.push('START FLUID RESUSCITATION');
            overallSeverity = 'CRITICAL';
        }
        if (params.oxygenSaturation < 90) {
            immediateActions.push('SUPPLEMENTAL OXYGEN - HIGH FLOW');
            if (overallSeverity !== 'CRITICAL')
                overallSeverity = 'SEVERE';
        }
        if (params.heartRate > 120 || params.heartRate < 50) {
            immediateActions.push('CARDIAC MONITORING - ASSESS FOR SHOCK');
            if (overallSeverity === 'MILD')
                overallSeverity = 'MODERATE';
        }
        // Disposition
        let disposition;
        if (overallSeverity === 'CRITICAL') {
            disposition = 'IMMEDIATE RESUSCITATION - Consider transfer to trauma center';
        }
        else if (overallSeverity === 'SEVERE') {
            disposition = 'URGENT CARE - ICU admission likely required';
        }
        else if (overallSeverity === 'MODERATE') {
            disposition = 'OBSERVATION - Monitor closely for deterioration';
        }
        else {
            disposition = 'STABLE - Routine care and observation';
        }
        return {
            gcsAssessment,
            rtsAssessment,
            overallSeverity,
            immediateActions,
            disposition,
        };
    }
}
exports.TraumaScoringService = TraumaScoringService;
exports.traumaScoringService = new TraumaScoringService();
//# sourceMappingURL=trauma-scoring.service.js.map