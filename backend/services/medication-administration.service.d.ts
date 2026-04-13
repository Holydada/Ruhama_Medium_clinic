export declare class MedicationAdministrationService {
    getMAR(patientId: string, date?: Date): Promise<any[]>;
    recordAdministration(data: any): Promise<void>;
    getAdministrationHistory(patientId: string): Promise<any[]>;
    getAdministrationStats(patientId: string): Promise<{
        total: number;
        given: number;
        refused: number;
        held: number;
        missed: number;
    }>;
    getDueAdministrations(patientId?: string): Promise<any[]>;
}
export declare const medicationAdministrationService: MedicationAdministrationService;
//# sourceMappingURL=medication-administration.service.d.ts.map