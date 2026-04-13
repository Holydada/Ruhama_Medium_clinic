"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceService = exports.InsuranceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class InsuranceService {
    /**
     * Create insurance claim
     */
    async createClaim(data) {
        const claimNumber = `CLM-${Date.now()}`;
        const claim = await prisma.insuranceClaim.create({
            data: {
                claimNumber,
                patientId: data.patientId,
                visitId: data.visitId,
                insuranceProvider: data.insuranceProvider,
                policyNumber: data.policyNumber,
                claimAmount: data.claimAmount,
                services: JSON.stringify(data.services),
                diagnosis: data.diagnosis,
                status: 'PENDING',
                submittedAt: new Date(),
                createdById: data.createdById,
            },
            include: {
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                    },
                },
            },
        });
        return claim;
    }
    /**
     * Get claims by status
     */
    async getClaimsByStatus(status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        return await prisma.insuranceClaim.findMany({
            where,
            include: {
                patient: {
                    select: {
                        fullName: true,
                        cardNumber: true,
                    },
                },
                visit: {
                    select: {
                        visitDate: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });
    }
    /**
     * Update claim status
     */
    async updateClaimStatus(claimId, status, approvedAmount, rejectionReason) {
        return await prisma.insuranceClaim.update({
            where: { id: claimId },
            data: {
                status,
                approvedAmount,
                rejectionReason,
                processedAt: new Date(),
            },
        });
    }
    /**
     * Get insurance summary
     */
    async getInsuranceSummary(startDate, endDate) {
        const claims = await prisma.insuranceClaim.findMany({
            where: {
                submittedAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const summary = {
            totalClaims: claims.length,
            totalClaimAmount: claims.reduce((sum, c) => sum + c.claimAmount, 0),
            approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
            approvedAmount: claims
                .filter(c => c.status === 'APPROVED')
                .reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
            pendingClaims: claims.filter(c => c.status === 'PENDING').length,
            rejectedClaims: claims.filter(c => c.status === 'REJECTED').length,
        };
        return summary;
    }
}
exports.InsuranceService = InsuranceService;
exports.insuranceService = new InsuranceService();
//# sourceMappingURL=insurance.service.js.map