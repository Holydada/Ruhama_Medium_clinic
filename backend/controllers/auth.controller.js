"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Registration submitted for approval',
                data: user,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async registerPatient(req, res) {
        try {
            const user = await authService.registerPatientPortal(req.body);
            res.status(201).json({
                success: true,
                message: 'Patient portal account created. You can sign in now.',
                data: user,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password, otp } = req.body;
            const result = await authService.login(email, password, otp);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            // Special handling for first login OTP required
            if (error.message === 'FIRST_LOGIN_OTP_REQUIRED') {
                res.status(403).json({
                    success: false,
                    error: 'First login OTP required',
                    errorCode: 'OTP_REQUIRED',
                    requiresOTP: true,
                });
                return;
            }
            res.status(401).json({
                success: false,
                error: error.message,
                errorCode: 'AUTH_FAILED'
            });
        }
    }
    async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                await authService.logout(token);
            }
            res.json({
                success: true,
                message: 'Logged out successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    async me(req, res) {
        try {
            const user = await authService.getCurrentUser(req.user.id);
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    async verifyEmail(req, res) {
        try {
            const token = String(req.query.token || '').trim();
            if (!token) {
                res.status(400).json({
                    success: false,
                    error: 'Verification token is required',
                });
                return;
            }
            const user = await authService.verifyEmail(token);
            res.json({
                success: true,
                message: 'Email verified successfully',
                data: user,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getDoctors(_req, res) {
        try {
            const doctors = await authService.getDoctors();
            res.json({
                success: true,
                data: doctors,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    async switchToClinical(req, res) {
        try {
            const result = await authService.switchToClinicalPersona(req.user.id);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async switchToAdmin(req, res) {
        try {
            const result = await authService.switchToAdminPersona(req.user.id);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map