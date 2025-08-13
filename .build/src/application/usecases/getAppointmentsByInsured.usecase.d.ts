import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';
/**
 * Caso de uso para obtener todas las citas de un asegurado
 * Implementa la consulta de citas siguiendo principios CQRS
 */
export declare class GetAppointmentsByInsuredUseCase {
    private readonly appointmentRepository;
    constructor(appointmentRepository: AppointmentRepositoryPort);
    /**
     * Ejecuta el caso de uso de consulta de citas por asegurado
     * @param request - Datos de entrada con el ID del asegurado
     * @returns Lista de citas del asegurado ordenadas por fecha
     */
    execute(request: GetAppointmentsByInsuredRequest): Promise<GetAppointmentsByInsuredResponse>;
    /**
     * Valida que el ID del asegurado tenga el formato correcto
     * @param insuredId - ID del asegurado a validar
     */
    private validateInsuredId;
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
//# sourceMappingURL=getAppointmentsByInsured.usecase.d.ts.map