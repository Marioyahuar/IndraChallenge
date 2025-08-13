/**
 * Entidad de dominio que representa una cita médica
 * Contiene la lógica de negocio y las reglas de dominio
 */
export declare class AppointmentEntity {
    readonly id: string;
    readonly insuredId: string;
    readonly scheduleId: number;
    readonly countryISO: 'PE' | 'CL';
    status: 'pending' | 'completed';
    readonly createdAt: string;
    updatedAt: string;
    constructor(id: string, insuredId: string, scheduleId: number, countryISO: 'PE' | 'CL', status: 'pending' | 'completed', createdAt: string, updatedAt: string);
    /**
     * Valida que el ID del asegurado tenga el formato correcto
     * Regla de negocio: Debe ser exactamente 5 dígitos
     */
    private validateInsuredId;
    /**
     * Valida que el ID del horario sea válido
     * Regla de negocio: Debe ser un número positivo
     */
    private validateScheduleId;
    /**
     * Valida que el código de país sea válido
     * Regla de negocio: Solo acepta PE (Perú) o CL (Chile)
     */
    private validateCountryISO;
    /**
     * Marca la cita como completada
     * Regla de negocio: Solo se puede completar si está pendiente
     */
    complete(): void;
    /**
     * Verifica si la cita está pendiente de procesamiento
     */
    isPending(): boolean;
    /**
     * Verifica si la cita ya fue completada
     */
    isCompleted(): boolean;
    /**
     * Obtiene los datos de la cita para persistencia
     */
    toPersistence(): {
        id: string;
        insuredId: string;
        scheduleId: number;
        countryISO: 'PE' | 'CL';
        status: 'pending' | 'completed';
        createdAt: string;
        updatedAt: string;
    };
}
//# sourceMappingURL=appointment.entity.d.ts.map