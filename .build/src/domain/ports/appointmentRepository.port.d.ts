import { AppointmentEntity } from '../entities/appointment.entity';
/**
 * Puerto para la persistencia de citas médicas
 * Define el contrato para el acceso a datos sin especificar la implementación
 */
export interface AppointmentRepositoryPort {
    /**
     * Guarda una nueva cita médica
     * @param appointment - Entidad de la cita a guardar
     */
    save(appointment: AppointmentEntity): Promise<void>;
    /**
     * Busca una cita por su identificador
     * @param id - Identificador único de la cita
     * @returns La cita encontrada o null si no existe
     */
    findById(id: string): Promise<AppointmentEntity | null>;
    /**
     * Busca todas las citas de un asegurado específico
     * @param insuredId - Código del asegurado (5 dígitos)
     * @returns Lista de citas del asegurado ordenadas por fecha
     */
    findByInsuredId(insuredId: string): Promise<AppointmentEntity[]>;
    /**
     * Actualiza el estado de una cita existente
     * @param id - Identificador único de la cita
     * @param status - Nuevo estado de la cita
     */
    updateStatus(id: string, status: 'pending' | 'completed'): Promise<void>;
}
//# sourceMappingURL=appointmentRepository.port.d.ts.map