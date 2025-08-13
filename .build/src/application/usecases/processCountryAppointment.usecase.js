"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessCountryAppointmentUseCase = void 0;
const medicalRecord_entity_1 = require("../../domain/entities/medicalRecord.entity");
const appointment_events_1 = require("../../domain/events/appointment.events");
/**
 * Caso de uso para procesar citas médicas específicas por país
 * Se ejecuta cuando llega un mensaje de la cola SQS correspondiente
 */
class ProcessCountryAppointmentUseCase {
    medicalRecordRepository;
    eventPublisher;
    countryISO;
    constructor(medicalRecordRepository, eventPublisher, countryISO) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.eventPublisher = eventPublisher;
        this.countryISO = countryISO;
    }
    /**
     * Ejecuta el procesamiento de una cita por país
     * @param request - Datos de la cita a procesar
     * @returns Confirmación del procesamiento exitoso
     */
    async execute(request) {
        // 1. Crear entidad de registro médico
        const medicalRecord = new medicalRecord_entity_1.MedicalRecord(request.insuredId, request.scheduleId, this.countryISO, request.appointmentId);
        // 2. Persistir en la base de datos del país correspondiente
        const recordId = await this.medicalRecordRepository.save(medicalRecord);
        // 3. Crear y publicar evento de cita completada
        const event = new appointment_events_1.AppointmentCompletedEvent(request.appointmentId, request.insuredId, request.scheduleId, this.countryISO, recordId);
        await this.eventPublisher.publishAppointmentCompleted(event);
        return {
            success: true,
            medicalRecordId: recordId,
            countryISO: this.countryISO,
            processedAt: new Date().toISOString()
        };
    }
}
exports.ProcessCountryAppointmentUseCase = ProcessCountryAppointmentUseCase;
//# sourceMappingURL=processCountryAppointment.usecase.js.map