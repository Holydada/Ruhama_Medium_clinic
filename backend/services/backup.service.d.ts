interface BackupOptions {
    includeUploads?: boolean;
    compress?: boolean;
    encryption?: boolean;
}
export declare class BackupService {
    private backupDir;
    constructor();
    /**
     * Create full database backup
     */
    createBackup(options?: BackupOptions): Promise<string>;
    /**
     * Backup database using pg_dump
     */
    private backupDatabase;
    /**
     * Backup uploads directory
     */
    private backupUploads;
    /**
     * Create backup metadata
     */
    private createMetadata;
    /**
     * Compress backup directory
     */
    private compressBackup;
    /**
     * List all backups
     */
    listBackups(): Promise<Array<{
        name: string;
        size: number;
        created: Date;
        compressed: boolean;
    }>>;
    /**
     * Restore from backup
     */
    restoreBackup(backupName: string): Promise<void>;
    /**
     * Extract compressed backup
     */
    private extractBackup;
    /**
     * Restore database
     */
    private restoreDatabase;
    /**
     * Restore uploads
     */
    private restoreUploads;
    /**
     * Delete old backups
     */
    cleanOldBackups(retentionDays?: number): Promise<number>;
    /**
     * Copy directory recursively
     */
    private copyDirectory;
    /**
     * Export data to JSON
     */
    exportToJson(tables: string[]): Promise<any>;
    /**
     * Schedule automatic backups
     */
    scheduleBackups(intervalHours?: number): NodeJS.Timeout;
}
export declare const backupService: BackupService;
export {};
//# sourceMappingURL=backup.service.d.ts.map