"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoService = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoService {
    client;
    tableName;
    constructor() {
        const dynamoClient = new client_dynamodb_1.DynamoDBClient({});
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoClient);
        this.tableName = process.env.DYNAMO_TABLE;
    }
    async createAppointment(appointment) {
        const command = new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: appointment
        });
        await this.client.send(command);
    }
    async getAppointment(id) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { id }
        });
        const response = await this.client.send(command);
        return response.Item || null;
    }
    async getAppointmentsByInsuredId(insuredId) {
        const command = new lib_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            IndexName: 'insuredId-index',
            KeyConditionExpression: 'insuredId = :insuredId',
            ExpressionAttributeValues: {
                ':insuredId': insuredId
            },
            ScanIndexForward: false
        });
        const response = await this.client.send(command);
        return response.Items || [];
    }
    async updateAppointmentStatus(id, status) {
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
}
exports.DynamoService = DynamoService;
//# sourceMappingURL=dynamoService.js.map