"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsEventPublisherAdapter = void 0;
const client_sns_1 = require("@aws-sdk/client-sns");
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
/**
 * Adaptador de infraestructura para publicación de eventos AWS
 * Implementa el puerto del publicador de eventos usando SNS y EventBridge
 */
class AwsEventPublisherAdapter {
    snsClient;
    eventBridgeClient;
    topicArn;
    constructor() {
        this.snsClient = new client_sns_1.SNSClient({});
        this.eventBridgeClient = new client_eventbridge_1.EventBridgeClient({});
        // Para desarrollo local, usar un ARN mock si no está definido
        this.topicArn = process.env.SNS_TOPIC_ARN || 'arn:aws:sns:us-east-2:123456789012:appointment-topic-dev';
    }
    /**
     * Publica evento de cita creada a través de SNS
     * SNS filtrará por país y enviará a las colas SQS correspondientes
     * @param event - Evento de cita creada
     */
    async publishAppointmentCreated(event) {
        // En desarrollo local, solo simular la publicación
        if (process.env.IS_OFFLINE === 'true' || !process.env.SNS_TOPIC_ARN) {
            console.log(`[LOCAL] Simulando publicación de evento AppointmentCreated para cita ${event.appointmentId} en país ${event.countryISO}`);
            return;
        }
        const message = event.toMessage();
        const command = new client_sns_1.PublishCommand({
            TopicArn: this.topicArn,
            Message: JSON.stringify(message),
            MessageAttributes: {
                countryISO: {
                    DataType: 'String',
                    StringValue: event.countryISO
                },
                eventType: {
                    DataType: 'String',
                    StringValue: 'AppointmentCreated'
                }
            }
        });
        await this.snsClient.send(command);
        console.log(`Evento AppointmentCreated publicado para cita ${event.appointmentId} en país ${event.countryISO}`);
    }
    /**
     * Publica evento de cita completada a través de EventBridge
     * EventBridge enviará el evento a la cola de respuesta para actualizar DynamoDB
     * @param event - Evento de cita completada
     */
    async publishAppointmentCompleted(event) {
        // En desarrollo local, solo simular la publicación
        if (process.env.IS_OFFLINE === 'true') {
            console.log(`[LOCAL] Simulando publicación de evento AppointmentCompleted para cita ${event.appointmentId} procesada en país ${event.countryISO}`);
            return;
        }
        const eventDetail = event.toEventBridge();
        const command = new client_eventbridge_1.PutEventsCommand({
            Entries: [
                {
                    Source: 'appointment.service',
                    DetailType: 'Appointment Completed',
                    Detail: JSON.stringify(eventDetail),
                    Time: new Date()
                }
            ]
        });
        await this.eventBridgeClient.send(command);
        console.log(`Evento AppointmentCompleted publicado para cita ${event.appointmentId} procesada en país ${event.countryISO}`);
    }
}
exports.AwsEventPublisherAdapter = AwsEventPublisherAdapter;
//# sourceMappingURL=awsEventPublisher.adapter.js.map