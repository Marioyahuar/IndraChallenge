import { MySQLAppointment } from '../types';
export declare class MySqlService {
    private connectionConfig;
    constructor(countryISO: 'PE' | 'CL');
    createAppointment(appointment: MySQLAppointment): Promise<number>;
    getAppointmentsByCountry(countryISO: 'PE' | 'CL'): Promise<MySQLAppointment[]>;
}
//# sourceMappingURL=mysqlService.d.ts.map