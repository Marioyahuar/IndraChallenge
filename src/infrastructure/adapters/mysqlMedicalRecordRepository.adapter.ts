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
      
      // Primero verificar si ya existe
      const [existingRows] = await connection.execute<mysql.RowDataPacket[]>(
        `SELECT id FROM appointments 
         WHERE insured_id = ? AND schedule_id = ? AND country_iso = ?`,
        [
          persistenceData.insuredId,
          persistenceData.scheduleId,
          persistenceData.countryISO
        ]
      );

      if (existingRows.length > 0) {
        console.log(`[${persistenceData.countryISO}] Appointment already exists - returning existing ID: ${existingRows[0].id}`);
        return existingRows[0].id;
      }
      
      const [result] = await connection.execute<mysql.ResultSetHeader>(
        `INSERT INTO appointments 
         (insured_id, schedule_id, country_iso, status, created_at) 
         VALUES (?, ?, ?, 'scheduled', NOW())`,
        [
          persistenceData.insuredId,
          persistenceData.scheduleId,
          persistenceData.countryISO
        ]
      );
      
      console.log(`[${persistenceData.countryISO}] New appointment created with ID: ${result.insertId}`);
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
        `SELECT id, insured_id, schedule_id, country_iso, status, created_at 
         FROM appointments 
         WHERE country_iso = ? 
         ORDER BY created_at DESC`,
        [countryISO]
      );
      
      return rows.map(row => MedicalRecord.fromPersistence({
        id: row.id,
        insuredId: row.insured_id,
        scheduleId: row.schedule_id,
        countryISO: row.country_iso,
        appointmentId: `${row.id}`, // Usar el ID como appointmentId
        createdAt: row.created_at
      }));
    } finally {
      await connection.end();
    }
  }
}