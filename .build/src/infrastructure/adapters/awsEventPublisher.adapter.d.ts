import { EventPublisherPort } from '../../domain/ports/eventPublisher.port';
import { AppointmentCreatedEvent, AppointmentCompletedEvent } from '../../domain/events/appointment.events';
/**
 * Adaptador de infraestructura para publicación de eventos AWS
 * Implementa el puerto del publicador de eventos usando SNS y EventBridge
 */
export declare class AwsEventPublisherAdapter implements EventPublisherPort {
    private snsClient;
    private eventBridgeClient;
    private topicArn;
    constructor();
    /**
     * Publica evento de cita creada a través de SNS
     * SNS filtrará por país y enviará a las colas SQS correspondientes
     * @param event - Evento de cita creada
     */
    publishAppointmentCreated(event: AppointmentCreatedEvent): Promise<void>;
    /**
     * Publica evento de cita completada a través de EventBridge
     * EventBridge enviará el evento a la cola de respuesta para actualizar DynamoDB
     * @param event - Evento de cita completada
     */
    publishAppointmentCompleted(event: AppointmentCompletedEvent): Promise<void>;
}
//# sourceMappingURL=awsEventPublisher.adapter.d.ts.map