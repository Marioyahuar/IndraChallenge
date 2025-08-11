"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBridgeService = void 0;
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
class EventBridgeService {
    client;
    constructor() {
        this.client = new client_eventbridge_1.EventBridgeClient({});
    }
    async publishAppointmentCompleted(detail) {
        const command = new client_eventbridge_1.PutEventsCommand({
            Entries: [
                {
                    Source: 'appointment.service',
                    DetailType: 'Appointment Completed',
                    Detail: JSON.stringify(detail),
                    Time: new Date()
                }
            ]
        });
        await this.client.send(command);
    }
}
exports.EventBridgeService = EventBridgeService;
//# sourceMappingURL=eventBridgeService.js.map