"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
exports.getEmailConfigStatus = getEmailConfigStatus;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = require("./email-templates");
/** Read env at use-time so SMTP works after dotenv loads (see server.ts import order). */
function readEnv() {
    return {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 465),
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
        fromName: process.env.EMAIL_FROM_NAME || 'Ruhama Clinic',
        adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        appBaseUrl: process.env.APP_BASE_URL ||
            process.env.FRONTEND_URL ||
            process.env.BASE_URL ||
            'http://localhost:5173',
    };
}
let transporterCache;
function getTransporter() {
    if (transporterCache !== undefined) {
        return transporterCache;
    }
    const { host, port, user, pass } = readEnv();
    if (!host || !user || !pass) {
        transporterCache = null;
        return null;
    }
    // 465 = SSL; 587 = STARTTLS
    const secureExplicit = process.env.EMAIL_SECURE;
    const secure = secureExplicit === 'true'
        ? true
        : secureExplicit === 'false'
            ? false
            : port === 465;
    transporterCache = nodemailer_1.default.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        // Always set TLS options for cPanel compatibility
        tls: {
            rejectUnauthorized: false // Accept self-signed certificates (common with cPanel)
        },
        // For port 587 (STARTTLS)
        ...(secure === false && port === 587
            ? {
                requireTLS: true,
            }
            : {}),
        // Enable debug logging
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development',
    });
    return transporterCache;
}
/** Exposed for /health — no secrets. */
function getEmailConfigStatus() {
    const { host, user, pass } = readEnv();
    if (host && user && pass) {
        return { configured: true };
    }
    return {
        configured: false,
        hint: 'Set EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD in backend/.env',
    };
}
const fromHeader = () => {
    const { user, fromName } = readEnv();
    return `"${fromName}" <${user}>`;
};
class EmailService {
    /** Sent right after a staff member submits self-registration (simple confirmation only). */
    async sendRegistrationReceivedEmail(toEmail, fullName, roleLabel) {
        const t = getTransporter();
        const { user, adminEmail } = readEnv();
        if (!t || !user) {
            console.warn('[email] SMTP not configured — skipping registration-received email.');
            console.warn('[email] Missing config:', { hasTransporter: !!t, hasUser: !!user });
            return;
        }
        console.log(`[email] Attempting to send registration email to ${toEmail}...`);
        try {
            await t.sendMail({
                from: fromHeader(),
                to: toEmail,
                replyTo: adminEmail,
                subject: 'Registration Received - Ruhama Metekiya Medium Clinic',
                html: (0, email_templates_1.registrationReceivedTemplate)((0, email_templates_1.escapeHtml)(fullName), (0, email_templates_1.escapeHtml)(roleLabel)),
            });
            console.log(`✅ [email] Registration received email sent successfully to ${toEmail}`);
        }
        catch (error) {
            console.error(`❌ [email] Failed to send registration email to ${toEmail}:`, error);
            throw error;
        }
    }
    /** Notify clinic admin that a new staff registration needs review. */
    async sendAdminNewRegistrationAlert(applicantEmail, fullName, roleLabel) {
        const t = getTransporter();
        const { user, adminEmail, appBaseUrl } = readEnv();
        if (!t || !user || !adminEmail) {
            console.warn('[email] SMTP not configured — skipping admin alert email.');
            return;
        }
        const adminDashboardUrl = `${appBaseUrl.replace(/\/$/, '')}/admin/approvals`;
        await t.sendMail({
            from: fromHeader(),
            to: adminEmail,
            replyTo: user,
            subject: `[Action Required] New Staff Registration: ${fullName}`,
            html: (0, email_templates_1.adminNewRegistrationTemplate)((0, email_templates_1.escapeHtml)(applicantEmail), (0, email_templates_1.escapeHtml)(fullName), (0, email_templates_1.escapeHtml)(roleLabel), adminDashboardUrl),
        });
        console.log(`[email] Admin alert sent to ${adminEmail}`);
    }
    /** Sent after admin approves the user — includes the email verification link. */
    async sendApprovalAndVerificationEmail(toEmail, fullName, token) {
        const t = getTransporter();
        const { user, adminEmail, appBaseUrl } = readEnv();
        if (!t || !user) {
            console.warn('[email] SMTP not configured — skipping approval / verification email.');
            console.warn('[email] Missing config:', { hasTransporter: !!t, hasUser: !!user });
            return;
        }
        console.log(`[email] Attempting to send approval email to ${toEmail}...`);
        const verificationUrl = `${appBaseUrl.replace(/\/$/, '')}/verify-email?token=${encodeURIComponent(token)}`;
        try {
            await t.sendMail({
                from: fromHeader(),
                to: toEmail,
                replyTo: adminEmail,
                subject: '✅ Account Approved - Activate Your Access',
                html: (0, email_templates_1.approvalAndVerificationTemplate)((0, email_templates_1.escapeHtml)(fullName), verificationUrl),
            });
            console.log(`✅ [email] Approval / verification email sent successfully to ${toEmail}`);
        }
        catch (error) {
            console.error(`❌ [email] Failed to send approval email to ${toEmail}:`, error);
            throw error;
        }
    }
    /** Send email change OTP to the NEW email address. */
    async sendEmailChangeOTP(newEmail, fullName, otp) {
        const t = getTransporter();
        const { user, adminEmail } = readEnv();
        if (!t || !user) {
            console.warn('[email] SMTP not configured — skipping email change OTP.');
            console.warn('[email] Missing config:', { hasTransporter: !!t, hasUser: !!user });
            return;
        }
        console.log(`[email] Attempting to send email change OTP to ${newEmail}...`);
        try {
            await t.sendMail({
                from: fromHeader(),
                to: newEmail,
                replyTo: adminEmail,
                subject: '🔐 Your Email Change OTP - Ruhama Clinic',
                html: (0, email_templates_1.emailChangeOTPTemplate)((0, email_templates_1.escapeHtml)(fullName), (0, email_templates_1.escapeHtml)(newEmail), otp),
            });
            console.log(`✅ [email] Email change OTP sent successfully to ${newEmail}`);
        }
        catch (error) {
            console.error(`❌ [email] Failed to send email change OTP to ${newEmail}:`, error);
            throw error;
        }
    }
    /** Send first login OTP after admin approval. */
    async sendFirstLoginOTP(toEmail, fullName, otp) {
        const t = getTransporter();
        const { user, adminEmail } = readEnv();
        if (!t || !user) {
            console.warn('[email] SMTP not configured — skipping first login OTP.');
            console.warn('[email] Missing config:', { hasTransporter: !!t, hasUser: !!user });
            return;
        }
        console.log(`[email] Attempting to send first login OTP to ${toEmail}...`);
        try {
            await t.sendMail({
                from: fromHeader(),
                to: toEmail,
                replyTo: adminEmail,
                subject: '🎉 Account Approved - Your First Login OTP',
                html: (0, email_templates_1.firstLoginOTPTemplate)((0, email_templates_1.escapeHtml)(fullName), (0, email_templates_1.escapeHtml)(toEmail), otp),
            });
            console.log(`✅ [email] First login OTP sent successfully to ${toEmail}`);
        }
        catch (error) {
            console.error(`❌ [email] Failed to send first login OTP to ${toEmail}:`, error);
            throw error;
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map