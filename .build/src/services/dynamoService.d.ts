import { AppointmentEntity } from '../types';
export declare class DynamoService {
    private client;
    private tableName;
    constructor();
    createAppointment(appointment: AppointmentEntity): Promise<void>;
    getAppointment(id: string): Promise<AppointmentEntity | null>;
    getAppointmentsByInsuredId(insuredId: string): Promise<AppointmentEntity[]>;
    updateAppointmentStatus(id: string, status: 'pending' | 'completed'): Promise<void>;
}
//# sourceMappingURL=dynamoService.d.ts.map