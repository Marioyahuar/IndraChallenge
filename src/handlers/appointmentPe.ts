import { SQSHandler, SQSEvent } from 'aws-lambda';
import { CountryAppointmentService } from '../services/countryAppointmentService';

const countryService = new CountryAppointmentService('PE');

export const handler: SQSHandler = async (event: SQSEvent) => {
  try {
    console.log(`Processing ${event.Records.length} PE appointments`);

    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      
      if (message.Message) {
        const sqsMessage = JSON.parse(message.Message);
        console.log(`Processing PE appointment for insuredId: ${sqsMessage.insuredId}`);
        
        await countryService.processAppointment(sqsMessage);
      } else {
        console.log(`Processing direct PE appointment for insuredId: ${message.insuredId}`);
        await countryService.processAppointment(message);
      }
    }

    console.log('All PE appointments processed successfully');
  } catch (error) {
    console.error('Error processing PE appointments:', error);
    throw error;
  }
};