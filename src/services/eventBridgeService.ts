import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { EventBridgeDetail } from '../types';

export class EventBridgeService {
  private client: EventBridgeClient;

  constructor() {
    this.client = new EventBridgeClient({});
  }

  async publishAppointmentCompleted(detail: EventBridgeDetail): Promise<void> {
    const command = new PutEventsCommand({
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