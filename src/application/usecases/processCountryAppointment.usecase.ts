import { MedicalRecord } from '../../domain/entities/medicalRecord.entity';
import { AppointmentCompletedEvent } from '../../domain/events/appointment.events';
import { MedicalRecordRepositoryPort } from '../../domain/ports/medicalRecordRepository.port';
import { EventPublisherPort } from '../../domain/ports/eventPublisher.port';

/**
 * Caso de uso para procesar citas médicas específicas por país
 * Se ejecuta cuando llega un mensaje de la cola SQS correspondiente
 */
export class ProcessCountryAppointmentUseCase {
  constructor(
    private readonly medicalRecordRepository: MedicalRecordRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly countryISO: 'PE' | 'CL'
  ) {}

  /**
   * Ejecuta el procesamiento de una cita por país
   * @param request - Datos de la cita a procesar
   * @returns Confirmación del procesamiento exitoso
   */
  async execute(request: ProcessCountryAppointmentRequest): Promise<ProcessCountryAppointmentResponse> {
    // 1. Crear entidad de registro médico
    const medicalRecord = new MedicalRecord(
      request.insuredId,
      request.scheduleId,
      this.countryISO,
      request.appointmentId
    );

    // 2. Persistir en la base de datos del país correspondiente
    const recordId = await this.medicalRecordRepository.save(medicalRecord);

    // 3. Crear y publicar evento de cita completada
    const event = new AppointmentCompletedEvent(
      request.appointmentId,
      request.insuredId,
      request.scheduleId,
      this.countryISO,
      recordId
    );

    await this.eventPublisher.publishAppointmentCompleted(event);

    return {
      success: true,
      medicalRecordId: recordId,
      countryISO: this.countryISO,
      processedAt: new Date().toISOString()
    };
  }
}

/**
 * Contrato de entrada para el caso de uso
 * Representa los datos que llegan desde la cola SQS
 */
export interface ProcessCountryAppointmentRequest {
  readonly appointmentId: string;
  readonly insuredId: string;
  readonly scheduleId: number;
  readonly countryISO: 'PE' | 'CL';
}

/**
 * Contrato de salida para el caso de uso
 */
export interface ProcessCountryAppointmentResponse {
  readonly success: boolean;
  readonly medicalRecordId: number;
  readonly countryISO: 'PE' | 'CL';
  readonly processedAt: string;
}