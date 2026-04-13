"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.performanceMonitor = void 0;
exports.performanceMiddleware = performanceMiddleware;
// Simple performance monitoring middleware
exports.performanceMonitor = {
    getHealthCheck() {
        return {
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory: process.memoryUsage(),
        };
    },
    getMetrics() {
        return {
            requests: 0,
            errors: 0,
            avgResponseTime: 0,
        };
    },
};
// Simple cache implementation
exports.cache = new Map();
// Middleware function
function performanceMiddleware(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        // Log performance metrics
        console.log(`${req.method} ${req.path} - ${duration}ms`);
    });
    next();
}
//# sourceMappingURL=performance-monitor.js.map