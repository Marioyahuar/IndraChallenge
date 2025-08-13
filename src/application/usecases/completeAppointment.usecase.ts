import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';

/**
 * Caso de uso para completar una cita médica
 * Se ejecuta cuando se recibe confirmación del procesamiento por país
 */
export class CompleteAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort
  ) {}

  /**
   * Ejecuta la finalización de una cita médica
   * @param request - Datos necesarios para completar la cita
   * @returns Confirmación de la actualización exitosa
   */
  async execute(request: CompleteAppointmentRequest): Promise<CompleteAppointmentResponse> {
    // 1. Buscar la cita en el repositorio
    const appointment = await this.appointmentRepository.findById(request.appointmentId);
    
    if (!appointment) {
      throw new Error(`Cita con ID ${request.appointmentId} no encontrada`);
    }

    // 2. Validar que la cita esté en estado pending
    if (!appointment.isPending()) {
      throw new Error(`La cita ${request.appointmentId} no está en estado pending`);
    }

    // 3. Completar la cita (lógica de dominio)
    appointment.complete();

    // 4. Actualizar en el repositorio
    await this.appointmentRepository.updateStatus(appointment.id, appointment.status);

    return {
      appointmentId: appointment.id,
      previousStatus: 'pending',
      currentStatus: appointment.status,
      updatedAt: appointment.updatedAt
    };
  }
}

/**
 * Contrato de entrada para el caso de uso
 */
export interface CompleteAppointmentRequest {
  readonly appointmentId: string;
  readonly medicalRecordId: number;
  readonly countryISO: 'PE' | 'CL';
}

/**
 * Contrato de salida para el caso de uso
 */
export interface CompleteAppointmentResponse {
  readonly appointmentId: string;
  readonly previousStatus: string;
  readonly currentStatus: string;
  readonly updatedAt: string;
}