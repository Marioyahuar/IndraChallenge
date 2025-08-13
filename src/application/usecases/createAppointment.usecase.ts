import * as uuid from 'uuid';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';
import { AppointmentCreatedEvent } from '../../domain/events/appointment.events';
import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';
import { ScheduleRepositoryPort } from '../../domain/ports/scheduleRepository.port';
import { EventPublisherPort } from '../../domain/ports/eventPublisher.port';

/**
 * Caso de uso para crear una nueva cita médica
 * Implementa la lógica de aplicación siguiendo principios hexagonales
 */
export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly scheduleRepository: ScheduleRepositoryPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  /**
   * Ejecuta el caso de uso de crear cita médica
   * @param request - Datos de entrada para crear la cita
   * @returns La cita creada con su estado inicial
   */
  async execute(request: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    // 1. Validar que el schedule existe y está disponible
    const schedule = await this.scheduleRepository.findById(request.scheduleId, request.countryISO);
    if (!schedule) {
      throw new Error(`El horario con ID ${request.scheduleId} no existe en ${request.countryISO}`);
    }

    if (!schedule.canBeBooked()) {
      throw new Error(`El horario con ID ${request.scheduleId} no está disponible para reserva`);
    }

    // 2. Verificar que el asegurado no tenga ya una cita en este horario
    const existingAppointment = await this.appointmentRepository.findByInsuredAndSchedule(
      request.insuredId, 
      request.scheduleId
    );
    if (existingAppointment) {
      throw new Error(`El asegurado ${request.insuredId} ya tiene una cita en el horario ${request.scheduleId}`);
    }

    // 3. Crear la entidad de dominio con validaciones incluidas
    const appointment = new AppointmentEntity(
      uuid.v4(),
      request.insuredId,
      request.scheduleId,
      request.countryISO,
      'pending',
      new Date().toISOString(),
      new Date().toISOString()
    );

    // 4. Marcar el horario como no disponible
    await this.scheduleRepository.markAsUnavailable(request.scheduleId, request.countryISO);

    // 5. Persistir la cita en el repositorio
    await this.appointmentRepository.save(appointment);

    // 6. Crear y publicar evento de dominio
    const event = new AppointmentCreatedEvent(
      appointment.id,
      appointment.insuredId,
      appointment.scheduleId,
      appointment.countryISO
    );

    await this.eventPublisher.publishAppointmentCreated(event);

    // 7. Retornar respuesta del caso de uso
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

/**
 * Contrato de entrada para el caso de uso
 * Define los datos necesarios para crear una cita
 */
export interface CreateAppointmentRequest {
  readonly insuredId: string;
  readonly scheduleId: number;
  readonly countryISO: 'PE' | 'CL';
}

/**
 * Contrato de salida para el caso de uso
 * Define la estructura de respuesta al crear una cita
 */
export interface CreateAppointmentResponse {
  readonly id: string;
  readonly insuredId: string;
  readonly scheduleId: number;
  readonly countryISO: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}