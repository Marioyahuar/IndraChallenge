/**
 * Entidad de dominio que representa una cita médica
 * Contiene la lógica de negocio y las reglas de dominio
 */
export class AppointmentEntity {
  constructor(
    public readonly id: string,
    public readonly insuredId: string,
    public readonly scheduleId: number,
    public readonly countryISO: 'PE' | 'CL',
    public status: 'pending' | 'completed',
    public readonly createdAt: string,
    public updatedAt: string
  ) {
    this.validateInsuredId(insuredId);
    this.validateScheduleId(scheduleId);
    this.validateCountryISO(countryISO);
  }

  /**
   * Valida que el ID del asegurado tenga el formato correcto
   * Regla de negocio: Debe ser exactamente 5 dígitos
   */
  private validateInsuredId(insuredId: string): void {
    if (!insuredId || typeof insuredId !== 'string') {
      throw new Error('InsuredId es requerido y debe ser string');
    }

    if (!/^\d{5}$/.test(insuredId)) {
      throw new Error('InsuredId debe tener exactamente 5 dígitos');
    }
  }

  /**
   * Valida que el ID del horario sea válido
   * Regla de negocio: Debe ser un número positivo
   */
  private validateScheduleId(scheduleId: number): void {
    if (!scheduleId || typeof scheduleId !== 'number') {
      throw new Error('ScheduleId es requerido y debe ser número');
    }

    if (scheduleId <= 0) {
      throw new Error('ScheduleId debe ser un número positivo');
    }
  }

  /**
   * Valida que el código de país sea válido
   * Regla de negocio: Solo acepta PE (Perú) o CL (Chile)
   */
  private validateCountryISO(countryISO: string): void {
    if (!['PE', 'CL'].includes(countryISO)) {
      throw new Error('CountryISO debe ser PE o CL');
    }
  }

  /**
   * Marca la cita como completada
   * Regla de negocio: Solo se puede completar si está pendiente
   */
  public complete(): void {
    if (this.status === 'completed') {
      throw new Error('La cita ya está completada');
    }

    this.status = 'completed';
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Verifica si la cita está pendiente de procesamiento
   */
  public isPending(): boolean {
    return this.status === 'pending';
  }

  /**
   * Verifica si la cita ya fue completada
   */
  public isCompleted(): boolean {
    return this.status === 'completed';
  }

  /**
   * Obtiene los datos de la cita para persistencia
   */
  public toPersistence(): {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this.id,
      insuredId: this.insuredId,
      scheduleId: this.scheduleId,
      countryISO: this.countryISO,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}