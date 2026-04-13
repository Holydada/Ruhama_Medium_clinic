"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileUpload = exports.preventSQLInjection = exports.commonSchemas = exports.validateRequest = exports.sanitizeObject = exports.sanitizeString = void 0;
const zod_1 = require("zod");
const global_error_handler_1 = require("./global-error-handler");
// Sanitize string inputs
const sanitizeString = (str) => {
    if (!str)
        return str;
    // Remove potential XSS attacks
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
};
exports.sanitizeString = sanitizeString;
// Sanitize object recursively
const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
        return (0, exports.sanitizeString)(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(exports.sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const key in obj) {
            sanitized[key] = (0, exports.sanitizeObject)(obj[key]);
        }
        return sanitized;
    }
    return obj;
};
exports.sanitizeObject = sanitizeObject;
// Validation middleware factory
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            // Sanitize inputs first
            if (req.body) {
                req.body = (0, exports.sanitizeObject)(req.body);
            }
            // Validate body
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            // Validate query
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query);
            }
            // Validate params
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const details = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                next(global_error_handler_1.errors.validation('Validation failed', details));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
// Common validation schemas
exports.commonSchemas = {
    id: zod_1.z.string().uuid('Invalid ID format'),
    email: zod_1.z.string().email('Invalid email format').toLowerCase(),
    phone: zod_1.z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
    date: zod_1.z.string().datetime('Invalid date format').or(zod_1.z.date()),
    pagination: zod_1.z.object({
        page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).optional(),
        limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive().max(100)).optional(),
    }),
    search: zod_1.z.object({
        q: zod_1.z.string().min(1).max(100).optional(),
    }),
};
// SQL injection prevention
const preventSQLInjection = (input) => {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
        /(--|;|\/\*|\*\/|xp_|sp_)/gi,
        /(\bOR\b.*=.*)/gi,
        /(\bAND\b.*=.*)/gi,
    ];
    return !sqlPatterns.some(pattern => pattern.test(input));
};
exports.preventSQLInjection = preventSQLInjection;
// Validate and sanitize file uploads
const validateFileUpload = (file, options = {}) => {
    const { maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'], allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'], } = options;
    // Check file size
    if (file.size > maxSize) {
        throw global_error_handler_1.errors.badRequest(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }
    // Check MIME type
    if (!allowedTypes.includes(file.mimetype)) {
        throw global_error_handler_1.errors.badRequest(`File type ${file.mimetype} not allowed`);
    }
    // Check extension
    const ext = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!ext || !allowedExtensions.includes(ext)) {
        throw global_error_handler_1.errors.badRequest(`File extension ${ext} not allowed`);
    }
    return true;
};
exports.validateFileUpload = validateFileUpload;
//# sourceMappingURL=input-validator.js.map