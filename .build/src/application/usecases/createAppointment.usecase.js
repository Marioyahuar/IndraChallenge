"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentUseCase = void 0;
const uuid_1 = require("uuid");
const appointment_entity_1 = require("../../domain/entities/appointment.entity");
const appointment_events_1 = require("../../domain/events/appointment.events");
/**
 * Caso de uso para crear una nueva cita médica
 * Implementa la lógica de aplicación siguiendo principios hexagonales
 */
class CreateAppointmentUseCase {
    appointmentRepository;
    eventPublisher;
    constructor(appointmentRepository, eventPublisher) {
        this.appointmentRepository = appointmentRepository;
        this.eventPublisher = eventPublisher;
    }
    /**
     * Ejecuta el caso de uso de crear cita médica
     * @param request - Datos de entrada para crear la cita
     * @returns La cita creada con su estado inicial
     */
    async execute(request) {
        // 1. Crear la entidad de dominio con validaciones incluidas
        const appointment = new appointment_entity_1.AppointmentEntity((0, uuid_1.v4)(), request.insuredId, request.scheduleId, request.countryISO, 'pending', new Date().toISOString(), new Date().toISOString());
        // 2. Persistir la cita en el repositorio
        await this.appointmentRepository.save(appointment);
        // 3. Crear y publicar evento de dominio
        const event = new appointment_events_1.AppointmentCreatedEvent(appointment.id, appointment.insuredId, appointment.scheduleId, appointment.countryISO);
        await this.eventPublisher.publishAppointmentCreated(event);
        // 4. Retornar respuesta del caso de uso
        return {
            id: appointment.id,
            insuredId: appointment.insuredId,
            scheduleId: appointment.scheduleId,
            countryISO: appointment.countryISO,
            status: appointment.status,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt
        };
    }
}
exports.CreateAppointmentUseCase = CreateAppointmentUseCase;
//# sourceMappingURL=createAppointment.usecase.js.map