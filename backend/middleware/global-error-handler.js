"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.asyncHandler = exports.globalErrorHandler = exports.AppError = void 0;
const client_1 = require("@prisma/client");
class AppError extends Error {
    statusCode;
    code;
    isOperational;
    details;
    constructor(statusCode, code, message, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const globalErrorHandler = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const path = req.path;
    const requestId = req.headers['x-request-id'];
    // Log error (in production, send to monitoring service)
    console.error('[ERROR]', {
        timestamp,
        path,
        requestId,
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
    // Handle known application errors
    if (err instanceof AppError) {
        const response = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
                timestamp,
                path,
                requestId,
            },
        };
        return res.status(err.statusCode).json(response);
    }
    // Handle Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        return handlePrismaError(err, res, timestamp, path, requestId);
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
        const response = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: err.message,
                timestamp,
                path,
                requestId,
            },
        };
        return res.status(400).json(response);
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        const response = {
            success: false,
            error: {
                code: 'AUTHENTICATION_ERROR',
                message: 'Invalid or expired token',
                timestamp,
                path,
                requestId,
            },
        };
        return res.status(401).json(response);
    }
    // Handle unknown errors
    const response = {
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
            timestamp,
            path,
            requestId,
        },
    };
    res.status(500).json(response);
};
exports.globalErrorHandler = globalErrorHandler;
function handlePrismaError(err, res, timestamp, path, requestId) {
    let statusCode = 400;
    let code = 'DATABASE_ERROR';
    let message = 'Database operation failed';
    let details;
    switch (err.code) {
        case 'P2002':
            code = 'DUPLICATE_ENTRY';
            message = 'A record with this value already exists';
            details = { field: err.meta?.target };
            break;
        case 'P2025':
            statusCode = 404;
            code = 'NOT_FOUND';
            message = 'Record not found';
            break;
        case 'P2003':
            code = 'FOREIGN_KEY_CONSTRAINT';
            message = 'Related record not found';
            details = { field: err.meta?.field_name };
            break;
        case 'P2014':
            code = 'INVALID_RELATION';
            message = 'Invalid relationship between records';
            break;
        default:
            statusCode = 500;
            message = process.env.NODE_ENV === 'production'
                ? 'Database operation failed'
                : err.message;
    }
    const response = {
        success: false,
        error: {
            code,
            message,
            details,
            timestamp,
            path,
            requestId,
        },
    };
    res.status(statusCode).json(response);
}
// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
// Common error creators
exports.errors = {
    notFound: (resource) => new AppError(404, 'NOT_FOUND', `${resource} not found`),
    unauthorized: (message = 'Unauthorized access') => new AppError(401, 'UNAUTHORIZED', message),
    forbidden: (message = 'Access forbidden') => new AppError(403, 'FORBIDDEN', message),
    badRequest: (message, details) => new AppError(400, 'BAD_REQUEST', message, true, details),
    conflict: (message) => new AppError(409, 'CONFLICT', message),
    validation: (message, details) => new AppError(400, 'VALIDATION_ERROR', message, true, details),
    internal: (message = 'Internal server error') => new AppError(500, 'INTERNAL_ERROR', message, false),
};
//# sourceMappingURL=global-error-handler.js.map