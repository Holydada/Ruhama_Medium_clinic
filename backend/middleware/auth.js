"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No token provided',
                errorCode: 'NO_TOKEN'
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        // Determine error code based on error type
        const errorCode = error.name === 'TokenExpiredError'
            ? 'TOKEN_EXPIRED'
            : 'TOKEN_INVALID';
        const errorMessage = error.name === 'TokenExpiredError'
            ? 'Token has expired'
            : 'Invalid or expired token';
        res.status(401).json({
            success: false,
            error: errorMessage,
            errorCode
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized',
                errorCode: 'NO_TOKEN'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Forbidden - Insufficient permissions',
                errorCode: 'FORBIDDEN'
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map