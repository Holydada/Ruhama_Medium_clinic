"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qaService = exports.QualityAssuranceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QualityAssuranceService {
    /**
     * Run comprehensive system health checks
     */
    async runHealthChecks() {
        const checks = [];
        // Database connectivity
        checks.push(await this.checkDatabaseConnection());
        // Data integrity checks
        checks.push(...await this.checkDataIntegrity());
        // Business logic checks
        checks.push(...await this.checkBusinessLogic());
        // Performance checks
        checks.push(...await this.checkPerformance());
        // Security checks
        checks.push(...await this.checkSecurity());
        return checks;
    }
    /**
     * Check database connection
     */
    async checkDatabaseConnection() {
        try {
            await prisma.$queryRaw `SELECT 1`;
            return {
                name: 'Database Connection',
                category: 'Infrastructure',
                status: 'PASS',
                message: 'Database is accessible',
            };
        }
        catch (error) {
            return {
                name: 'Database Connection',
                category: 'Infrastructure',
                status: 'FAIL',
                message: 'Cannot connect to database',
                details: error,
            };
        }
    }
    /**
     * Check data integrity
     */
    async checkDataIntegrity() {
        const checks = [];
        // Check for orphaned visits
        const orphanedVisits = await prisma.patientVisit.count({
            where: {
                patient: null,
            },
        });
        checks.push({
            name: 'Orphaned Visits',
            category: 'Data Integrity',
            status: orphanedVisits > 0 ? 'FAIL' : 'PASS',
            message: orphanedVisits > 0
                ? `Found ${orphanedVisits} visits without patients`
                : 'No orphaned visits found',
            details: { count: orphanedVisits },
        });
        // Check for prescriptions without items
        const emptyPrescriptions = await prisma.prescription.count({
            where: {
                items: {
                    none: {},
                },
            },
        });
        checks.push({
            name: 'Empty Prescriptions',
            category: 'Data Integrity',
            status: emptyPrescriptions > 0 ? 'WARNING' : 'PASS',
            message: emptyPrescriptions > 0
                ? `Found ${emptyPrescriptions} prescriptions without items`
                : 'All prescriptions have items',
            details: { count: emptyPrescriptions },
        });
        // Check for lab orders without items
        const emptyLabOrders = await prisma.labOrder.count({
            where: {
                items: {
                    none: {},
                },
            },
        });
        checks.push({
            name: 'Empty Lab Orders',
            category: 'Data Integrity',
            status: emptyLabOrders > 0 ? 'WARNING' : 'PASS',
            message: emptyLabOrders > 0
                ? `Found ${emptyLabOrders} lab orders without items`
                : 'All lab orders have items',
            details: { count: emptyLabOrders },
        });
        // Check for duplicate patient card numbers
        const duplicateCards = await prisma.$queryRaw `
      SELECT card_number as "cardNumber", COUNT(*) as count
      FROM patients
      GROUP BY card_number
      HAVING COUNT(*) > 1
    `;
        checks.push({
            name: 'Duplicate Card Numbers',
            category: 'Data Integrity',
            status: duplicateCards.length > 0 ? 'FAIL' : 'PASS',
            message: duplicateCards.length > 0
                ? `Found ${duplicateCards.length} duplicate card numbers`
                : 'No duplicate card numbers',
            details: duplicateCards,
        });
        return checks;
    }
    /**
     * Check business logic
     */
    async checkBusinessLogic() {
        const checks = [];
        // Check for future-dated visits
        const futureVisits = await prisma.visit.count({
            where: {
                visitDate: {
                    gt: new Date(),
                },
            },
        });
        checks.push({
            name: 'Future-Dated Visits',
            category: 'Business Logic',
            status: futureVisits > 0 ? 'WARNING' : 'PASS',
            message: futureVisits > 0
                ? `Found ${futureVisits} visits with future dates`
                : 'No future-dated visits',
            details: { count: futureVisits },
        });
        // Check for patients with invalid ages
        const invalidAges = await prisma.$queryRaw `
      SELECT id, full_name as "fullName", 
             EXTRACT(YEAR FROM AGE(date_of_birth)) as age
      FROM patients
      WHERE EXTRACT(YEAR FROM AGE(date_of_birth)) < 0 
         OR EXTRACT(YEAR FROM AGE(date_of_birth)) > 150
    `;
        checks.push({
            name: 'Invalid Patient Ages',
            category: 'Business Logic',
            status: invalidAges.length > 0 ? 'FAIL' : 'PASS',
            message: invalidAges.length > 0
                ? `Found ${invalidAges.length} patients with invalid ages`
                : 'All patient ages are valid',
            details: invalidAges,
        });
        // Check for unpaid visits older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const oldUnpaidVisits = await prisma.visit.count({
            where: {
                visitDate: {
                    lt: thirtyDaysAgo,
                },
                paymentStatus: 'PENDING',
            },
        });
        checks.push({
            name: 'Old Unpaid Visits',
            category: 'Business Logic',
            status: oldUnpaidVisits > 0 ? 'WARNING' : 'PASS',
            message: oldUnpaidVisits > 0
                ? `Found ${oldUnpaidVisits} unpaid visits older than 30 days`
                : 'No old unpaid visits',
            details: { count: oldUnpaidVisits },
        });
        // Check for expired inventory items
        // Note: expiryDate field not yet in InventoryItem schema
        const expiredItems = 0; // await prisma.inventoryItem.count({...});
        checks.push({
            name: 'Expired Inventory',
            category: 'Business Logic',
            status: expiredItems > 0 ? 'WARNING' : 'PASS',
            message: expiredItems > 0
                ? `Found ${expiredItems} expired items in stock`
                : 'Expiry tracking not yet implemented',
            details: { count: expiredItems },
        });
        return checks;
    }
    /**
     * Check performance metrics
     */
    async checkPerformance() {
        const checks = [];
        // Check table sizes
        const patientCount = await prisma.patient.count();
        const visitCount = await prisma.visit.count();
        checks.push({
            name: 'Database Size',
            category: 'Performance',
            status: 'PASS',
            message: `${patientCount.toLocaleString()} patients, ${visitCount.toLocaleString()} visits`,
            details: { patients: patientCount, visits: visitCount },
        });
        // Check for missing indexes (this is a simplified check)
        const slowQueries = await prisma.$queryRaw `
      SELECT schemaname || '.' || tablename as table, 
             seq_scan as count
      FROM pg_stat_user_tables
      WHERE seq_scan > 1000
      ORDER BY seq_scan DESC
      LIMIT 5
    `;
        checks.push({
            name: 'Sequential Scans',
            category: 'Performance',
            status: slowQueries.length > 0 ? 'WARNING' : 'PASS',
            message: slowQueries.length > 0
                ? 'Some tables have high sequential scan counts'
                : 'No performance issues detected',
            details: slowQueries,
        });
        return checks;
    }
    /**
     * Check security
     */
    async checkSecurity() {
        const checks = [];
        // Check for inactive users
        const inactiveUsers = await prisma.user.count({
            where: {
                isActive: false,
            },
        });
        checks.push({
            name: 'Inactive Users',
            category: 'Security',
            status: 'PASS',
            message: `${inactiveUsers} inactive users`,
            details: { count: inactiveUsers },
        });
        // Check for users without email verification
        const unverifiedUsers = await prisma.user.count({
            where: {
                emailVerified: false,
                isActive: true,
            },
        });
        checks.push({
            name: 'Unverified Active Users',
            category: 'Security',
            status: unverifiedUsers > 0 ? 'WARNING' : 'PASS',
            message: unverifiedUsers > 0
                ? `${unverifiedUsers} active users without email verification`
                : 'All active users are verified',
            details: { count: unverifiedUsers },
        });
        // Check for old sessions
        const oldSessions = await prisma.userSession.count({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        checks.push({
            name: 'Expired Sessions',
            category: 'Security',
            status: oldSessions > 0 ? 'WARNING' : 'PASS',
            message: oldSessions > 0
                ? `${oldSessions} expired sessions should be cleaned up`
                : 'No expired sessions',
            details: { count: oldSessions },
        });
        return checks;
    }
    /**
     * Generate QA report
     */
    async generateReport() {
        const checks = await this.runHealthChecks();
        const summary = {
            total: checks.length,
            passed: checks.filter(c => c.status === 'PASS').length,
            failed: checks.filter(c => c.status === 'FAIL').length,
            warnings: checks.filter(c => c.status === 'WARNING').length,
        };
        return {
            summary,
            checks,
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Fix common issues automatically
     */
    async autoFix() {
        const fixed = [];
        const errors = [];
        try {
            // Clean up expired sessions
            const deletedSessions = await prisma.userSession.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            });
            fixed.push(`Deleted ${deletedSessions.count} expired sessions`);
        }
        catch (error) {
            errors.push('Failed to clean up expired sessions');
        }
        try {
            // Mark expired inventory items
            const updatedItems = await prisma.inventoryItem.updateMany({
                where: {
                    // expiryDate field not in schema yet
                    quantity: {
                        gt: 0,
                    },
                },
                data: {
                // Add a note or flag (if you have such a field)
                },
            });
            fixed.push(`Expiry tracking not yet implemented`);
        }
        catch (error) {
            errors.push('Expiry tracking feature pending');
        }
        return { fixed, errors };
    }
}
exports.QualityAssuranceService = QualityAssuranceService;
exports.qaService = new QualityAssuranceService();
//# sourceMappingURL=quality-assurance.service.js.map