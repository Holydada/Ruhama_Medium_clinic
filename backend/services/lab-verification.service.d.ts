export declare class LabVerificationService {
    /**
     * Enter lab results with reference ranges
     */
    enterResults(labOrderItemId: string, result: string, enteredById: string, notes?: string): Promise<{
        id: string;
        createdAt: Date;
        result: string | null;
        status: import(".prisma/client").$Enums.LabStatus;
        notes: string | null;
        isAbnormal: boolean | null;
        orderId: string;
        testId: string;
        testName: string;
    }>;
    /**
     * Verify lab results (two-step verification)
     */
    verifyResults(labOrderItemId: string, verifiedById: string, approved: boolean, verificationNotes?: string): Promise<{
        id: string;
        createdAt: Date;
        result: string | null;
        status: import(".prisma/client").$Enums.LabStatus;
        notes: string | null;
        isAbnormal: boolean | null;
        orderId: string;
        testId: string;
        testName: string;
    }>;
    /**
     * Check if value is abnormal based on reference ranges
     */
    private checkAbnormalValue;
    /**
     * Get pending verifications
     */
    getPendingVerifications(): Promise<{
        id: string;
        createdAt: Date;
        result: string | null;
        status: import(".prisma/client").$Enums.LabStatus;
        notes: string | null;
        isAbnormal: boolean | null;
        orderId: string;
        testId: string;
        testName: string;
    }[]>;
    /**
     * Get critical results requiring immediate attention
     */
    getCriticalResults(): Promise<{
        id: string;
        createdAt: Date;
        result: string | null;
        status: import(".prisma/client").$Enums.LabStatus;
        notes: string | null;
        isAbnormal: boolean | null;
        orderId: string;
        testId: string;
        testName: string;
    }[]>;
}
export declare const labVerificationService: LabVerificationService;
//# sourceMappingURL=lab-verification.service.d.ts.map