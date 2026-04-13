interface BusinessRule {
    name: string;
    description: string;
    condition: (data: any, context?: any) => boolean | Promise<boolean>;
    action: 'BLOCK' | 'WARN' | 'LOG';
    message: string;
}
export declare class BusinessRulesService {
    private rules;
    constructor();
    private initializeRules;
    addRule(context: string, rule: BusinessRule): void;
    validateBusinessRules(context: string, data: any, additionalContext?: any): Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    validatePatientData(data: any): {
        valid: boolean;
        errors: string[];
    };
    validateVitalSigns(data: any): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
}
export declare const businessRules: BusinessRulesService;
export {};
//# sourceMappingURL=business-rules.service.d.ts.map