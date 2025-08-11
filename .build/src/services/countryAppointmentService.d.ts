import { SqsMessage } from '../types';
export declare class CountryAppointmentService {
    private mysqlService;
    private eventBridgeService;
    constructor(countryISO: 'PE' | 'CL');
    processAppointment(message: SqsMessage): Promise<void>;
}
//# sourceMappingURL=countryAppointmentService.d.ts.map