import { MedicalRecord } from '../../domain/entities/medicalRecord.entity';
import { MedicalRecordRepositoryPort } from '../../domain/ports/medicalRecordRepository.port';
/**
 * Adaptador de infraestructura para MySQL
 * Implementa el puerto del repositorio de registros médicos usando MySQL por país
 */
export declare class MySqlMedicalRecordRepositoryAdapter implements MedicalRecordRepositoryPort {
    private connectionConfig;
    constructor(countryISO: 'PE' | 'CL');
    /**
     * Guarda un registro médico en la base de datos del país correspondiente
     * @param record - Entidad de registro médico a persistir
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
//# sourceMappingURL=mysqlMedicalRecordRepository.adapter.d.ts.map