import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SqsMessage } from '../types';

export class SnsService {
  private client: SNSClient;
  private topicArn: string;

  constructor() {
    this.client = new SNSClient({});
    this.topicArn = process.env.SNS_TOPIC_ARN!;
  }

  async publishAppointment(message: SqsMessage): Promise<void> {
    const command = new PublishCommand({
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