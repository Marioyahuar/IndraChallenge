/**
 * Entidad de dominio que representa un doctor
 */
export class DoctorEntity {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly medicalLicense: string,
    public readonly specialtyId: number,
    public readonly medicalCenterId: number,
    public readonly email: string,
    public readonly phone: string,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateDoctorData();
  }

  private validateDoctorData(): void {
    if (!this.firstName || this.firstName.trim().length === 0) {
      throw new Error('Nombre del doctor es requerido');
    }

    if (!this.lastName || this.lastName.trim().length === 0) {
      throw new Error('Apellido del doctor es requerido');
    }

    if (!this.medicalLicense || this.medicalLicense.trim().length === 0) {
      throw new Error('Colegiatura médica es requerida');
    }

    if (this.specialtyId <= 0) {
      throw new Error('Specialty ID debe ser un número positivo');
    }

    if (this.medicalCenterId <= 0) {
      throw new Error('Medical Center ID debe ser un número positivo');
    }

    if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new Error('Email debe tener formato válido');
    }
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public toPersistence() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      medicalLicense: this.medicalLicense,
      specialtyId: this.specialtyId,
      medicalCenterId: this.medicalCenterId,
      email: this.email,
      phone: this.phone,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}