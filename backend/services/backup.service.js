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
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupService = exports.BackupService = void 0;
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const prisma = new client_1.PrismaClient();
class BackupService {
    backupDir = path.join(process.cwd(), 'backups');
    constructor() {
        // Ensure backup directory exists
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }
    /**
     * Create full database backup
     */
    async createBackup(options = {}) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup_${timestamp}`;
        const backupPath = path.join(this.backupDir, backupName);
        try {
            // Create backup directory
            fs.mkdirSync(backupPath, { recursive: true });
            // Backup database
            await this.backupDatabase(backupPath);
            // Backup uploads if requested
            if (options.includeUploads) {
                await this.backupUploads(backupPath);
            }
            // Create metadata file
            await this.createMetadata(backupPath, options);
            // Compress if requested
            if (options.compress) {
                await this.compressBackup(backupPath);
            }
            console.log(`Backup created successfully: ${backupName}`);
            return backupName;
        }
        catch (error) {
            console.error('Backup failed:', error);
            throw error;
        }
    }
    /**
     * Backup database using pg_dump
     */
    async backupDatabase(backupPath) {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL not configured');
        }
        const outputFile = path.join(backupPath, 'database.sql');
        // For PostgreSQL
        if (dbUrl.includes('postgresql')) {
            const command = `pg_dump "${dbUrl}" > "${outputFile}"`;
            await execAsync(command);
        }
        // For MySQL
        else if (dbUrl.includes('mysql')) {
            const command = `mysqldump "${dbUrl}" > "${outputFile}"`;
            await execAsync(command);
        }
        // For SQLite (development)
        else if (dbUrl.includes('sqlite')) {
            const dbFile = dbUrl.replace('file:', '');
            fs.copyFileSync(dbFile, outputFile);
        }
    }
    /**
     * Backup uploads directory
     */
    async backupUploads(backupPath) {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const backupUploadsDir = path.join(backupPath, 'uploads');
        if (fs.existsSync(uploadsDir)) {
            await this.copyDirectory(uploadsDir, backupUploadsDir);
        }
    }
    /**
     * Create backup metadata
     */
    async createMetadata(backupPath, options) {
        const metadata = {
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            options,
            stats: {
                patients: await prisma.patient.count(),
                visits: await prisma.visit.count(),
                prescriptions: await prisma.prescription.count(),
                labOrders: await prisma.labOrder.count(),
                users: await prisma.user.count(),
            },
        };
        const metadataFile = path.join(backupPath, 'metadata.json');
        fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
    }
    /**
     * Compress backup directory
     */
    async compressBackup(backupPath) {
        const archivePath = `${backupPath}.tar.gz`;
        const command = `tar -czf "${archivePath}" -C "${path.dirname(backupPath)}" "${path.basename(backupPath)}"`;
        await execAsync(command);
        // Remove uncompressed directory
        fs.rmSync(backupPath, { recursive: true, force: true });
    }
    /**
     * List all backups
     */
    async listBackups() {
        const files = fs.readdirSync(this.backupDir);
        return files
            .filter(file => file.startsWith('backup_'))
            .map(file => {
            const filePath = path.join(this.backupDir, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                size: stats.size,
                created: stats.birthtime,
                compressed: file.endsWith('.tar.gz'),
            };
        })
            .sort((a, b) => b.created.getTime() - a.created.getTime());
    }
    /**
     * Restore from backup
     */
    async restoreBackup(backupName) {
        const backupPath = path.join(this.backupDir, backupName);
        if (!fs.existsSync(backupPath)) {
            throw new Error(`Backup not found: ${backupName}`);
        }
        try {
            // If compressed, extract first
            let extractedPath = backupPath;
            if (backupName.endsWith('.tar.gz')) {
                await this.extractBackup(backupPath);
                extractedPath = backupPath.replace('.tar.gz', '');
            }
            // Restore database
            await this.restoreDatabase(extractedPath);
            // Restore uploads
            await this.restoreUploads(extractedPath);
            console.log(`Backup restored successfully: ${backupName}`);
        }
        catch (error) {
            console.error('Restore failed:', error);
            throw error;
        }
    }
    /**
     * Extract compressed backup
     */
    async extractBackup(archivePath) {
        const command = `tar -xzf "${archivePath}" -C "${this.backupDir}"`;
        await execAsync(command);
    }
    /**
     * Restore database
     */
    async restoreDatabase(backupPath) {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL not configured');
        }
        const sqlFile = path.join(backupPath, 'database.sql');
        if (!fs.existsSync(sqlFile)) {
            throw new Error('Database backup file not found');
        }
        // For PostgreSQL
        if (dbUrl.includes('postgresql')) {
            const command = `psql "${dbUrl}" < "${sqlFile}"`;
            await execAsync(command);
        }
        // For MySQL
        else if (dbUrl.includes('mysql')) {
            const command = `mysql "${dbUrl}" < "${sqlFile}"`;
            await execAsync(command);
        }
        // For SQLite
        else if (dbUrl.includes('sqlite')) {
            const dbFile = dbUrl.replace('file:', '');
            fs.copyFileSync(sqlFile, dbFile);
        }
    }
    /**
     * Restore uploads
     */
    async restoreUploads(backupPath) {
        const backupUploadsDir = path.join(backupPath, 'uploads');
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (fs.existsSync(backupUploadsDir)) {
            // Remove existing uploads
            if (fs.existsSync(uploadsDir)) {
                fs.rmSync(uploadsDir, { recursive: true, force: true });
            }
            // Copy backup uploads
            await this.copyDirectory(backupUploadsDir, uploadsDir);
        }
    }
    /**
     * Delete old backups
     */
    async cleanOldBackups(retentionDays = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        const backups = await this.listBackups();
        let deletedCount = 0;
        for (const backup of backups) {
            if (backup.created < cutoffDate) {
                const backupPath = path.join(this.backupDir, backup.name);
                fs.rmSync(backupPath, { recursive: true, force: true });
                deletedCount++;
            }
        }
        return deletedCount;
    }
    /**
     * Copy directory recursively
     */
    async copyDirectory(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            }
            else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    /**
     * Export data to JSON
     */
    async exportToJson(tables) {
        const data = {};
        for (const table of tables) {
            try {
                // @ts-ignore - Dynamic table access
                data[table] = await prisma[table].findMany();
            }
            catch (error) {
                console.error(`Error exporting table ${table}:`, error);
            }
        }
        return data;
    }
    /**
     * Schedule automatic backups
     */
    scheduleBackups(intervalHours = 24) {
        const intervalMs = intervalHours * 60 * 60 * 1000;
        return setInterval(async () => {
            try {
                console.log('Starting scheduled backup...');
                await this.createBackup({ includeUploads: true, compress: true });
                await this.cleanOldBackups(30);
            }
            catch (error) {
                console.error('Scheduled backup failed:', error);
            }
        }, intervalMs);
    }
}
exports.BackupService = BackupService;
exports.backupService = new BackupService();
//# sourceMappingURL=backup.service.js.map