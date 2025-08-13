import { v4 as uuidv4 } from 'uuid';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';
import { AppointmentCreatedEvent } from '../../domain/events/appointment.events';
import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';
import { EventPublisherPort } from '../../domain/ports/eventPublisher.port';

/**
 * Caso de uso para crear una nueva cita médica
 * Implementa la lógica de aplicación siguiendo principios hexagonales
 */
export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  /**
   * Ejecuta el caso de uso de crear cita médica
   * @param request - Datos de entrada para crear la cita
   * @returns La cita creada con su estado inicial
   */
  async execute(request: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    // 1. Crear la entidad de dominio con validaciones incluidas
    const appointment = new AppointmentEntity(
      uuidv4(),
      request.insuredId,
      request.scheduleId,
      request.countryISO,
      'pending',
      new Date().toISOString(),
      new Date().toISOString()
    );

    // 2. Persistir la cita en el repositorio
    await this.appointmentRepository.save(appointment);

    // 3. Crear y publicar evento de dominio
    const event = new AppointmentCreatedEvent(
      appointment.id,
      appointment.insuredId,
      appointment.scheduleId,
      appointment.countryISO
    );

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