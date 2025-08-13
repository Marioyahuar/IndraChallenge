/**
 * Entidad de dominio que representa un centro médico
 */
export class MedicalCenterEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly address: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly countryISO: 'PE' | 'CL',
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateMedicalCenterData();
  }

  private validateMedicalCenterData(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre del centro médico es requerido');
    }

    if (!['PE', 'CL'].includes(this.countryISO)) {
      throw new Error('CountryISO debe ser PE o CL');
    }

    if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new Error('Email debe tener formato válido');
    }
  }

  public toPersistence() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      phone: this.phone,
      email: this.email,
      countryISO: this.countryISO,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}