"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const processCountryAppointment_usecase_1 = require("../../application/usecases/processCountryAppointment.usecase");
const mysqlMedicalRecordRepository_adapter_1 = require("../adapters/mysqlMedicalRecordRepository.adapter");
const awsEventPublisher_adapter_1 = require("../adapters/awsEventPublisher.adapter");
/**
 * Handler especializado para procesar citas médicas de Chile
 * Actúa como adaptador primario para eventos SQS específicos de CL
 */
// Inyección de dependencias específicas para Chile
const medicalRecordRepository = new mysqlMedicalRecordRepository_adapter_1.MySqlMedicalRecordRepositoryAdapter('CL');
const eventPublisher = new awsEventPublisher_adapter_1.AwsEventPublisherAdapter();
// Instanciación del caso de uso con dependencias inyectadas para Chile
const processCountryAppointmentUseCase = new processCountryAppointment_usecase_1.ProcessCountryAppointmentUseCase(medicalRecordRepository, eventPublisher, 'CL');
/**
 * Manejador de mensajes SQS para citas de Chile
 * Procesa cada mensaje de la cola SQS_CL y ejecuta la lógica de negocio correspondiente
 * @param event - Evento SQS con mensajes de citas para procesar en Chile
 * @param context - Contexto de ejecución Lambda
 */
const handler = async (event, context) => {
    try {
        console.log(`[CL] Processing ${event.Records.length} appointment messages for Chile`);
        for (const record of event.Records) {
            try {
                const message = JSON.parse(record.body);
                // El mensaje puede venir directo de SQS o encapsulado desde SNS
                const appointmentData = message.Message ? JSON.parse(message.Message) : message;
                console.log(`[CL] Processing appointment for insuredId: ${appointmentData.insuredId}`);
                // Ejecutar caso de uso de procesamiento por país
                const result = await processCountryAppointmentUseCase.execute({
                    appointmentId: appointmentData.id,
                    insuredId: appointmentData.insuredId,
                    scheduleId: appointmentData.scheduleId,
                    countryISO: 'CL'
                });
                console.log(`[CL] Appointment ${appointmentData.id} processed successfully. Medical record ID: ${result.medicalRecordId}`);
            }
            catch (recordError) {
                console.error(`[CL] Error processing individual record:`, recordError);
                // En un escenario real, aquí podríamos enviar el mensaje a una DLQ
                throw recordError;
            }
        }
        console.log(`[CL] All ${event.Records.length} Chile appointments processed successfully`);
    }
    catch (error) {
        console.error('[CL] Error processing Chile appointments batch:', error);
        throw error;
    }
};
exports.handler = handler;
//# sourceMappingURL=appointmentClHandler.js.map