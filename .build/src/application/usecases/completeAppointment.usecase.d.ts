import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';
/**
 * Caso de uso para completar una cita médica
 * Se ejecuta cuando se recibe confirmación del procesamiento por país
 */
export declare class CompleteAppointmentUseCase {
    private readonly appointmentRepository;
    constructor(appointmentRepository: AppointmentRepositoryPort);
    /**
     * Ejecuta la finalización de una cita médica
     * @param request - Datos necesarios para completar la cita
     * @returns Confirmación de la actualización exitosa
     */
    execute(request: CompleteAppointmentRequest): Promise<CompleteAppointmentResponse>;
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
//# sourceMappingURL=completeAppointment.usecase.d.ts.map