import { 
  APIGatewayProxyHandler, 
  APIGatewayProxyResult, 
  SQSHandler,
  SQSEvent,
  Context,
  APIGatewayProxyEvent,
  Handler
} from 'aws-lambda';
import { AppointmentService } from '../services/appointmentService';
import { AppointmentValidator } from '../validators/appointmentValidator';

const appointmentService = new AppointmentService();

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  },
  body: JSON.stringify(body)
});

const httpHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;

    if (httpMethod === 'POST') {
      if (!body) {
        return createResponse(400, { error: 'Request body is required' });
      }

      const requestData = JSON.parse(body);
      const validatedRequest = AppointmentValidator.validateCreateRequest(requestData);
      
      const appointment = await appointmentService.createAppointment(validatedRequest);
      
      return createResponse(201, {
        message: 'Appointment request received and is being processed',
        appointment
      });
    }

    if (httpMethod === 'GET' && pathParameters?.insuredId) {
      const { insuredId } = pathParameters;
      AppointmentValidator.validateInsuredId(insuredId);
      
      const appointments = await appointmentService.getAppointmentsByInsuredId(insuredId);
      
      return createResponse(200, { appointments });
    }

    return createResponse(404, { error: 'Endpoint not found' });

  } catch (error) {
    console.error('Error processing request:', error);
    
    if (error instanceof Error) {
      return createResponse(400, { error: error.message });
    }
    
    return createResponse(500, { error: 'Internal server error' });
  }
};

const sqsHandler: SQSHandler = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      
      if (message.appointmentId) {
        await appointmentService.updateAppointmentStatus(message.appointmentId, 'completed');
        console.log(`Updated appointment ${message.appointmentId} to completed status`);
      }
    }
  } catch (error) {
    console.error('Error processing SQS message:', error);
    throw error;
  }
};

export const handler: Handler = async (event, context) => {
  if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
    return sqsHandler(event as SQSEvent, context, () => {});
  }
  
  return httpHandler(event as APIGatewayProxyEvent, context, () => {});
};