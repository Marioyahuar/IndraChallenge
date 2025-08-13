import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { EventPublisherPort } from '../../domain/ports/eventPublisher.port';
import { AppointmentCreatedEvent, AppointmentCompletedEvent } from '../../domain/events/appointment.events';

/**
 * Adaptador de infraestructura para publicación de eventos AWS
 * Implementa el puerto del publicador de eventos usando SNS y EventBridge
 */
export class AwsEventPublisherAdapter implements EventPublisherPort {
  private snsClient: SNSClient;
  private eventBridgeClient: EventBridgeClient;
  private topicArn: string;

  constructor() {
    this.snsClient = new SNSClient({});
    this.eventBridgeClient = new EventBridgeClient({});
    // Para desarrollo local, usar un ARN mock si no está definido
    this.topicArn = process.env.SNS_TOPIC_ARN || 'arn:aws:sns:us-east-2:123456789012:appointment-topic-dev';
  }

  /**
   * Publica evento de cita creada a través de SNS
   * SNS filtrará por país y enviará a las colas SQS correspondientes
   * @param event - Evento de cita creada
   */
  async publishAppointmentCreated(event: AppointmentCreatedEvent): Promise<void> {
    // En desarrollo local, solo simular la publicación
    if (process.env.IS_OFFLINE === 'true' || !process.env.SNS_TOPIC_ARN) {
      console.log(`[LOCAL] Simulando publicación de evento AppointmentCreated para cita ${event.appointmentId} en país ${event.countryISO}`);
      return;
    }

    const message = event.toMessage();
    
    const command = new PublishCommand({
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
  async publishAppointmentCompleted(event: AppointmentCompletedEvent): Promise<void> {
    // En desarrollo local, solo simular la publicación
    if (process.env.IS_OFFLINE === 'true') {
      console.log(`[LOCAL] Simulando publicación de evento AppointmentCompleted para cita ${event.appointmentId} procesada en país ${event.countryISO}`);
      return;
    }

    const eventDetail = event.toEventBridge();
    
    const command = new PutEventsCommand({
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