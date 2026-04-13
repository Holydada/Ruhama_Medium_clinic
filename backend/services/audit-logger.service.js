"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = void 0;
exports.auditMiddleware = auditMiddleware;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.auditLogger = {
    async log(data) {
        try {
            await prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    resource: data.resource,
                    resourceId: data.resourceId,
                    oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
                    newValues: data.newValues ? JSON.stringify(data.newValues) : null,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                },
            });
        }
        catch (error) {
            console.error('Audit log error:', error);
        }
    },
};
// Middleware to automatically log requests
function auditMiddleware(req, res, next) {
    const user = req.user;
    res.on('finish', () => {
        if (req.method !== 'GET') {
            exports.auditLogger.log({
                userId: user?.id,
                action: req.method,
                resource: req.path,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
        }
    });
    next();
}
//# sourceMappingURL=audit-logger.service.js.map