import * as mysql from 'mysql2/promise';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { ScheduleRepositoryPort } from '../../domain/ports/scheduleRepository.port';

/**
 * Adaptador de infraestructura para la persistencia de horarios en MySQL
 * Implementa el puerto del repositorio usando MySQL como almacén
 */
export class MysqlScheduleRepositoryAdapter implements ScheduleRepositoryPort {
  private connectionPE: mysql.Pool;
  private connectionCL: mysql.Pool;

  constructor() {
    // Configuración de conexión para Perú
    this.connectionPE = mysql.createPool({
      host: process.env.RDS_HOST || 'localhost',
      user: process.env.RDS_USER || 'root',
      password: process.env.RDS_PASSWORD || 'password',
      database: process.env.RDS_DATABASE_PE || 'appointments_pe',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    // Configuración de conexión para Chile
    this.connectionCL = mysql.createPool({
      host: process.env.RDS_HOST || 'localhost',
      user: process.env.RDS_USER || 'root',
      password: process.env.RDS_PASSWORD || 'password',
      database: process.env.RDS_DATABASE_CL || 'appointments_cl',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    console.log(`MySQL Pools configurados para PE y CL en: ${process.env.RDS_HOST || 'localhost'}`);
  }

  /**
   * Obtiene la conexión correcta según el país
   */
  private getConnectionByCountry(countryISO: 'PE' | 'CL'): mysql.Pool {
    return countryISO === 'PE' ? this.connectionPE : this.connectionCL;
  }

  /**
   * Busca un horario por su ID
   */
  async findById(scheduleId: number, countryISO: 'PE' | 'CL'): Promise<ScheduleEntity | null> {
    const query = `
      SELECT id, medical_center_id, specialty_id, doctor_id, 
             appointment_datetime, duration_minutes, is_available,
             created_at, updated_at
      FROM schedules 
      WHERE id = ?
    `;

    try {
      const connection = this.getConnectionByCountry(countryISO);
      const [rows] = await connection.execute(query, [scheduleId]) as [mysql.RowDataPacket[], any];
      
      if (rows.length === 0) {
        console.log(`Schedule ${scheduleId} no encontrado`);
        return null;
      }
      
      const row = rows[0];
      console.log(`Schedule ${scheduleId} encontrado:`, row);
      
      return new ScheduleEntity(
        row.id,
        row.medical_center_id,
        row.specialty_id,
        row.doctor_id,
        new Date(row.appointment_datetime),
        row.duration_minutes,
        Boolean(row.is_available),
        new Date(row.created_at),
        new Date(row.updated_at)
      );
    } catch (error) {
      console.error('Error al buscar schedule:', error);
      throw new Error(`Error al buscar el horario ${scheduleId}: ${error}`);
    }
  }

  /**
   * Busca horarios disponibles por filtros
   */
  async findAvailableSchedules(filters: {
    medicalCenterId?: number;
    specialtyId?: number;
    doctorId?: number;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<ScheduleEntity[]> {
    // Simulación para desarrollo local
    if (process.env.IS_OFFLINE === 'true') {
      console.log('[LOCAL] Buscando schedules disponibles con filtros:', filters);
      return [];
    }

    // Implementación real pendiente
    return [];
  }

  /**
   * Marca un horario como no disponible
   */
  async markAsUnavailable(scheduleId: number, countryISO: 'PE' | 'CL'): Promise<boolean> {
    const query = `
      UPDATE schedules 
      SET is_available = false, updated_at = NOW()
      WHERE id = ? AND is_available = true
    `;

    try {
      const connection = this.getConnectionByCountry(countryISO);
      const [result] = await connection.execute(query, [scheduleId]) as [mysql.ResultSetHeader, any];
      const success = result.affectedRows > 0;
      
      console.log(`Schedule ${scheduleId} marcado como no disponible: ${success ? 'éxito' : 'falló'}`);
      return success;
    } catch (error) {
      console.error('Error al marcar schedule como no disponible:', error);
      throw new Error(`Error al actualizar disponibilidad del horario ${scheduleId}: ${error}`);
    }
  }

  /**
   * Marca un horario como disponible nuevamente
   */
  async markAsAvailable(scheduleId: number, countryISO: 'PE' | 'CL'): Promise<boolean> {
    const query = `
      UPDATE schedules 
      SET is_available = true, updated_at = NOW()
      WHERE id = ?
    `;

    try {
      const connection = this.getConnectionByCountry(countryISO);
      const [result] = await connection.execute(query, [scheduleId]) as [mysql.ResultSetHeader, any];
      const success = result.affectedRows > 0;
      
      console.log(`Schedule ${scheduleId} marcado como disponible: ${success ? 'éxito' : 'falló'}`);
      return success;
    } catch (error) {
      console.error('Error al marcar schedule como disponible:', error);
      throw new Error(`Error al actualizar disponibilidad del horario ${scheduleId}: ${error}`);
    }
  }

  /**
   * Obtiene información completa del horario con datos relacionados
   */
  async findByIdWithDetails(scheduleId: number, countryISO: 'PE' | 'CL'): Promise<{
    schedule: ScheduleEntity;
    medicalCenter: { id: number; name: string; countryISO: string };
    specialty: { id: number; name: string };
    doctor: { id: number; firstName: string; lastName: string };
  } | null> {
    const query = `
      SELECT 
        s.id, s.medical_center_id, s.specialty_id, s.doctor_id, 
        s.appointment_datetime, s.duration_minutes, s.is_available,
        s.created_at, s.updated_at,
        mc.name as medical_center_name, mc.country_iso,
        sp.name as specialty_name,
        d.first_name, d.last_name
      FROM schedules s
      JOIN medical_centers mc ON s.medical_center_id = mc.id
      JOIN specialties sp ON s.specialty_id = sp.id
      JOIN doctors d ON s.doctor_id = d.id
      WHERE s.id = ?
    `;

    try {
      const connection = this.getConnectionByCountry(countryISO);
      const [rows] = await connection.execute(query, [scheduleId]) as [mysql.RowDataPacket[], any];
      
      if (rows.length === 0) {
        console.log(`Schedule ${scheduleId} con detalles no encontrado`);
        return null;
      }
      
      const row = rows[0];
      console.log(`Schedule ${scheduleId} con detalles encontrado`);
      
      const schedule = new ScheduleEntity(
        row.id,
        row.medical_center_id,
        row.specialty_id,
        row.doctor_id,
        new Date(row.appointment_datetime),
        row.duration_minutes,
        Boolean(row.is_available),
        new Date(row.created_at),
        new Date(row.updated_at)
      );

      return {
        schedule,
        medicalCenter: { 
          id: row.medical_center_id, 
          name: row.medical_center_name, 
          countryISO: row.country_iso 
        },
        specialty: { 
          id: row.specialty_id, 
          name: row.specialty_name 
        },
        doctor: { 
          id: row.doctor_id, 
          firstName: row.first_name, 
          lastName: row.last_name 
        }
      };
    } catch (error) {
      console.error('Error al buscar schedule con detalles:', error);
      throw new Error(`Error al buscar el horario ${scheduleId} con detalles: ${error}`);
    }
  }

  /**
   * Cierra las conexiones de los pools
   */
  async close(): Promise<void> {
    await Promise.all([
      this.connectionPE.end(),
      this.connectionCL.end()
    ]);
  }
}