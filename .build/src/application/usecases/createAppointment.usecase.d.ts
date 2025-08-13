import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';
import { EventPublisherPort } from '../../domain/ports/eventPublisher.port';
/**
 * Caso de uso para crear una nueva cita médica
 * Implementa la lógica de aplicación siguiendo principios hexagonales
 */
export declare class CreateAppointmentUseCase {
    private readonly appointmentRepository;
    private readonly eventPublisher;
    constructor(appointmentRepository: AppointmentRepositoryPort, eventPublisher: EventPublisherPort);
    /**
     * Ejecuta el caso de uso de crear cita médica
     * @param request - Datos de entrada para crear la cita
     * @returns La cita creada con su estado inicial
     */
    execute(request: CreateAppointmentRequest): Promise<CreateAppointmentResponse>;
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
//# sourceMappingURL=createAppointment.usecase.d.ts.map