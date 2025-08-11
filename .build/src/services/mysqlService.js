"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlService = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
class MySqlService {
    connectionConfig;
    constructor(countryISO) {
        const database = countryISO === 'PE' ? 'appointments_pe' : 'appointments_cl';
        this.connectionConfig = {
            host: process.env.RDS_HOST,
            user: process.env.RDS_USER,
            password: process.env.RDS_PASSWORD,
            database,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
        };
    }
    async createAppointment(appointment) {
        const connection = await promise_1.default.createConnection(this.connectionConfig);
        try {
            const [result] = await connection.execute('INSERT INTO appointments (insuredId, scheduleId, countryISO, createdAt) VALUES (?, ?, ?, NOW())', [appointment.insuredId, appointment.scheduleId, appointment.countryISO]);
            return result.insertId;
        }
        finally {
            await connection.end();
        }
    }
    async getAppointmentsByCountry(countryISO) {
        const connection = await promise_1.default.createConnection(this.connectionConfig);
        try {
            const [rows] = await connection.execute('SELECT * FROM appointments WHERE countryISO = ? ORDER BY createdAt DESC', [countryISO]);
            return rows;
        }
        finally {
            await connection.end();
        }
    }
}
exports.MySqlService = MySqlService;
//# sourceMappingURL=mysqlService.js.map