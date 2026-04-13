"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfilePhoto = exports.uploadProfilePhoto = exports.confirmEmailChange = exports.requestEmailChange = exports.changePassword = exports.updateMyProfile = exports.getMyProfile = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
const getMyProfile = async (req, res) => {
    try {
        const profile = await userService.getProfile(req.user.id);
        res.json({ success: true, data: profile });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch profile',
        });
    }
};
exports.getMyProfile = getMyProfile;
const updateMyProfile = async (req, res) => {
    try {
        const { fullName, phone, department } = req.body;
        const profile = await userService.updateProfile(req.user.id, {
            fullName,
            phone,
            department,
        });
        res.json({
            success: true,
            data: profile,
            message: 'Profile updated successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to update profile',
        });
    }
};
exports.updateMyProfile = updateMyProfile;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                error: 'Current password and new password are required',
            });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({
                success: false,
                error: 'New password must be at least 6 characters',
            });
            return;
        }
        await userService.changePassword(req.user.id, currentPassword, newPassword);
        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to change password',
        });
    }
};
exports.changePassword = changePassword;
const requestEmailChange = async (req, res) => {
    try {
        const { newEmail, password } = req.body;
        console.log(`[requestEmailChange] User ${req.user.id} requesting email change to ${newEmail}`);
        if (!newEmail || !password) {
            res.status(400).json({
                success: false,
                error: 'New email and password are required',
            });
            return;
        }
        await userService.requestEmailChange(req.user.id, newEmail, password);
        console.log(`[requestEmailChange] ✅ OTP sent successfully to ${newEmail}`);
        res.json({
            success: true,
            message: 'OTP sent to your new email address',
        });
    }
    catch (error) {
        console.error(`[requestEmailChange] ❌ Error:`, error.message);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to request email change',
        });
    }
};
exports.requestEmailChange = requestEmailChange;
const confirmEmailChange = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log(`[confirmEmailChange] User ${req.user.id} verifying OTP: ${otp}`);
        if (!otp) {
            res.status(400).json({
                success: false,
                error: 'OTP code is required',
            });
            return;
        }
        const result = await userService.confirmEmailChange(req.user.id, otp);
        console.log(`[confirmEmailChange] ✅ Email changed successfully to ${result.email}`);
        res.json({
            success: true,
            data: result,
            message: 'Email changed successfully',
        });
    }
    catch (error) {
        console.error(`[confirmEmailChange] ❌ Error:`, error.message);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to confirm email change',
        });
    }
};
exports.confirmEmailChange = confirmEmailChange;
const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: 'No file uploaded',
            });
            return;
        }
        const photoUrl = await userService.uploadProfilePhoto(req.user.id, req.file);
        res.json({
            success: true,
            data: { photoUrl },
            message: 'Profile photo uploaded successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to upload photo',
        });
    }
};
exports.uploadProfilePhoto = uploadProfilePhoto;
const deleteProfilePhoto = async (req, res) => {
    try {
        await userService.deleteProfilePhoto(req.user.id);
        res.json({
            success: true,
            message: 'Profile photo deleted successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to delete photo',
        });
    }
};
exports.deleteProfilePhoto = deleteProfilePhoto;
//# sourceMappingURL=user.controller.js.map