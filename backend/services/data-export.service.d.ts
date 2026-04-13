export declare class DataExportService {
    /**
     * Export patients to Excel
     */
    exportPatientsToExcel(filters?: any): Promise<Buffer>;
    /**
     * Export visits to Excel
     */
    exportVisitsToExcel(startDate: Date, endDate: Date): Promise<Buffer>;
    /**
     * Export financial report to Excel
     */
    exportFinancialReport(startDate: Date, endDate: Date): Promise<Buffer>;
    /**
     * Export lab orders to Excel
     */
    exportLabOrdersToExcel(startDate: Date, endDate: Date): Promise<Buffer>;
    /**
     * Export prescriptions to Excel
     */
    exportPrescriptionsToExcel(startDate: Date, endDate: Date): Promise<Buffer>;
    /**
     * Export inventory to Excel
     */
    exportInventoryToExcel(): Promise<Buffer>;
    /**
     * Export to CSV
     */
    exportToCSV(data: any[], fields: string[]): Promise<string>;
    /**
     * Generate patient report PDF
     */
    generatePatientReportPDF(patientId: string): Promise<Buffer>;
    /**
     * Calculate age from date of birth
     */
    private calculateAge;
}
export declare const dataExportService: DataExportService;
//# sourceMappingURL=data-export.service.d.ts.map