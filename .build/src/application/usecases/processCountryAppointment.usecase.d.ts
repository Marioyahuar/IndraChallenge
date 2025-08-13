import { MedicalRecordRepositoryPort } from '../../domain/ports/medicalRecordRepository.port';
import { EventPublisherPort } from '../../domain/ports/eventPublisher.port';
/**
 * Caso de uso para procesar citas médicas específicas por país
 * Se ejecuta cuando llega un mensaje de la cola SQS correspondiente
 */
export declare class ProcessCountryAppointmentUseCase {
    private readonly medicalRecordRepository;
    private readonly eventPublisher;
    private readonly countryISO;
    constructor(medicalRecordRepository: MedicalRecordRepositoryPort, eventPublisher: EventPublisherPort, countryISO: 'PE' | 'CL');
    /**
     * Ejecuta el procesamiento de una cita por país
     * @param request - Datos de la cita a procesar
     * @returns Confirmación del procesamiento exitoso
     */
    execute(request: ProcessCountryAppointmentRequest): Promise<ProcessCountryAppointmentResponse>;
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
//# sourceMappingURL=processCountryAppointment.usecase.d.ts.map