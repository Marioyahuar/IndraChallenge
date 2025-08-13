/**
 * Entidad de dominio que representa un horario disponible para citas médicas
 * Encapsula la información de centro médico, especialidad, médico y fecha/hora
 */
export class ScheduleEntity {
  constructor(
    public readonly id: number,
    public readonly medicalCenterId: number,
    public readonly specialtyId: number,
    public readonly doctorId: number,
    public readonly appointmentDatetime: Date,
    public readonly durationMinutes: number,
    public isAvailable: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateScheduleData();
  }

  /**
   * Valida los datos básicos del horario
   */
  private validateScheduleData(): void {
    if (this.id <= 0) {
      throw new Error('Schedule ID debe ser un número positivo');
    }

    if (this.medicalCenterId <= 0) {
      throw new Error('Medical Center ID debe ser un número positivo');
    }

    if (this.specialtyId <= 0) {
      throw new Error('Specialty ID debe ser un número positivo');
    }

    if (this.doctorId <= 0) {
      throw new Error('Doctor ID debe ser un número positivo');
    }

    if (this.durationMinutes <= 0) {
      throw new Error('Duration debe ser un número positivo');
    }

    if (this.appointmentDatetime <= new Date()) {
      throw new Error('La fecha de la cita debe ser futura');
    }
  }

  /**
   * Marca el horario como no disponible
   * Regla de negocio: Solo se puede ocupar si está disponible
   */
  public markAsUnavailable(): void {
    if (!this.isAvailable) {
      throw new Error('El horario ya no está disponible');
    }

    this.isAvailable = false;
    this.updatedAt = new Date();
  }

  /**
   * Marca el horario como disponible nuevamente
   * Útil para cancelaciones
   */
  public markAsAvailable(): void {
    this.isAvailable = true;
    this.updatedAt = new Date();
  }

  /**
   * Verifica si el horario está disponible para reserva
   */
  public canBeBooked(): boolean {
    return this.isAvailable && this.appointmentDatetime > new Date();
  }

  /**
   * Obtiene la fecha de la cita en formato ISO string
   */
  public getAppointmentDate(): string {
    return this.appointmentDatetime.toISOString().split('T')[0];
  }

  /**
   * Obtiene la hora de la cita en formato HH:mm
   */
  public getAppointmentTime(): string {
    return this.appointmentDatetime.toTimeString().substring(0, 5);
  }

  /**
   * Obtiene los datos del horario para persistencia
   */
  public toPersistence(): {
    id: number;
    medicalCenterId: number;
    specialtyId: number;
    doctorId: number;
    appointmentDatetime: Date;
    durationMinutes: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      medicalCenterId: this.medicalCenterId,
      specialtyId: this.specialtyId,
      doctorId: this.doctorId,
      appointmentDatetime: this.appointmentDatetime,
      durationMinutes: this.durationMinutes,
      isAvailable: this.isAvailable,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}