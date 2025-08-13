import { AppointmentEntity } from '../../domain/entities/appointment.entity';
import { AppointmentRepositoryPort } from '../../domain/ports/appointmentRepository.port';
/**
 * Adaptador de infraestructura para DynamoDB
 * Implementa el puerto del repositorio de citas usando AWS DynamoDB
 */
export declare class DynamoAppointmentRepositoryAdapter implements AppointmentRepositoryPort {
    private client;
    private tableName;
    constructor();
    /**
     * Guarda una cita médica en DynamoDB
     * @param appointment - Entidad de cita a persistir
     */
    save(appointment: AppointmentEntity): Promise<void>;
    /**
     * Busca una cita por su ID en DynamoDB
     * @param id - Identificador único de la cita
     * @returns Entidad de cita o null si no existe
     */
    findById(id: string): Promise<AppointmentEntity | null>;
    /**
     * Busca todas las citas de un asegurado específico
     * @param insuredId - Código del asegurado (5 dígitos)
     * @returns Lista de citas ordenadas por fecha de creación
     */
    findByInsuredId(insuredId: string): Promise<AppointmentEntity[]>;
    /**
     * Actualiza el estado de una cita existente
     * @param id - Identificador único de la cita
     * @param status - Nuevo estado de la cita
     */
    updateStatus(id: string, status: 'pending' | 'completed'): Promise<void>;
    /**
     * Convierte datos de DynamoDB a entidad de dominio
     * @param item - Item de DynamoDB
     * @returns Entidad de cita médica
     */
    private mapToEntity;
}
//# sourceMappingURL=dynamoAppointmentRepository.adapter.d.ts.map