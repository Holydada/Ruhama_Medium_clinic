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
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const userController = __importStar(require("../controllers/user.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed'));
            return;
        }
        cb(null, true);
    },
});
// All routes require authentication
router.use(auth_1.authenticate);
// Get doctors list (for appointments, etc.)
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await (await Promise.resolve().then(() => __importStar(require('../config/database')))).default.user.findMany({
            where: {
                role: 'DOCTOR',
                isActive: true,
                isApproved: true,
            },
            select: {
                id: true,
                fullName: true,
                department: true,
                phone: true,
            },
            orderBy: { fullName: 'asc' },
        });
        res.json({
            success: true,
            data: doctors,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch doctors',
        });
    }
});
// Get all staff (doctors, nurses, injection staff, ultrasound technicians)
router.get('/staff', async (req, res) => {
    try {
        const staff = await (await Promise.resolve().then(() => __importStar(require('../config/database')))).default.user.findMany({
            where: {
                role: {
                    in: ['DOCTOR', 'NURSE', 'INJECTION_NURSE', 'ULTRASOUND_TECHNICIAN'],
                },
                isActive: true,
                isApproved: true,
            },
            select: {
                id: true,
                fullName: true,
                role: true,
                department: true,
                phone: true,
            },
            orderBy: [{ role: 'asc' }, { fullName: 'asc' }],
        });
        // Group by role for easier frontend handling
        const groupedStaff = {
            doctors: staff.filter(s => s.role === 'DOCTOR'),
            nurses: staff.filter(s => s.role === 'NURSE'),
            injectionStaff: staff.filter(s => s.role === 'INJECTION_NURSE'),
            ultrasoundTechs: staff.filter(s => s.role === 'ULTRASOUND_TECHNICIAN'),
            all: staff,
        };
        res.json({
            success: true,
            data: groupedStaff,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch staff',
        });
    }
});
// Profile management
router.get('/profile', userController.getMyProfile);
router.patch('/profile', userController.updateMyProfile);
// Password management
router.post('/change-password', userController.changePassword);
// Email management
router.post('/request-email-change', userController.requestEmailChange);
router.post('/confirm-email-change', userController.confirmEmailChange);
// Photo management
router.post('/profile-photo', upload.single('photo'), userController.uploadProfilePhoto);
router.delete('/profile-photo', userController.deleteProfilePhoto);
exports.default = router;
//# sourceMappingURL=user.routes.js.map