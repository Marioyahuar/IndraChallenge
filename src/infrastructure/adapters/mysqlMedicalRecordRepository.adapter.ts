import mysql from 'mysql2/promise';
import { MedicalRecord } from '../../domain/entities/medicalRecord.entity';
import { MedicalRecordRepositoryPort } from '../../domain/ports/medicalRecordRepository.port';

/**
 * Adaptador de infraestructura para MySQL
 * Implementa el puerto del repositorio de registros médicos usando MySQL por país
 */
export class MySqlMedicalRecordRepositoryAdapter implements MedicalRecordRepositoryPort {
  private connectionConfig: mysql.ConnectionOptions;

  constructor(countryISO: 'PE' | 'CL') {
    // Seleccionar base de datos según el país
    const database = countryISO === 'PE' ? 'appointments_pe' : 'appointments_cl';
    
    this.connectionConfig = {
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    };
  }

  /**
   * Guarda un registro médico en la base de datos del país correspondiente
   * @param record - Entidad de registro médico a persistir
   * @returns ID generado del registro insertado
   */
  async save(record: MedicalRecord): Promise<number> {
    const connection = await mysql.createConnection(this.connectionConfig);
    
    try {
      const persistenceData = record.toPersistence();
      
      const [result] = await connection.execute<mysql.ResultSetHeader>(
        `INSERT INTO appointments 
         (insuredId, scheduleId, countryISO, appointmentId, createdAt) 
         VALUES (?, ?, ?, ?, NOW())`,
        [
          persistenceData.insuredId,
          persistenceData.scheduleId,
          persistenceData.countryISO,
          persistenceData.appointmentId
        ]
      );
      
      return result.insertId;
    } finally {
      await connection.end();
    }
  }

  /**
   * Busca registros médicos por país
   * @param countryISO - Código de país (PE/CL)
   * @returns Lista de registros médicos del país especificado
   */
  async findByCountry(countryISO: 'PE' | 'CL'): Promise<MedicalRecord[]> {
    const connection = await mysql.createConnection(this.connectionConfig);
    
    try {
      const [rows] = await connection.execute<mysql.RowDataPacket[]>(
        `SELECT id, insuredId, scheduleId, countryISO, appointmentId, createdAt 
         FROM appointments 
         WHERE countryISO = ? 
         ORDER BY createdAt DESC`,
        [countryISO]
      );
      
      return rows.map(row => MedicalRecord.fromPersistence({
        id: row.id,
        insuredId: row.insuredId,
        scheduleId: row.scheduleId,
        countryISO: row.countryISO,
        appointmentId: row.appointmentId,
        createdAt: row.createdAt
      }));
    } finally {
      await connection.end();
    }
  }
}