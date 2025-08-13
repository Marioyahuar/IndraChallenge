/**
 * Entidad de dominio que representa un registro médico
 * Almacenado en la base de datos específica por país
 */
export class MedicalRecord {
  constructor(
    public readonly insuredId: string,
    public readonly scheduleId: number,
    public readonly countryISO: 'PE' | 'CL',
    public readonly appointmentId: string,
    public readonly createdAt?: Date,
    public readonly id?: number
  ) {
    this.validateData();
  }

  /**
   * Valida los datos del registro médico según las reglas de negocio
   */
  private validateData(): void {
    if (!this.insuredId || !/^\d{5}$/.test(this.insuredId)) {
      throw new Error('InsuredId debe tener exactamente 5 dígitos');
    }

    if (!this.scheduleId || this.scheduleId <= 0) {
      throw new Error('ScheduleId debe ser un número positivo');
    }

    if (!['PE', 'CL'].includes(this.countryISO)) {
      throw new Error('CountryISO debe ser PE o CL');
    }

    if (!this.appointmentId) {
      throw new Error('AppointmentId es requerido');
    }
  }

  /**
   * Convierte la entidad a formato para persistencia en MySQL
   */
  public toPersistence(): {
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
    appointmentId: string;
  } {
    return {
      insuredId: this.insuredId,
      scheduleId: this.scheduleId,
      countryISO: this.countryISO,
      appointmentId: this.appointmentId
    };
  }

  /**
   * Crea un registro médico desde los datos de persistencia
   */
  public static fromPersistence(data: any): MedicalRecord {
    return new MedicalRecord(
      data.insuredId,
      data.scheduleId,
      data.countryISO,
      data.appointmentId,
      data.createdAt,
      data.id
    );
  }
}