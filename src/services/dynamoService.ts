import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand,
  QueryCommand,
  UpdateCommand 
} from '@aws-sdk/lib-dynamodb';
import { AppointmentEntity } from '../types';

export class DynamoService {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    const dynamoClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tableName = process.env.DYNAMO_TABLE!;
  }

  async createAppointment(appointment: AppointmentEntity): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: appointment
    });

    await this.client.send(command);
  }

  async getAppointment(id: string): Promise<AppointmentEntity | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id }
    });

    const response = await this.client.send(command);
    return response.Item as AppointmentEntity || null;
  }

  async getAppointmentsByInsuredId(insuredId: string): Promise<AppointmentEntity[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'insuredId-index',
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId
      },
      ScanIndexForward: false
    });

    const response = await this.client.send(command);
    return response.Items as AppointmentEntity[] || [];
  }

  async updateAppointmentStatus(id: string, status: 'pending' | 'completed'): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString()
      }
    });

    await this.client.send(command);
  }
}