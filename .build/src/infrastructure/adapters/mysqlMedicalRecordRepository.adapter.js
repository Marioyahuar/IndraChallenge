"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlMedicalRecordRepositoryAdapter = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const medicalRecord_entity_1 = require("../../domain/entities/medicalRecord.entity");
/**
 * Adaptador de infraestructura para MySQL
 * Implementa el puerto del repositorio de registros médicos usando MySQL por país
 */
class MySqlMedicalRecordRepositoryAdapter {
    connectionConfig;
    constructor(countryISO) {
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
    async save(record) {
        const connection = await promise_1.default.createConnection(this.connectionConfig);
        try {
            const persistenceData = record.toPersistence();
            const [result] = await connection.execute(`INSERT INTO appointments 
         (insuredId, scheduleId, countryISO, appointmentId, createdAt) 
         VALUES (?, ?, ?, ?, NOW())`, [
                persistenceData.insuredId,
                persistenceData.scheduleId,
                persistenceData.countryISO,
                persistenceData.appointmentId
            ]);
            return result.insertId;
        }
        finally {
            await connection.end();
        }
    }
    /**
     * Busca registros médicos por país
     * @param countryISO - Código de país (PE/CL)
     * @returns Lista de registros médicos del país especificado
     */
    async findByCountry(countryISO) {
        const connection = await promise_1.default.createConnection(this.connectionConfig);
        try {
            const [rows] = await connection.execute(`SELECT id, insuredId, scheduleId, countryISO, appointmentId, createdAt 
         FROM appointments 
         WHERE countryISO = ? 
         ORDER BY createdAt DESC`, [countryISO]);
            return rows.map(row => medicalRecord_entity_1.MedicalRecord.fromPersistence({
                id: row.id,
                insuredId: row.insuredId,
                scheduleId: row.scheduleId,
                countryISO: row.countryISO,
                appointmentId: row.appointmentId,
                createdAt: row.createdAt
            }));
        }
        finally {
            await connection.end();
        }
    }
}
exports.MySqlMedicalRecordRepositoryAdapter = MySqlMedicalRecordRepositoryAdapter;
//# sourceMappingURL=mysqlMedicalRecordRepository.adapter.js.map