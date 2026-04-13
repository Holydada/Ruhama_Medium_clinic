"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReport = exports.getRoleSummary = exports.deleteUser = exports.updateUserProfile = exports.getUserById = exports.getDashboardStats = exports.getSystemStats = exports.getAuditLogs = exports.updateUserRole = exports.updateUserStatus = exports.getAllUsers = exports.rejectUser = exports.approveUser = exports.getPendingUsers = void 0;
const admin_service_1 = require("../services/admin.service");
const adminService = new admin_service_1.AdminService();
// User Management
const getPendingUsers = async (_req, res) => {
    try {
        const users = await adminService.getPendingUsers();
        res.json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch pending users',
        });
    }
};
exports.getPendingUsers = getPendingUsers;
const approveUser = async (req, res) => {
    try {
        const user = await adminService.approveUser(req.params.id, req.user.id);
        res.json({
            success: true,
            data: user,
            message: 'User approved successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to approve user',
        });
    }
};
exports.approveUser = approveUser;
const rejectUser = async (req, res) => {
    try {
        const result = await adminService.rejectUser(req.params.id, req.user.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to reject user',
        });
    }
};
exports.rejectUser = rejectUser;
const getAllUsers = async (req, res) => {
    try {
        const result = await adminService.getAllUsers(req.query);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch users',
        });
    }
};
exports.getAllUsers = getAllUsers;
const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await adminService.updateUserStatus(req.params.id, isActive, req.user.id);
        res.json({
            success: true,
            data: user,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update user status',
        });
    }
};
exports.updateUserStatus = updateUserStatus;
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await adminService.updateUserRole(req.params.id, role, req.user.id);
        res.json({
            success: true,
            data: user,
            message: 'User role updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update user role',
        });
    }
};
exports.updateUserRole = updateUserRole;
// Audit Logs
const getAuditLogs = async (req, res) => {
    try {
        const result = await adminService.getAuditLogs(req.query);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch audit logs',
        });
    }
};
exports.getAuditLogs = getAuditLogs;
// Statistics
const getSystemStats = async (_req, res) => {
    try {
        const stats = await adminService.getSystemStats();
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch system stats',
        });
    }
};
exports.getSystemStats = getSystemStats;
const getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const stats = await adminService.getDashboardStats(startDate, endDate);
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch dashboard stats',
        });
    }
};
exports.getDashboardStats = getDashboardStats;
const getUserById = async (req, res) => {
    try {
        const user = await adminService.getUserById(req.params.id);
        res.json({ success: true, data: user });
    }
    catch (error) {
        const status = error.message === 'User not found' ? 404 : 500;
        res.status(status).json({
            success: false,
            error: error.message || 'Failed to fetch user',
        });
    }
};
exports.getUserById = getUserById;
const updateUserProfile = async (req, res) => {
    try {
        const user = await adminService.updateUserProfile(req.params.id, req.body, req.user.id);
        res.json({ success: true, data: user, message: 'Profile updated' });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to update user',
        });
    }
};
exports.updateUserProfile = updateUserProfile;
const deleteUser = async (req, res) => {
    try {
        const result = await adminService.deleteUser(req.params.id, req.user.id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to delete user',
        });
    }
};
exports.deleteUser = deleteUser;
const getRoleSummary = async (_req, res) => {
    try {
        const data = await adminService.getRoleSummary();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch role summary',
        });
    }
};
exports.getRoleSummary = getRoleSummary;
function buildCsv(headers, rows) {
    const esc = (v) => {
        const s = String(v ?? '');
        if (/[",\n\r]/.test(s))
            return `"${s.replace(/"/g, '""')}"`;
        return s;
    };
    const lines = [
        headers.map((h) => esc(h)).join(','),
        ...rows.map((row) => headers.map((h) => esc(row[h])).join(',')),
    ];
    return lines.join('\r\n');
}
const exportReport = async (req, res) => {
    try {
        const { type, startDate, endDate, format } = req.query;
        if (!type || typeof type !== 'string') {
            res.status(400).json({ success: false, error: 'type is required' });
            return;
        }
        const start = startDate ? new Date(String(startDate)) : new Date(new Date().setHours(0, 0, 0, 0));
        const end = endDate ? new Date(String(endDate)) : new Date();
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            res.status(400).json({ success: false, error: 'Invalid date range' });
            return;
        }
        const { filename, headers, rows } = await adminService.getReportExportData(type, start, end);
        const fmt = (format && String(format).toLowerCase()) || 'csv';
        if (fmt === 'json') {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename.replace(/\.csv$/, '.json')}"`);
            res.send(JSON.stringify({ headers, rows }, null, 2));
            return;
        }
        const csv = buildCsv(headers, rows);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send('\ufeff' + csv);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Export failed',
        });
    }
};
exports.exportReport = exportReport;
//# sourceMappingURL=admin.controller.js.map