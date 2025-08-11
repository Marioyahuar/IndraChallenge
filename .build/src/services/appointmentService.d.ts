import { AppointmentRequest, AppointmentResponse } from '../types';
export declare class AppointmentService {
    private dynamoService;
    private snsService;
    constructor();
    createAppointment(request: AppointmentRequest): Promise<AppointmentResponse>;
    getAppointmentsByInsuredId(insuredId: string): Promise<AppointmentResponse[]>;
    updateAppointmentStatus(appointmentId: string, status: 'pending' | 'completed'): Promise<void>;
    private mapToResponse;
}
//# sourceMappingURL=appointmentService.d.ts.map