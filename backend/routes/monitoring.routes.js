"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const performance_monitor_1 = require("../middleware/performance-monitor");
const audit_logger_service_1 = require("../services/audit-logger.service");
const router = (0, express_1.Router)();
// Health check endpoint (public)
router.get('/health', (req, res) => {
    const health = performance_monitor_1.performanceMonitor.getHealthCheck();
    res.json(health);
});
// Performance metrics (admin only)
router.get('/metrics', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), (req, res) => {
    const { path, method, since, limit } = req.query;
    const options = {};
    if (path)
        options.path = path;
    if (method)
        options.method = method;
    if (since)
        options.since = new Date(since);
    if (limit)
        options.limit = parseInt(limit);
    const metrics = performance_monitor_1.performanceMonitor.getMetrics(options);
    const stats = performance_monitor_1.performanceMonitor.getStats(path);
    res.json({
        metrics,
        stats,
        cacheSize: performance_monitor_1.cache.size(),
    });
});
// Performance stats by endpoint
router.get('/stats/:path(*)?', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), (req, res) => {
    const path = req.params.path ? `/${req.params.path}` : undefined;
    const stats = performance_monitor_1.performanceMonitor.getStats(path);
    if (!stats) {
        return res.status(404).json({ error: 'No metrics found for this path' });
    }
    res.json(stats);
});
// Audit logs
router.get('/audit-logs', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), async (req, res) => {
    try {
        const { userId, action, resource, startDate, endDate, success, limit, offset, } = req.query;
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (action)
            filters.action = action;
        if (resource)
            filters.resource = resource;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (success !== undefined)
            filters.success = success === 'true';
        if (limit)
            filters.limit = parseInt(limit);
        if (offset)
            filters.offset = parseInt(offset);
        const result = await audit_logger_service_1.auditLogger.getAuditLogs(filters);
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});
// Security summary
router.get('/security-summary', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), async (req, res) => {
    try {
        const days = req.query.days ? parseInt(req.query.days) : 7;
        const summary = await audit_logger_service_1.auditLogger.getSecuritySummary(days);
        res.json(summary);
    }
    catch (error) {
        console.error('Error fetching security summary:', error);
        res.status(500).json({ error: 'Failed to fetch security summary' });
    }
});
// Cache management
router.post('/cache/clear', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), (req, res) => {
    performance_monitor_1.cache.clear();
    res.json({ message: 'Cache cleared successfully' });
});
router.delete('/cache/:key', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), (req, res) => {
    performance_monitor_1.cache.delete(req.params.key);
    res.json({ message: 'Cache entry deleted' });
});
// System info
router.get('/system-info', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN']), (req, res) => {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    res.json({
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        memory: {
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
        cpu: process.cpuUsage(),
    });
});
exports.default = router;
//# sourceMappingURL=monitoring.routes.js.map