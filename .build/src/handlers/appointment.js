"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const appointmentService_1 = require("../services/appointmentService");
const appointmentValidator_1 = require("../validators/appointmentValidator");
const appointmentService = new appointmentService_1.AppointmentService();
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
const httpHandler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;
        if (httpMethod === 'POST') {
            if (!body) {
                return createResponse(400, { error: 'Request body is required' });
            }
            const requestData = JSON.parse(body);
            const validatedRequest = appointmentValidator_1.AppointmentValidator.validateCreateRequest(requestData);
            const appointment = await appointmentService.createAppointment(validatedRequest);
            return createResponse(201, {
                message: 'Appointment request received and is being processed',
                appointment
            });
        }
        if (httpMethod === 'GET' && pathParameters?.insuredId) {
            const { insuredId } = pathParameters;
            appointmentValidator_1.AppointmentValidator.validateInsuredId(insuredId);
            const appointments = await appointmentService.getAppointmentsByInsuredId(insuredId);
            return createResponse(200, { appointments });
        }
        return createResponse(404, { error: 'Endpoint not found' });
    }
    catch (error) {
        console.error('Error processing request:', error);
        if (error instanceof Error) {
            return createResponse(400, { error: error.message });
        }
        return createResponse(500, { error: 'Internal server error' });
    }
};
const sqsHandler = async (event) => {
    try {
        for (const record of event.Records) {
            const message = JSON.parse(record.body);
            if (message.appointmentId) {
                await appointmentService.updateAppointmentStatus(message.appointmentId, 'completed');
                console.log(`Updated appointment ${message.appointmentId} to completed status`);
            }
        }
    }
    catch (error) {
        console.error('Error processing SQS message:', error);
        throw error;
    }
};
const handler = async (event, context) => {
    if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
        return sqsHandler(event, context, () => { });
    }
    return httpHandler(event, context, () => { });
};
exports.handler = handler;
//# sourceMappingURL=appointment.js.map