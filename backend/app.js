"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
const errorHandler_1 = require("./middleware/errorHandler");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const visit_routes_1 = __importDefault(require("./routes/visit.routes"));
const prescription_routes_1 = __importDefault(require("./routes/prescription.routes"));
const lab_routes_1 = __importDefault(require("./routes/lab.routes"));
const pharmacy_routes_1 = __importDefault(require("./routes/pharmacy.routes"));
const ultrasound_routes_1 = __importDefault(require("./routes/ultrasound.routes"));
const injection_routes_1 = __importDefault(require("./routes/injection.routes"));
const finance_routes_1 = __importDefault(require("./routes/finance.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const patientPortal_routes_1 = __importDefault(require("./routes/patientPortal.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const uploads_routes_1 = __importDefault(require("./routes/uploads.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
// New module routes
const nurse_routes_1 = __importDefault(require("./routes/nurse.routes"));
const emergency_routes_1 = __importDefault(require("./routes/emergency.routes"));
const doctor_routes_1 = __importDefault(require("./routes/doctor.routes"));
const certificate_routes_1 = __importDefault(require("./routes/certificate.routes"));
// import inventoryRoutes from './routes/inventory.routes'; // Temporarily disabled
// import cdsRoutes from './routes/clinical-decision-support.routes'; // Temporarily disabled
// import monitoringRoutes from './routes/monitoring.routes'; // Temporarily disabled
// import exportRoutes from './routes/export.routes'; // Temporarily disabled
// import qaRoutes from './routes/qa.routes'; // Temporarily disabled
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const performance_monitor_1 = require("./middleware/performance-monitor");
const audit_logger_service_1 = require("./services/audit-logger.service");
const app = (0, express_1.default)();
// Behind reverse proxy (nginx, etc.) so rate limits and IPs are correct
if (process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}
// Security middleware — API-only; relax dev CSP; tighten in production
const isProd = process.env.NODE_ENV === 'production';
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images from different origin
    contentSecurityPolicy: isProd
        ? {
            directives: {
                defaultSrc: ["'none'"],
                baseUri: ["'none'"],
                frameAncestors: ["'none'"],
            },
        }
        : false,
    hsts: isProd
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: false,
        }
        : false,
}));
const defaultCorsOrigins = ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:3000'];
const corsOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) || defaultCorsOrigins;
app.use((0, cors_1.default)({
    origin: corsOrigins,
    credentials: true,
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve uploaded files with proper MIME types and CORS headers
app.use('/uploads', (req, res, next) => {
    // Add CORS headers for images
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express_1.default.static(process.env.UPLOAD_DIR || './uploads', {
    setHeaders: (res, filePath) => {
        // Set proper content type based on file extension
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        }
        else if (filePath.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        }
        else if (filePath.endsWith('.gif')) {
            res.setHeader('Content-Type', 'image/gif');
        }
        else if (filePath.endsWith('.webp')) {
            res.setHeader('Content-Type', 'image/webp');
        }
        // Enable caching for better performance
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    },
}));
// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// Performance monitoring
app.use(performance_monitor_1.performanceMiddleware);
// Audit logging (after auth routes)
app.use(audit_logger_service_1.auditMiddleware);
// Health check (liveness + database readiness for load balancers / clinic IT)
app.get('/health', async (_req, res) => {
    const base = {
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: 'unknown',
    };
    try {
        await database_1.default.$queryRaw `SELECT 1`;
        base.database = 'ok';
        const { getEmailConfigStatus } = await Promise.resolve().then(() => __importStar(require('./services/email.service')));
        const email = getEmailConfigStatus();
        res.json({
            ...base,
            email: email.configured ? 'configured' : 'not_configured',
            ...(email.hint ? { emailHint: email.hint } : {}),
        });
    }
    catch {
        res.status(503).json({
            ...base,
            success: false,
            database: 'error',
            error: 'Database unreachable',
        });
    }
});
// API routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/patients', patient_routes_1.default);
app.use('/api/v1/visits', visit_routes_1.default);
app.use('/api/v1/prescriptions', prescription_routes_1.default);
app.use('/api/v1/lab', lab_routes_1.default);
app.use('/api/v1/pharmacy', pharmacy_routes_1.default);
app.use('/api/v1/ultrasound', ultrasound_routes_1.default);
app.use('/api/v1/injections', injection_routes_1.default);
app.use('/api/v1/finance', finance_routes_1.default);
app.use('/api/v1/notifications', notification_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
app.use('/api/v1/chat', chat_routes_1.default);
app.use('/api/v1/patient-portal', patientPortal_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/uploads', uploads_routes_1.default);
app.use('/api/v1/appointments', appointment_routes_1.default);
// New module routes
app.use('/api/v1/nurse', nurse_routes_1.default);
app.use('/api/v1/emergency', emergency_routes_1.default);
app.use('/api/v1/doctor', doctor_routes_1.default);
app.use('/api/v1/certificates', certificate_routes_1.default);
// app.use('/api/v1/inventory', inventoryRoutes); // Temporarily disabled due to TypeScript errors
// app.use('/api/v1/cds', cdsRoutes); // Temporarily disabled due to TypeScript errors
// app.use('/api/v1/monitoring', monitoringRoutes); // Temporarily disabled due to TypeScript errors
// app.use('/api/v1/export', exportRoutes); // Temporarily disabled due to TypeScript errors
// app.use('/api/v1/qa', qaRoutes); // Temporarily disabled due to TypeScript errors
app.use('/api/v1/contact', contact_routes_1.default);
// 404 handler
app.use(errorHandler_1.notFoundHandler);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map