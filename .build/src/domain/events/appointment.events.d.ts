/**
 * Evento de dominio que se dispara cuando se crea una nueva cita
 * Representa un hecho importante en el dominio que otros contextos deben conocer
 */
export declare class AppointmentCreatedEvent {
    readonly appointmentId: string;
    readonly insuredId: string;
    readonly scheduleId: number;
    readonly countryISO: 'PE' | 'CL';
    readonly occurredAt: string;
    constructor(appointmentId: string, insuredId: string, scheduleId: number, countryISO: 'PE' | 'CL', occurredAt?: string);
    /**
     * Convierte el evento a formato para mensajería
     */
    toMessage(): {
        id: string;
        insuredId: string;
        scheduleId: number;
        countryISO: 'PE' | 'CL';
        occurredAt: string;
    };
}
/**
 * Evento de dominio que se dispara cuando una cita se completa
 * Indica que el procesamiento por país fue exitoso
 */
export declare class AppointmentCompletedEvent {
    readonly appointmentId: string;
    readonly insuredId: string;
    readonly scheduleId: number;
    readonly countryISO: 'PE' | 'CL';
    readonly medicalRecordId: number;
    readonly occurredAt: string;
    constructor(appointmentId: string, insuredId: string, scheduleId: number, countryISO: 'PE' | 'CL', medicalRecordId: number, occurredAt?: string);
    /**
     * Convierte el evento a formato para EventBridge
     */
    toEventBridge(): {
        appointmentId: string;
        insuredId: string;
        scheduleId: number;
        countryISO: 'PE' | 'CL';
        medicalRecordId: number;
        occurredAt: string;
    };
}
//# sourceMappingURL=appointment.events.d.ts.map