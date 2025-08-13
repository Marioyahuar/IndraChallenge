/**
 * Entidad de dominio que representa una especialidad médica
 */
export class SpecialtyEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateSpecialtyData();
  }

  private validateSpecialtyData(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre de la especialidad es requerido');
    }
  }

  public toPersistence() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}