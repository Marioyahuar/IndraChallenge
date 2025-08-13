import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';

/**
 * Caso de uso para obtener todas las citas de un asegurado
 * Implementa la consulta de citas siguiendo principios CQRS
 */
export class GetAppointmentsByInsuredUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort
  ) {}

  /**
   * Ejecuta el caso de uso de consulta de citas por asegurado
   * @param request - Datos de entrada con el ID del asegurado
   * @returns Lista de citas del asegurado ordenadas por fecha
   */
  async execute(request: GetAppointmentsByInsuredRequest): Promise<GetAppointmentsByInsuredResponse> {
    // 1. Validar el ID del asegurado
    this.validateInsuredId(request.insuredId);

    // 2. Consultar citas en el repositorio
    const appointments = await this.appointmentRepository.findByInsuredId(request.insuredId);

    // 3. Mapear entidades de dominio a DTOs de respuesta
    const appointmentDtos = appointments.map(appointment => ({
      id: appointment.id,
      insuredId: appointment.insuredId,
      scheduleId: appointment.scheduleId,
      countryISO: appointment.countryISO,
      status: appointment.status,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    }));

    return {
      appointments: appointmentDtos,
      totalCount: appointmentDtos.length
    };
  }

  /**
   * Valida que el ID del asegurado tenga el formato correcto
   * @param insuredId - ID del asegurado a validar
   */
  private validateInsuredId(insuredId: string): void {
    if (!insuredId || typeof insuredId !== 'string') {
      throw new Error('InsuredId es requerido y debe ser string');
    }

    if (!/^\d{5}$/.test(insuredId)) {
      throw new Error('InsuredId debe tener exactamente 5 dígitos');
    }
  }
}

/**
 * Contrato de entrada para el caso de uso
 */
export interface GetAppointmentsByInsuredRequest {
  readonly insuredId: string;
}

/**
 * Contrato de salida para el caso de uso
 */
export interface GetAppointmentsByInsuredResponse {
  readonly appointments: ReadonlyArray<{
    readonly id: string;
    readonly insuredId: string;
    readonly scheduleId: number;
    readonly countryISO: string;
    readonly status: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  }>;
  readonly totalCount: number;
}