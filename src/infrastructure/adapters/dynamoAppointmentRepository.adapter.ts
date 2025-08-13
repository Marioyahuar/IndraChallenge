import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand,
  QueryCommand,
  UpdateCommand 
} from '@aws-sdk/lib-dynamodb';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';
import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';

/**
 * Adaptador de infraestructura para DynamoDB
 * Implementa el puerto del repositorio de citas usando AWS DynamoDB
 */
export class DynamoAppointmentRepositoryAdapter implements AppointmentRepositoryPort {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    const dynamoClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tableName = process.env.DYNAMO_TABLE!;
  }

  /**
   * Guarda una cita médica en DynamoDB
   * @param appointment - Entidad de cita a persistir
   */
  async save(appointment: AppointmentEntity): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: appointment.toPersistence()
    });

    await this.client.send(command);
  }

  /**
   * Busca una cita por su ID en DynamoDB
   * @param id - Identificador único de la cita
   * @returns Entidad de cita o null si no existe
   */
  async findById(id: string): Promise<AppointmentEntity | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id }
    });

    const response = await this.client.send(command);
    
    if (!response.Item) {
      return null;
    }

    return this.mapToEntity(response.Item);
  }

  /**
   * Busca todas las citas de un asegurado específico
   * @param insuredId - Código del asegurado (5 dígitos)
   * @returns Lista de citas ordenadas por fecha de creación
   */
  async findByInsuredId(insuredId: string): Promise<AppointmentEntity[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'insuredId-index',
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId
      },
      ScanIndexForward: false // Ordenar descendente por fecha
    });

    const response = await this.client.send(command);
    
    if (!response.Items) {
      return [];
    }

    return response.Items.map(item => this.mapToEntity(item));
  }

  /**
   * Actualiza el estado de una cita existente
   * @param id - Identificador único de la cita
   * @param status - Nuevo estado de la cita
   */
  async updateStatus(id: string, status: 'pending' | 'completed'): Promise<void> {
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

  /**
   * Convierte datos de DynamoDB a entidad de dominio
   * @param item - Item de DynamoDB
   * @returns Entidad de cita médica
   */
  private mapToEntity(item: any): AppointmentEntity {
    return new AppointmentEntity(
      item.id,
      item.insuredId,
      item.scheduleId,
      item.countryISO,
      item.status,
      item.createdAt,
      item.updatedAt
    );
  }
}