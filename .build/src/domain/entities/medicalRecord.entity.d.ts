/**
 * Entidad de dominio que representa un registro médico
 * Almacenado en la base de datos específica por país
 */
export declare class MedicalRecord {
    readonly insuredId: string;
    readonly scheduleId: number;
    readonly countryISO: 'PE' | 'CL';
    readonly appointmentId: string;
    readonly createdAt?: Date | undefined;
    readonly id?: number | undefined;
    constructor(insuredId: string, scheduleId: number, countryISO: 'PE' | 'CL', appointmentId: string, createdAt?: Date | undefined, id?: number | undefined);
    /**
     * Valida los datos del registro médico según las reglas de negocio
     */
    private validateData;
    /**
     * Convierte la entidad a formato para persistencia en MySQL
     */
    toPersistence(): {
        insuredId: string;
        scheduleId: number;
        countryISO: 'PE' | 'CL';
        appointmentId: string;
    };
    /**
     * Crea un registro médico desde los datos de persistencia
     */
    static fromPersistence(data: any): MedicalRecord;
}
//# sourceMappingURL=medicalRecord.entity.d.ts.map