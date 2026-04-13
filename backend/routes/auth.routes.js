"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const rateLimiters_1 = require("../middleware/rateLimiters");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    fullName: zod_1.z.string().min(2, 'Full name is required'),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum(['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECH', 'FINANCE', 'EMERGENCY', 'INJECTION_ROOM']),
    department: zod_1.z.string().optional(),
    employmentType: zod_1.z.enum(['FULL_TIME', 'PART_TIME']).optional(),
});
const registerPatientSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    fullName: zod_1.z.string().min(2, 'Full name is required'),
    cardNumber: zod_1.z.string().min(3, 'Clinic card number is required'),
    dateOfBirth: zod_1.z.string().min(8, 'Date of birth is required'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Routes (rate limits reduce brute-force and spam registrations)
router.post('/register', rateLimiters_1.registerRateLimiter, (0, validation_1.validate)(registerSchema), authController.register.bind(authController));
router.post('/register-patient', rateLimiters_1.registerRateLimiter, (0, validation_1.validate)(registerPatientSchema), authController.registerPatient.bind(authController));
router.post('/login', rateLimiters_1.loginRateLimiter, (0, validation_1.validate)(loginSchema), authController.login.bind(authController));
router.post('/logout', auth_1.authenticate, authController.logout.bind(authController));
router.get('/me', auth_1.authenticate, authController.me.bind(authController));
router.get('/verify-email', authController.verifyEmail.bind(authController));
router.get('/doctors', auth_1.authenticate, authController.getDoctors.bind(authController));
router.post('/switch-clinical', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN'), authController.switchToClinical.bind(authController));
router.post('/switch-admin', auth_1.authenticate, (0, auth_1.authorize)('DOCTOR'), authController.switchToAdmin.bind(authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map