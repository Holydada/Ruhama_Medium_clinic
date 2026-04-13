interface QACheck {
    name: string;
    category: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
    message: string;
    details?: any;
}
export declare class QualityAssuranceService {
    /**
     * Run comprehensive system health checks
     */
    runHealthChecks(): Promise<QACheck[]>;
    /**
     * Check database connection
     */
    private checkDatabaseConnection;
    /**
     * Check data integrity
     */
    private checkDataIntegrity;
    /**
     * Check business logic
     */
    private checkBusinessLogic;
    /**
     * Check performance metrics
     */
    private checkPerformance;
    /**
     * Check security
     */
    private checkSecurity;
    /**
     * Generate QA report
     */
    generateReport(): Promise<{
        summary: {
            total: number;
            passed: number;
            failed: number;
            warnings: number;
        };
        checks: QACheck[];
        timestamp: string;
    }>;
    /**
     * Fix common issues automatically
     */
    autoFix(): Promise<{
        fixed: string[];
        errors: string[];
    }>;
}
export declare const qaService: QualityAssuranceService;
export {};
//# sourceMappingURL=quality-assurance.service.d.ts.map