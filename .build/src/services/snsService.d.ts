import { SqsMessage } from '../types';
export declare class SnsService {
    private client;
    private topicArn;
    constructor();
    publishAppointment(message: SqsMessage): Promise<void>;
}
//# sourceMappingURL=snsService.d.ts.map