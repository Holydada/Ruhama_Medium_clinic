"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const email_service_1 = require("./email.service");
const emailService = new email_service_1.EmailService();
/** Express `req.query` values are strings; Prisma requires numeric `skip` / `take`. */
function toPositiveInt(value, fallback) {
    if (value === undefined || value === null || value === '')
        return fallback;
    const n = typeof value === 'number' ? value : parseInt(String(value), 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}
class AdminService {
    // User Management
    async getPendingUsers() {
        const users = await database_1.default.user.findMany({
            where: {
                isApproved: false,
                role: { not: client_1.UserRole.PATIENT },
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                department: true,
                employmentType: true,
                createdAt: true,
            },
        });
        return users;
    }
    async approveUser(userId, approvedById) {
        // Generate 6-digit OTP for first login
        const firstLoginOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const user = await database_1.default.user.update({
            where: { id: userId },
            data: {
                isApproved: true,
                isActive: true,
                emailVerified: false,
                emailVerificationToken: firstLoginOTP, // Store OTP here
                verificationEmailSentAt: new Date(),
                approvedById,
                approvedAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isApproved: true,
                isActive: true,
                emailVerified: true,
            },
        });
        // Store OTP expiry in audit log for validation
        await this.createAuditLog({
            userId: approvedById,
            action: 'USER_APPROVED_OTP_SENT',
            resource: 'users',
            resourceId: userId,
            newValues: {
                isApproved: true,
                isActive: true,
                firstLoginOTP,
                otpExpiresAt: otpExpiry.toISOString(),
            },
        });
        try {
            console.log(`[admin] Sending first login OTP to ${user.email}...`);
            await emailService.sendFirstLoginOTP(user.email, user.fullName, firstLoginOTP);
            console.log(`✅ [admin] First login OTP sent successfully to ${user.email}`);
        }
        catch (err) {
            console.error('❌ [email] First login OTP email failed (user is still approved). Check EMAIL_* in backend/.env:', err);
            console.error('[email] Error details:', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
                email: user.email,
                fullName: user.fullName,
            });
        }
        return user;
    }
    async rejectUser(userId, approvedById) {
        const user = await database_1.default.user.delete({
            where: { id: userId },
        });
        // Create audit log
        await this.createAuditLog({
            userId: approvedById,
            action: 'USER_REJECTED',
            resource: 'users',
            resourceId: userId,
            oldValues: user,
        });
        return { message: 'User rejected and removed' };
    }
    async getAllUsers(params) {
        const page = toPositiveInt(params.page, 1);
        const limit = Math.min(toPositiveInt(params.limit, 50), 500);
        const skip = (page - 1) * limit;
        const where = {};
        if (params.role) {
            where.role = params.role;
        }
        if (params.isActive !== undefined) {
            where.isActive = params.isActive;
        }
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    role: true,
                    department: true,
                    employmentType: true,
                    isActive: true,
                    isApproved: true,
                    lastLogin: true,
                    createdAt: true,
                    clinicalPersonaUserId: true,
                    supervisedByUserId: true,
                    supervisedBy: { select: { id: true, fullName: true, role: true } },
                },
            }),
            database_1.default.user.count({ where }),
        ]);
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateUserStatus(userId, isActive, adminId) {
        const user = await database_1.default.user.update({
            where: { id: userId },
            data: { isActive },
            select: {
                id: true,
                email: true,
                fullName: true,
                isActive: true,
            },
        });
        // Create audit log
        await this.createAuditLog({
            userId: adminId,
            action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
            resource: 'users',
            resourceId: userId,
            newValues: { isActive },
        });
        return user;
    }
    async updateUserRole(userId, role, adminId) {
        if (!Object.values(client_1.UserRole).includes(role)) {
            throw new Error('Invalid role');
        }
        const oldUser = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        const user = await database_1.default.user.update({
            where: { id: userId },
            data: { role: role },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        });
        // Create audit log
        await this.createAuditLog({
            userId: adminId,
            action: 'USER_ROLE_CHANGED',
            resource: 'users',
            resourceId: userId,
            oldValues: { role: oldUser?.role },
            newValues: { role },
        });
        return user;
    }
    // Audit Logs
    async createAuditLog(data) {
        const log = await database_1.default.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                resource: data.resource || data.tableName,
                resourceId: data.resourceId || data.recordId,
                oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
                newValues: data.newValues ? JSON.stringify(data.newValues) : null,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
            },
        });
        return log;
    }
    async getAuditLogs(params) {
        const page = toPositiveInt(params.page, 1);
        const limit = Math.min(toPositiveInt(params.limit, 50), 200);
        const skip = (page - 1) * limit;
        const where = {};
        if (params.userId) {
            where.userId = params.userId;
        }
        if (params.action) {
            where.action = params.action;
        }
        if (params.tableName) {
            where.tableName = params.tableName;
        }
        if (params.startDate || params.endDate) {
            where.createdAt = {};
            if (params.startDate) {
                where.createdAt.gte = new Date(params.startDate);
            }
            if (params.endDate) {
                const endDate = new Date(params.endDate);
                endDate.setHours(23, 59, 59, 999);
                where.createdAt.lte = endDate;
            }
        }
        const [logs, total] = await Promise.all([
            database_1.default.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { timestamp: 'desc' },
                include: {
                    user: {
                        select: {
                            fullName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            }),
            database_1.default.auditLog.count({ where }),
        ]);
        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // System Statistics
    async getSystemStats() {
        const [totalUsers, activeUsers, pendingUsers, totalPatients, todayVisits, todayRevenue,] = await Promise.all([
            database_1.default.user.count(),
            database_1.default.user.count({ where: { isActive: true } }),
            database_1.default.user.count({ where: { isApproved: false } }),
            database_1.default.patient.count(),
            database_1.default.patientVisit.count({
                where: {
                    visitDate: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            database_1.default.financialTransaction.aggregate({
                where: {
                    transactionDate: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                    paymentStatus: 'PAID',
                },
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                pending: pendingUsers,
            },
            patients: {
                total: totalPatients,
            },
            visits: {
                today: todayVisits,
            },
            revenue: {
                today: Number(todayRevenue._sum.amount ?? 0),
            },
        };
    }
    async getDashboardStats(startDate, endDate) {
        const start = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0));
        const end = endDate ? new Date(endDate) : new Date(new Date().setHours(23, 59, 59, 999));
        const [visits, prescriptions, labOrders, ultrasoundOrders, revenue,] = await Promise.all([
            database_1.default.patientVisit.count({
                where: { visitDate: { gte: start, lte: end } },
            }),
            database_1.default.prescription.count({
                where: { createdAt: { gte: start, lte: end } },
            }),
            database_1.default.labOrder.count({
                where: { orderedAt: { gte: start, lte: end } },
            }),
            database_1.default.ultrasoundOrder.count({
                where: { createdAt: { gte: start, lte: end } },
            }),
            database_1.default.financialTransaction.aggregate({
                where: {
                    transactionDate: { gte: start, lte: end },
                    paymentStatus: 'PAID',
                },
                _sum: { amount: true },
            }),
        ]);
        return {
            visits,
            prescriptions,
            labOrders,
            ultrasoundOrders,
            revenue: Number(revenue._sum.amount ?? 0),
            period: { startDate: start, endDate: end },
        };
    }
    async getUserById(id) {
        const user = await database_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                department: true,
                employmentType: true,
                isActive: true,
                isApproved: true,
                emailVerified: true,
                lastLogin: true,
                createdAt: true,
                patientLinkId: true,
                clinicalPersonaUserId: true,
                supervisedByUserId: true,
                supervisedBy: { select: { id: true, fullName: true, role: true } },
                clinicalPersona: { select: { id: true, fullName: true, email: true, role: true } },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async updateUserProfile(targetId, data, adminId) {
        const existing = await database_1.default.user.findUnique({ where: { id: targetId } });
        if (!existing) {
            throw new Error('User not found');
        }
        const patch = {};
        if (data.fullName !== undefined) {
            const name = String(data.fullName).trim();
            if (!name)
                throw new Error('fullName cannot be empty');
            patch.fullName = name;
        }
        if (data.phone !== undefined)
            patch.phone = data.phone || null;
        if (data.department !== undefined)
            patch.department = data.department || null;
        if (data.employmentType !== undefined) {
            const et = data.employmentType;
            patch.employmentType =
                et === 'FULL_TIME' || et === 'PART_TIME' ? et : null;
        }
        if (Object.keys(patch).length === 0) {
            throw new Error('No valid fields to update');
        }
        const user = await database_1.default.user.update({
            where: { id: targetId },
            data: patch,
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                department: true,
                employmentType: true,
                isActive: true,
                isApproved: true,
                lastLogin: true,
                createdAt: true,
            },
        });
        await this.createAuditLog({
            userId: adminId,
            action: 'USER_PROFILE_UPDATED',
            resource: 'users',
            resourceId: targetId,
            newValues: patch,
        });
        return user;
    }
    async deleteUser(targetId, adminId) {
        if (targetId === adminId) {
            throw new Error('You cannot delete your own account');
        }
        const target = await database_1.default.user.findUnique({
            where: { id: targetId },
            select: {
                id: true,
                email: true,
                role: true,
                fullName: true,
                _count: {
                    select: {
                        registeredPatients: true,
                        registeredVisits: true,
                        assignedVisits: true,
                        prescriptions: true,
                        transactions: true,
                        invoices: true,
                    }
                }
            },
        });
        if (!target) {
            throw new Error('User not found');
        }
        if (target.role === client_1.UserRole.SUPER_ADMIN) {
            const others = await database_1.default.user.count({
                where: { role: client_1.UserRole.SUPER_ADMIN, id: { not: targetId } },
            });
            if (others === 0) {
                throw new Error('Cannot delete the last Super Admin account');
            }
        }
        // Check if user has any related records
        const hasRelatedRecords = Object.values(target._count).some(count => count > 0);
        if (hasRelatedRecords) {
            // User has related records, deactivate instead of delete
            await database_1.default.user.update({
                where: { id: targetId },
                data: { isActive: false, isApproved: false },
            });
            await this.createAuditLog({
                userId: adminId,
                action: 'USER_DEACTIVATED_DELETE_BLOCKED',
                resource: 'users',
                resourceId: targetId,
                newValues: {
                    reason: 'Related records exist; user was deactivated instead of deleted',
                    relatedRecords: target._count,
                },
            });
            return {
                mode: 'deactivated',
                message: `User "${target.fullName}" has related records (${target._count.registeredPatients} patients, ${target._count.registeredVisits} visits, etc.). The account was deactivated instead of being deleted.`,
            };
        }
        // No related records, safe to delete
        // Delete user sessions and notifications first
        await database_1.default.userSession.deleteMany({ where: { userId: targetId } });
        await database_1.default.notification.deleteMany({ where: { userId: targetId } });
        try {
            // Try to delete the user
            await database_1.default.user.delete({ where: { id: targetId } });
            // Log successful deletion
            await this.createAuditLog({
                userId: adminId,
                action: 'USER_DELETED',
                resource: 'users',
                resourceId: targetId,
                oldValues: { email: target.email, role: target.role, fullName: target.fullName },
            });
            return { mode: 'deleted', message: `User account "${target.fullName}" has been permanently removed` };
        }
        catch (e) {
            // If deletion still fails due to foreign key constraints, deactivate instead
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && (e.code === 'P2003' || e.code === 'P2014')) {
                await database_1.default.user.update({
                    where: { id: targetId },
                    data: { isActive: false, isApproved: false },
                });
                await this.createAuditLog({
                    userId: adminId,
                    action: 'USER_DEACTIVATED_DELETE_BLOCKED',
                    resource: 'users',
                    resourceId: targetId,
                    newValues: {
                        reason: 'Foreign key constraint prevented deletion; user was deactivated',
                        error: e.code,
                    },
                });
                return {
                    mode: 'deactivated',
                    message: `User "${target.fullName}" has related records in the system. The account was deactivated instead of being deleted.`,
                };
            }
            // Re-throw unexpected errors
            console.error('Unexpected error deleting user:', e);
            throw new Error(`Failed to delete user: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    }
    async getRoleSummary() {
        const grouped = await database_1.default.user.groupBy({
            by: ['role'],
            _count: { role: true },
        });
        return grouped.map((g) => ({
            role: g.role,
            count: g._count.role,
        }));
    }
    /** Rows for CSV / JSON export (report builder). */
    async getReportExportData(type, start, end) {
        const safeEnd = new Date(end);
        safeEnd.setHours(23, 59, 59, 999);
        switch (type) {
            case 'daily-revenue': {
                const rows = await database_1.default.financialTransaction.findMany({
                    where: {
                        transactionDate: { gte: start, lte: safeEnd },
                        paymentStatus: 'PAID',
                    },
                    orderBy: { transactionDate: 'asc' },
                    include: {
                        patient: { select: { fullName: true, cardNumber: true } },
                    },
                });
                return {
                    filename: `revenue_${start.toISOString().slice(0, 10)}_${safeEnd.toISOString().slice(0, 10)}.csv`,
                    headers: ['transactionNumber', 'date', 'type', 'amount', 'method', 'patient', 'cardNumber'],
                    rows: rows.map((r) => ({
                        transactionNumber: r.transactionNumber,
                        date: r.transactionDate.toISOString(),
                        type: r.transactionType,
                        amount: Number(r.amount),
                        method: r.paymentMethod,
                        patient: r.patient?.fullName ?? '',
                        cardNumber: r.patient?.cardNumber ?? '',
                    })),
                };
            }
            case 'patient-visits': {
                const rows = await database_1.default.patientVisit.findMany({
                    where: { visitDate: { gte: start, lte: safeEnd } },
                    orderBy: { visitDate: 'desc' },
                    include: {
                        patient: { select: { fullName: true, cardNumber: true } },
                        assignedDoctor: { select: { fullName: true } },
                    },
                });
                return {
                    filename: `visits_${start.toISOString().slice(0, 10)}_${safeEnd.toISOString().slice(0, 10)}.csv`,
                    headers: ['visitNumber', 'date', 'patient', 'card', 'status', 'service', 'doctor'],
                    rows: rows.map((v) => ({
                        visitNumber: v.visitNumber,
                        date: v.visitDate.toISOString(),
                        patient: v.patient.fullName,
                        card: v.patient.cardNumber,
                        status: v.status,
                        service: v.serviceType,
                        doctor: v.assignedDoctor?.fullName ?? '',
                    })),
                };
            }
            case 'lab-tests': {
                const rows = await database_1.default.labOrder.findMany({
                    where: { orderedAt: { gte: start, lte: safeEnd } },
                    orderBy: { orderedAt: 'desc' },
                    include: {
                        patient: { select: { fullName: true, cardNumber: true } },
                        items: { select: { testName: true, status: true } },
                    },
                });
                return {
                    filename: `lab_orders_${start.toISOString().slice(0, 10)}.csv`,
                    headers: ['orderNumber', 'orderedAt', 'status', 'patient', 'card', 'items'],
                    rows: rows.map((o) => ({
                        orderNumber: o.orderNumber,
                        orderedAt: o.orderedAt.toISOString(),
                        status: o.status,
                        patient: o.patient.fullName,
                        card: o.patient.cardNumber,
                        items: o.items.map((i) => `${i.testName}:${i.status}`).join('; '),
                    })),
                };
            }
            case 'pharmacy-sales': {
                const rows = await database_1.default.prescription.findMany({
                    where: {
                        status: 'DISPENSED',
                        dispensedAt: { gte: start, lte: safeEnd },
                    },
                    orderBy: { dispensedAt: 'desc' },
                    include: {
                        patient: { select: { fullName: true, cardNumber: true } },
                        items: { select: { drugName: true, quantity: true } },
                    },
                });
                return {
                    filename: `pharmacy_dispensed_${start.toISOString().slice(0, 10)}.csv`,
                    headers: ['prescriptionNumber', 'dispensedAt', 'patient', 'card', 'lines'],
                    rows: rows.map((p) => ({
                        prescriptionNumber: p.prescriptionNumber,
                        dispensedAt: p.dispensedAt ? p.dispensedAt.toISOString() : '',
                        patient: p.patient.fullName,
                        card: p.patient.cardNumber,
                        lines: p.items.map((i) => `${i.drugName}x${i.quantity}`).join('; '),
                    })),
                };
            }
            case 'staff-performance': {
                const rows = await database_1.default.auditLog.groupBy({
                    by: ['userId'],
                    where: {
                        createdAt: { gte: start, lte: safeEnd },
                        userId: { not: null },
                    },
                    _count: { id: true },
                });
                const users = await database_1.default.user.findMany({
                    where: { id: { in: rows.map((r) => r.userId).filter(Boolean) } },
                    select: { id: true, fullName: true, email: true, role: true },
                });
                const map = new Map(users.map((u) => [u.id, u]));
                return {
                    filename: `staff_activity_${start.toISOString().slice(0, 10)}.csv`,
                    headers: ['user', 'email', 'role', 'actionsLogged'],
                    rows: rows.map((r) => {
                        const u = r.userId ? map.get(r.userId) : undefined;
                        return {
                            user: u?.fullName ?? r.userId ?? '',
                            email: u?.email ?? '',
                            role: u?.role ?? '',
                            actionsLogged: r._count.id,
                        };
                    }),
                };
            }
            case 'inventory-status': {
                const rows = await database_1.default.pharmacyStock.findMany({
                    where: { status: { not: 'EXPIRED' } },
                    include: { drug: { select: { drugName: true } } },
                    orderBy: { quantityInStock: 'asc' },
                    take: 2000,
                });
                return {
                    filename: `inventory_${new Date().toISOString().slice(0, 10)}.csv`,
                    headers: ['drug', 'batch', 'qty', 'reorderLevel', 'status', 'expiry'],
                    rows: rows.map((s) => ({
                        drug: s.drug.drugName,
                        batch: s.batchNumber,
                        qty: s.quantityInStock,
                        reorderLevel: s.reorderLevel,
                        status: s.status,
                        expiry: s.expiryDate.toISOString().slice(0, 10),
                    })),
                };
            }
            case 'appointment-analytics':
            case 'department-performance': {
                const visits = await database_1.default.patientVisit.groupBy({
                    by: ['serviceType'],
                    where: { visitDate: { gte: start, lte: safeEnd } },
                    _count: { id: true },
                });
                return {
                    filename: `visits_by_service_${start.toISOString().slice(0, 10)}.csv`,
                    headers: ['serviceType', 'visitCount'],
                    rows: visits.map((v) => ({
                        serviceType: v.serviceType,
                        visitCount: v._count.id,
                    })),
                };
            }
            default:
                throw new Error(`Unknown report type: ${type}`);
        }
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map