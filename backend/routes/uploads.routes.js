"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const router = (0, express_1.Router)();
// Serve profile photos
router.get('/profile-photos/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        // Security: prevent directory traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            res.status(400).json({ success: false, error: 'Invalid filename' });
            return;
        }
        const uploadsDir = process.env.UPLOAD_DIR || './uploads';
        const filepath = path_1.default.join(uploadsDir, 'profile-photos', filename);
        // Check if file exists
        try {
            await promises_1.default.access(filepath);
        }
        catch {
            res.status(404).json({ success: false, error: 'Photo not found' });
            return;
        }
        // Determine content type
        const ext = path_1.default.extname(filename).toLowerCase();
        const contentTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';
        // Set headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        // Send file
        res.sendFile(path_1.default.resolve(filepath));
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to serve photo' });
    }
});
exports.default = router;
//# sourceMappingURL=uploads.routes.js.map