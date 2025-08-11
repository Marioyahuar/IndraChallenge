export interface AppointmentRequest {
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
}
export interface AppointmentEntity {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
}
export interface AppointmentResponse {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
export interface SqsMessage {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
}
export interface EventBridgeDetail {
    appointmentId: string;
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
}
export interface MySQLAppointment {
    id?: number;
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
    createdAt?: Date;
}
//# sourceMappingURL=index.d.ts.map