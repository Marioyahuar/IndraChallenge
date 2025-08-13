"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoAppointmentRepositoryAdapter = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const appointment_entity_1 = require("../../domain/entities/appointment.entity");
/**
 * Adaptador de infraestructura para DynamoDB
 * Implementa el puerto del repositorio de citas usando AWS DynamoDB
 */
class DynamoAppointmentRepositoryAdapter {
    client;
    tableName;
    constructor() {
        const dynamoClient = new client_dynamodb_1.DynamoDBClient({});
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoClient);
        this.tableName = process.env.DYNAMO_TABLE;
    }
    /**
     * Guarda una cita médica en DynamoDB
     * @param appointment - Entidad de cita a persistir
     */
    async save(appointment) {
        const command = new lib_dynamodb_1.PutCommand({
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
    async findById(id) {
        const command = new lib_dynamodb_1.GetCommand({
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
    async findByInsuredId(insuredId) {
        const command = new lib_dynamodb_1.QueryCommand({
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
    async updateStatus(id, status) {
        const command = new lib_dynamodb_1.UpdateCommand({
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
    mapToEntity(item) {
        return new appointment_entity_1.AppointmentEntity(item.id, item.insuredId, item.scheduleId, item.countryISO, item.status, item.createdAt, item.updatedAt);
    }
}
exports.DynamoAppointmentRepositoryAdapter = DynamoAppointmentRepositoryAdapter;
//# sourceMappingURL=dynamoAppointmentRepository.adapter.js.map