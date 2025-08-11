import mysql from 'mysql2/promise';
import { MySQLAppointment } from '../types';

export class MySqlService {
  private connectionConfig: mysql.ConnectionOptions;

  constructor(countryISO: 'PE' | 'CL') {
    const database = countryISO === 'PE' ? 'appointments_pe' : 'appointments_cl';
    
    this.connectionConfig = {
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    };
  }

  async createAppointment(appointment: MySQLAppointment): Promise<number> {
    const connection = await mysql.createConnection(this.connectionConfig);
    
    try {
      const [result] = await connection.execute<mysql.ResultSetHeader>(
        'INSERT INTO appointments (insuredId, scheduleId, countryISO, createdAt) VALUES (?, ?, ?, NOW())',
        [appointment.insuredId, appointment.scheduleId, appointment.countryISO]
      );
      
      return result.insertId;
    } finally {
      await connection.end();
    }
  }

  async getAppointmentsByCountry(countryISO: 'PE' | 'CL'): Promise<MySQLAppointment[]> {
    const connection = await mysql.createConnection(this.connectionConfig);
    
    try {
      const [rows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM appointments WHERE countryISO = ? ORDER BY createdAt DESC',
        [countryISO]
      );
      
      return rows as MySQLAppointment[];
    } finally {
      await connection.end();
    }
  }
}