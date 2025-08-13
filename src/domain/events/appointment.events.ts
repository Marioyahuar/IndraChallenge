/**
 * Evento de dominio que se dispara cuando se crea una nueva cita
 * Representa un hecho importante en el dominio que otros contextos deben conocer
 */
export class AppointmentCreatedEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly insuredId: string,
    public readonly scheduleId: number,
    public readonly countryISO: 'PE' | 'CL',
    public readonly occurredAt: string = new Date().toISOString()
  ) {}

  /**
   * Convierte el evento a formato para mensajería
   */
  public toMessage(): {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
    occurredAt: string;
  } {
    return {
      id: this.appointmentId,
      insuredId: this.insuredId,
      scheduleId: this.scheduleId,
      countryISO: this.countryISO,
      occurredAt: this.occurredAt
    };
  }
}

/**
 * Evento de dominio que se dispara cuando una cita se completa
 * Indica que el procesamiento por país fue exitoso
 */
export class AppointmentCompletedEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly insuredId: string,
    public readonly scheduleId: number,
    public readonly countryISO: 'PE' | 'CL',
    public readonly medicalRecordId: number,
    public readonly occurredAt: string = new Date().toISOString()
  ) {}

  /**
   * Convierte el evento a formato para EventBridge
   */
  public toEventBridge(): {
    appointmentId: string;
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
    medicalRecordId: number;
    occurredAt: string;
  } {
    return {
      appointmentId: this.appointmentId,
      insuredId: this.insuredId,
      scheduleId: this.scheduleId,
      countryISO: this.countryISO,
      medicalRecordId: this.medicalRecordId,
      occurredAt: this.occurredAt
    };
  }
}