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
exports.UserService = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = require("../utils/bcrypt");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class UserService {
    async getProfile(userId) {
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
                emailVerified: true,
                profilePhoto: true,
                createdAt: true,
                lastLogin: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async updateProfile(userId, data) {
        const updateData = {};
        if (data.fullName?.trim()) {
            updateData.fullName = data.fullName.trim();
        }
        if (data.phone !== undefined) {
            updateData.phone = data.phone?.trim() || null;
        }
        if (data.department !== undefined) {
            updateData.department = data.department?.trim() || null;
        }
        const user = await database_1.default.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                department: true,
                profilePhoto: true,
            },
        });
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = await (0, bcrypt_1.comparePassword)(currentPassword, user.passwordHash);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }
        const newPasswordHash = await (0, bcrypt_1.hashPassword)(newPassword);
        await database_1.default.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });
        // Log the password change
        await database_1.default.auditLog.create({
            data: {
                userId,
                action: 'PASSWORD_CHANGED',
                resource: 'users',
                resourceId: userId,
                newValues: { changedAt: new Date().toISOString() },
            },
        });
    }
    async requestEmailChange(userId, newEmail, password) {
        // Verify password
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { email: true, passwordHash: true, fullName: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = await (0, bcrypt_1.comparePassword)(password, user.passwordHash);
        if (!isValid) {
            throw new Error('Password is incorrect');
        }
        // Check if new email is already in use
        const existingUser = await database_1.default.user.findUnique({
            where: { email: newEmail.toLowerCase().trim() },
        });
        if (existingUser) {
            throw new Error('Email is already in use');
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        // Store the OTP
        await database_1.default.user.update({
            where: { id: userId },
            data: {
                emailVerificationToken: otp,
                verificationEmailSentAt: new Date(),
            },
        });
        // Store the new email in audit log
        await database_1.default.auditLog.create({
            data: {
                userId,
                action: 'EMAIL_CHANGE_REQUESTED',
                resource: 'users',
                resourceId: userId,
                oldValues: { currentEmail: user.email },
                newValues: {
                    newEmail: newEmail.toLowerCase().trim(),
                    otp,
                    expiresAt: otpExpiry.toISOString()
                },
            },
        });
        // Send OTP email to NEW email address
        const { EmailService } = await Promise.resolve().then(() => __importStar(require('./email.service')));
        const emailService = new EmailService();
        await emailService.sendEmailChangeOTP(newEmail.toLowerCase().trim(), user.fullName, otp);
        return { newEmail: newEmail.toLowerCase().trim() };
    }
    async confirmEmailChange(userId, otp) {
        // Find the user
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                emailVerificationToken: true,
                verificationEmailSentAt: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Find the email change request in audit logs
        const emailChangeRequest = await database_1.default.auditLog.findFirst({
            where: {
                userId,
                action: 'EMAIL_CHANGE_REQUESTED',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!emailChangeRequest) {
            throw new Error('No email change request found');
        }
        // Check if OTP matches
        if (user.emailVerificationToken !== otp) {
            throw new Error('Invalid OTP code');
        }
        // Check if OTP is expired (15 minutes)
        const newValues = emailChangeRequest.newValues;
        const expiresAt = new Date(newValues.expiresAt);
        if (expiresAt < new Date()) {
            throw new Error('OTP has expired. Please request a new one.');
        }
        const newEmail = newValues.newEmail;
        const oldEmail = emailChangeRequest.oldValues.currentEmail;
        // Check again if new email is still available
        const existingUser = await database_1.default.user.findUnique({
            where: { email: newEmail },
        });
        if (existingUser && existingUser.id !== userId) {
            throw new Error('Email is already in use');
        }
        // Update the email
        const updatedUser = await database_1.default.user.update({
            where: { id: userId },
            data: {
                email: newEmail,
                emailVerificationToken: null,
                verificationEmailSentAt: null,
                emailVerified: true,
                emailVerifiedAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        });
        // Log the successful email change
        await database_1.default.auditLog.create({
            data: {
                userId,
                action: 'EMAIL_CHANGED',
                resource: 'users',
                resourceId: userId,
                oldValues: { email: oldEmail },
                newValues: { email: newEmail },
            },
        });
        return updatedUser;
    }
    async uploadProfilePhoto(userId, file) {
        const uploadsDir = process.env.UPLOAD_DIR || './uploads';
        const profilePhotosDir = path_1.default.join(uploadsDir, 'profile-photos');
        // Ensure directory exists
        await promises_1.default.mkdir(profilePhotosDir, { recursive: true });
        // Generate unique filename
        const ext = path_1.default.extname(file.originalname);
        const filename = `${userId}-${Date.now()}${ext}`;
        const filepath = path_1.default.join(profilePhotosDir, filename);
        // Save file
        await promises_1.default.writeFile(filepath, file.buffer);
        // Delete old photo if exists
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { profilePhoto: true },
        });
        if (user?.profilePhoto) {
            // Remove leading slash and convert to proper path
            const relativePath = user.profilePhoto.replace(/^\//, '').replace(/\//g, path_1.default.sep);
            const oldPath = path_1.default.join(uploadsDir, relativePath);
            await promises_1.default.unlink(oldPath).catch(() => {
                // Ignore if file doesn't exist
            });
        }
        // Update user record - store relative path that works with both static and API serving
        const photoUrl = `/uploads/profile-photos/${filename}`;
        await database_1.default.user.update({
            where: { id: userId },
            data: { profilePhoto: photoUrl },
        });
        console.log(`[uploadProfilePhoto] ✅ Photo uploaded: ${photoUrl}`);
        console.log(`[uploadProfilePhoto] File saved to: ${filepath}`);
        return photoUrl;
    }
    async deleteProfilePhoto(userId) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { profilePhoto: true },
        });
        if (!user?.profilePhoto) {
            return;
        }
        // Delete file - handle path separators correctly
        const uploadsDir = process.env.UPLOAD_DIR || './uploads';
        const relativePath = user.profilePhoto.replace(/^\//, '').replace(/\//g, path_1.default.sep);
        const filepath = path_1.default.join(uploadsDir, relativePath);
        await promises_1.default.unlink(filepath).catch(() => {
            // Ignore if file doesn't exist
        });
        // Update user record
        await database_1.default.user.update({
            where: { id: userId },
            data: { profilePhoto: null },
        });
        console.log(`[deleteProfilePhoto] ✅ Photo deleted for user ${userId}`);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map