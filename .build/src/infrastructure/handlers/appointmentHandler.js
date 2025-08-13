"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const createAppointment_usecase_1 = require("../../application/usecases/createAppointment.usecase");
const getAppointmentsByInsured_usecase_1 = require("../../application/usecases/getAppointmentsByInsured.usecase");
const completeAppointment_usecase_1 = require("../../application/usecases/completeAppointment.usecase");
const dynamoAppointmentRepository_adapter_1 = require("../adapters/dynamoAppointmentRepository.adapter");
const awsEventPublisher_adapter_1 = require("../adapters/awsEventPublisher.adapter");
/**
 * Handler principal para endpoints de citas médicas
 * Actúa como adaptador primario siguiendo arquitectura hexagonal
 */
// Inyección de dependencias - configuración de adaptadores
const appointmentRepository = new dynamoAppointmentRepository_adapter_1.DynamoAppointmentRepositoryAdapter();
const eventPublisher = new awsEventPublisher_adapter_1.AwsEventPublisherAdapter();
// Instanciación de casos de uso con dependencias inyectadas
const createAppointmentUseCase = new createAppointment_usecase_1.CreateAppointmentUseCase(appointmentRepository, eventPublisher);
const getAppointmentsByInsuredUseCase = new getAppointmentsByInsured_usecase_1.GetAppointmentsByInsuredUseCase(appointmentRepository);
const completeAppointmentUseCase = new completeAppointment_usecase_1.CompleteAppointmentUseCase(appointmentRepository);
/**
 * Crea una respuesta HTTP estandarizada
 * @param statusCode - Código de estado HTTP
 * @param body - Cuerpo de la respuesta
 * @returns Respuesta formateada para API Gateway
 */
const createResponse = (statusCode, body) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    },
    body: JSON.stringify(body)
});
/**
 * Manejador de peticiones HTTP para endpoints REST
 * @param event - Evento de API Gateway
 * @param context - Contexto de ejecución Lambda
 * @returns Respuesta HTTP
 */
const httpHandler = async (event, context) => {
    try {
        const { httpMethod, pathParameters, body } = event;
        // Endpoint POST /appointments - Crear nueva cita
        if (httpMethod === 'POST') {
            if (!body) {
                return createResponse(400, { error: 'Request body is required' });
            }
            const requestData = JSON.parse(body);
            // Ejecutar caso de uso de crear cita
            const result = await createAppointmentUseCase.execute({
                insuredId: requestData.insuredId,
                scheduleId: requestData.scheduleId,
                countryISO: requestData.countryISO
            });
            return createResponse(201, {
                message: 'Appointment request received and is being processed',
                appointment: result
            });
        }
        // Endpoint GET /appointments/{insuredId} - Obtener citas por asegurado
        if (httpMethod === 'GET' && pathParameters?.insuredId) {
            const { insuredId } = pathParameters;
            // Ejecutar caso de uso de consulta de citas
            const result = await getAppointmentsByInsuredUseCase.execute({ insuredId });
            return createResponse(200, result);
        }
        return createResponse(404, { error: 'Endpoint not found' });
    }
    catch (error) {
        console.error('Error processing HTTP request:', error);
        if (error instanceof Error) {
            return createResponse(400, { error: error.message });
        }
        return createResponse(500, { error: 'Internal server error' });
    }
};
/**
 * Manejador de mensajes SQS para completar citas
 * @param event - Evento de SQS con mensajes de confirmación
 * @param context - Contexto de ejecución Lambda
 */
const sqsHandler = async (event, context) => {
    try {
        console.log(`Processing ${event.Records.length} completion messages`);
        for (const record of event.Records) {
            const message = JSON.parse(record.body);
            // El mensaje puede venir directo o encapsulado desde EventBridge
            const appointmentData = message.appointmentId ? message : JSON.parse(message.Message || '{}');
            if (appointmentData.appointmentId) {
                // Ejecutar caso de uso de completar cita
                await completeAppointmentUseCase.execute({
                    appointmentId: appointmentData.appointmentId,
                    medicalRecordId: appointmentData.medicalRecordId || 0,
                    countryISO: appointmentData.countryISO
                });
                console.log(`Cita ${appointmentData.appointmentId} marcada como completada`);
            }
        }
        console.log('All completion messages processed successfully');
    }
    catch (error) {
        console.error('Error processing SQS completion messages:', error);
        throw error;
    }
};
/**
 * Handler principal que determina el tipo de evento y delega al manejador apropiado
 * @param event - Evento de AWS Lambda (HTTP o SQS)
 * @param context - Contexto de ejecución
 * @returns Resultado del procesamiento
 */
const handler = async (event, context) => {
    // Determinar tipo de evento basado en la estructura
    if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
        return sqsHandler(event, context, () => { });
    }
    // Por defecto, tratar como evento HTTP de API Gateway
    return httpHandler(event, context, () => { });
};
exports.handler = handler;
exports.default = handler;
//# sourceMappingURL=appointmentHandler.js.map