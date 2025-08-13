import { SQSHandler, SQSEvent, Context } from 'aws-lambda';
import { ProcessCountryAppointmentUseCase } from '../../application/usecases/processCountryAppointment.usecase';
import { MySqlMedicalRecordRepositoryAdapter } from '../adapters/mysqlMedicalRecordRepository.adapter';
import { AwsEventPublisherAdapter } from '../adapters/awsEventPublisher.adapter';

/**
 * Handler especializado para procesar citas médicas de Perú
 * Actúa como adaptador primario para eventos SQS específicos de PE
 */

// Inyección de dependencias específicas para Perú
const medicalRecordRepository = new MySqlMedicalRecordRepositoryAdapter('PE');
const eventPublisher = new AwsEventPublisherAdapter();

// Instanciación del caso de uso con dependencias inyectadas para Perú
const processCountryAppointmentUseCase = new ProcessCountryAppointmentUseCase(
  medicalRecordRepository,
  eventPublisher,
  'PE'
);

/**
 * Manejador de mensajes SQS para citas de Perú
 * Procesa cada mensaje de la cola SQS_PE y ejecuta la lógica de negocio correspondiente
 * @param event - Evento SQS con mensajes de citas para procesar en Perú
 * @param context - Contexto de ejecución Lambda
 */
export const handler: SQSHandler = async (event: SQSEvent, context: Context) => {
  try {
    console.log(`[PE] Processing ${event.Records.length} appointment messages for Peru`);

    for (const record of event.Records) {
      try {
        const message = JSON.parse(record.body);
        
        // El mensaje puede venir directo de SQS o encapsulado desde SNS
        const appointmentData = message.Message ? JSON.parse(message.Message) : message;
        
        console.log(`[PE] Processing appointment for insuredId: ${appointmentData.insuredId}`);
        
        // Ejecutar caso de uso de procesamiento por país
        const result = await processCountryAppointmentUseCase.execute({
          appointmentId: appointmentData.id,
          insuredId: appointmentData.insuredId,
          scheduleId: appointmentData.scheduleId,
          countryISO: 'PE'
        });
        
        console.log(`[PE] Appointment ${appointmentData.id} processed successfully. Medical record ID: ${result.medicalRecordId}`);
        
      } catch (recordError) {
        console.error(`[PE] Error processing individual record:`, recordError);
        // En un escenario real, aquí podríamos enviar el mensaje a una DLQ
        throw recordError;
      }
    }

    console.log(`[PE] All ${event.Records.length} Peru appointments processed successfully`);
  } catch (error) {
    console.error('[PE] Error processing Peru appointments batch:', error);
    throw error;
  }
};