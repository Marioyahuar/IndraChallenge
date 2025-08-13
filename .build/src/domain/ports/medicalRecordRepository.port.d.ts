import { MedicalRecord } from '../entities/medicalRecord.entity';
/**
 * Puerto para el repositorio de registros médicos por país
 * Maneja la persistencia en bases de datos específicas por región
 */
export interface MedicalRecordRepositoryPort {
    /**
     * Guarda un registro médico en la base de datos del país correspondiente
     * @param record - Registro médico a persistir
     * @returns ID generado del registro insertado
     */
    save(record: MedicalRecord): Promise<number>;
    /**
     * Busca registros médicos por país
     * @param countryISO - Código de país (PE/CL)
     * @returns Lista de registros médicos del país especificado
     */
    findByCountry(countryISO: 'PE' | 'CL'): Promise<MedicalRecord[]>;
}
//# sourceMappingURL=medicalRecordRepository.port.d.ts.map