export declare class InsuranceService {
    /**
     * Create insurance claim
     */
    createClaim(data: {
        patientId: string;
        visitId: string;
        insuranceProvider: string;
        policyNumber: string;
        claimAmount: number;
        services: Array<{
            serviceType: string;
            description: string;
            amount: number;
        }>;
        diagnosis: string;
        createdById: string;
    }): Promise<any>;
    /**
     * Get claims by status
     */
    getClaimsByStatus(status?: string): Promise<any>;
    /**
     * Update claim status
     */
    updateClaimStatus(claimId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', approvedAmount?: number, rejectionReason?: string): Promise<any>;
    /**
     * Get insurance summary
     */
    getInsuranceSummary(startDate: Date, endDate: Date): Promise<{
        totalClaims: any;
        totalClaimAmount: any;
        approvedClaims: any;
        approvedAmount: any;
        pendingClaims: any;
        rejectedClaims: any;
    }>;
}
export declare const insuranceService: InsuranceService;
//# sourceMappingURL=insurance.service.d.ts.map