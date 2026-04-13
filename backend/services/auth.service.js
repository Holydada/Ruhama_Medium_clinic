"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const email_service_1 = require("./email.service");
const emailService = new email_service_1.EmailService();
function roleLabel(role) {
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
class AuthService {
    async register(data) {
        // Check if user already exists
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        // Hash password
        const passwordHash = await (0, bcrypt_1.hashPassword)(data.password);
        // Create user
        const user = await database_1.default.user.create({
            data: {
                email: data.email,
                passwordHash,
                fullName: data.fullName,
                phone: data.phone,
                role: data.role,
                department: data.department,
                employmentType: data.employmentType,
                isActive: false,
                isApproved: false,
                emailVerified: false,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isApproved: true,
                createdAt: true,
            },
        });
        try {
            await emailService.sendRegistrationReceivedEmail(user.email, user.fullName, roleLabel(user.role));
            console.log(`✅ Registration email sent successfully to ${user.email}`);
        }
        catch (e) {
            console.error('❌ Registration notification email failed:', e);
            console.error('Email error details:', {
                error: e instanceof Error ? e.message : String(e),
                stack: e instanceof Error ? e.stack : undefined,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            });
        }
        try {
            await emailService.sendAdminNewRegistrationAlert(user.email, user.fullName, roleLabel(user.role));
            console.log(`✅ Admin alert email sent successfully`);
        }
        catch (e) {
            console.error('❌ Admin alert email failed:', e);
            console.error('Admin email error details:', {
                error: e instanceof Error ? e.message : String(e),
                stack: e instanceof Error ? e.stack : undefined,
            });
        }
        return user;
    }
    async registerPatientPortal(data) {
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const card = data.cardNumber.trim().toUpperCase();
        const patient = await database_1.default.patient.findUnique({
            where: { cardNumber: card },
        });
        if (!patient) {
            throw new Error('No clinic record found for this card number. Please register at reception first, then link your portal account.');
        }
        if (patient.fullName.trim().toLowerCase() !== data.fullName.trim().toLowerCase()) {
            throw new Error('Full name does not match our records for this card number');
        }
        const incomingYmd = data.dateOfBirth.trim().slice(0, 10);
        const storedYmd = new Date(patient.dateOfBirth).toISOString().slice(0, 10);
        if (incomingYmd !== storedYmd) {
            throw new Error('Date of birth does not match our records');
        }
        const alreadyLinked = await database_1.default.user.findFirst({
            where: { patientLinkId: patient.id },
        });
        if (alreadyLinked) {
            throw new Error('A portal account is already linked to this patient record');
        }
        const passwordHash = await (0, bcrypt_1.hashPassword)(data.password);
        const user = await database_1.default.user.create({
            data: {
                email: data.email,
                passwordHash,
                fullName: data.fullName.trim(),
                role: client_1.UserRole.PATIENT,
                patientLinkId: patient.id,
                isApproved: true,
                isActive: true,
                emailVerified: true,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true,
            },
        });
        return user;
    }
    /** Profile + clinical / supervision flags for API responses. */
    async enrichUserForClient(userId) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
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
                profilePhoto: true,
                createdAt: true,
                patientLinkId: true,
                clinicalPersonaUserId: true,
                supervisedByUserId: true,
                supervisedBy: { select: { id: true, fullName: true, role: true } },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const linkedAdmin = user.role === client_1.UserRole.DOCTOR
            ? await database_1.default.user.findFirst({
                where: { clinicalPersonaUserId: user.id, role: 'SUPER_ADMIN' },
                select: { id: true, fullName: true, email: true },
            })
            : null;
        return {
            ...user,
            canSwitchToClinical: user.role === client_1.UserRole.SUPER_ADMIN && Boolean(user.clinicalPersonaUserId),
            canSwitchToAdmin: Boolean(linkedAdmin),
            linkedAdmin: linkedAdmin ?? undefined,
        };
    }
    async login(email, password, otp) {
        // Find user
        const user = await database_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // Check if approved
        if (!user.isApproved) {
            throw new Error('Account pending approval');
        }
        // Check if active
        if (!user.isActive) {
            throw new Error('Account is inactive');
        }
        // Verify password
        const isValidPassword = await (0, bcrypt_1.comparePassword)(password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        // Check if this is first login (emailVerified = false and has OTP)
        const isFirstLogin = !user.emailVerified && user.emailVerificationToken;
        if (isFirstLogin) {
            // First login requires OTP
            if (!otp) {
                throw new Error('FIRST_LOGIN_OTP_REQUIRED');
            }
            // Verify OTP
            if (user.emailVerificationToken !== otp) {
                throw new Error('Invalid OTP code');
            }
            // Check OTP expiry (24 hours from approval)
            const otpAge = Date.now() - (user.verificationEmailSentAt?.getTime() || 0);
            const twentyFourHours = 24 * 60 * 60 * 1000;
            if (otpAge > twentyFourHours) {
                throw new Error('OTP has expired. Please contact administrator.');
            }
            // OTP verified - mark email as verified and clear OTP
            await database_1.default.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                    emailVerificationToken: null,
                    verificationEmailSentAt: null,
                },
            });
            console.log(`✅ [auth] First login OTP verified for ${user.email}`);
        }
        const requireEmailVerified = process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === 'true' ||
            process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === '1';
        if (requireEmailVerified && !user.emailVerified && !isFirstLogin) {
            throw new Error('Please verify your email before login');
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
            patientId: user.patientLinkId || undefined,
        });
        // Update last login
        await database_1.default.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        // Create session
        await database_1.default.userSession.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });
        const profile = await this.enrichUserForClient(user.id);
        return {
            user: profile,
            token,
            expiresIn: 86400,
        };
    }
    /** Super admin switches into their linked doctor account (same browser session token swap). */
    async switchToClinicalPersona(superAdminUserId) {
        const admin = await database_1.default.user.findUnique({
            where: { id: superAdminUserId },
            select: {
                id: true,
                role: true,
                clinicalPersonaUserId: true,
                isActive: true,
                isApproved: true,
                emailVerified: true,
            },
        });
        if (!admin || admin.role !== client_1.UserRole.SUPER_ADMIN) {
            throw new Error('Only super admins can switch to a clinical account');
        }
        if (!admin.clinicalPersonaUserId) {
            throw new Error('No linked doctor account is configured for this admin');
        }
        const requireEmailVerified = process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === 'true' ||
            process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === '1';
        if (!admin.isActive || !admin.isApproved || (requireEmailVerified && !admin.emailVerified)) {
            throw new Error('Admin account is not allowed to switch sessions');
        }
        const doctor = await database_1.default.user.findUnique({
            where: { id: admin.clinicalPersonaUserId },
        });
        if (!doctor || doctor.role !== client_1.UserRole.DOCTOR) {
            throw new Error('Linked clinical account is missing or not a doctor');
        }
        if (!doctor.isActive || !doctor.isApproved || (requireEmailVerified && !doctor.emailVerified)) {
            throw new Error('Doctor account is inactive or not verified');
        }
        const token = (0, jwt_1.generateToken)({
            id: doctor.id,
            email: doctor.email,
            role: doctor.role,
            patientId: undefined,
        });
        await database_1.default.userSession.create({
            data: {
                userId: doctor.id,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        const user = await this.enrichUserForClient(doctor.id);
        return { user, token, expiresIn: 86400 };
    }
    /** Linked doctor switches back to their super admin account. */
    async switchToAdminPersona(doctorUserId) {
        const admin = await database_1.default.user.findFirst({
            where: { clinicalPersonaUserId: doctorUserId, role: client_1.UserRole.SUPER_ADMIN },
        });
        if (!admin) {
            throw new Error('No super admin account is linked to this doctor login');
        }
        const requireEmailVerified = process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === 'true' ||
            process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === '1';
        if (!admin.isActive || !admin.isApproved || (requireEmailVerified && !admin.emailVerified)) {
            throw new Error('Admin account is not available');
        }
        const token = (0, jwt_1.generateToken)({
            id: admin.id,
            email: admin.email,
            role: admin.role,
            patientId: undefined,
        });
        await database_1.default.userSession.create({
            data: {
                userId: admin.id,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        const user = await this.enrichUserForClient(admin.id);
        return { user, token, expiresIn: 86400 };
    }
    async logout(token) {
        await database_1.default.userSession.deleteMany({
            where: { token },
        });
    }
    async getCurrentUser(userId) {
        return this.enrichUserForClient(userId);
    }
    async verifyEmail(token) {
        const user = await database_1.default.user.findFirst({
            where: {
                emailVerificationToken: token,
                isApproved: true,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        });
        if (!user) {
            throw new Error('Invalid or expired verification token');
        }
        await database_1.default.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerifiedAt: new Date(),
                emailVerificationToken: null,
            },
        });
        return user;
    }
    async getDoctors() {
        return database_1.default.user.findMany({
            where: {
                role: 'DOCTOR',
                isActive: true,
                isApproved: true,
            },
            select: {
                id: true,
                fullName: true,
                department: true,
                employmentType: true,
            },
            orderBy: { fullName: 'asc' },
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map