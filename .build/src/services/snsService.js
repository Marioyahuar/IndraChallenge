"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnsService = void 0;
const client_sns_1 = require("@aws-sdk/client-sns");
class SnsService {
    client;
    topicArn;
    constructor() {
        this.client = new client_sns_1.SNSClient({});
        this.topicArn = process.env.SNS_TOPIC_ARN;
    }
    async publishAppointment(message) {
        const command = new client_sns_1.PublishCommand({
            TopicArn: this.topicArn,
            Message: JSON.stringify(message),
            MessageAttributes: {
                countryISO: {
                    DataType: 'String',
                    StringValue: message.countryISO
                }
            }
        });
        await this.client.send(command);
    }
}
exports.SnsService = SnsService;
//# sourceMappingURL=snsService.js.map