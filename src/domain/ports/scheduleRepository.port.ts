import { ScheduleEntity } from '../entities/schedule.entity';

/**
 * Puerto de repositorio para operaciones con horarios médicos
 * Define las operaciones necesarias para la gestión de schedules
 */
export interface ScheduleRepositoryPort {
  /**
   * Busca un horario por su ID
   * @param scheduleId - ID del horario
   * @param countryISO - País del horario
   * @returns Horario encontrado o null si no existe
   */
  findById(scheduleId: number, countryISO: 'PE' | 'CL'): Promise<ScheduleEntity | null>;

  /**
   * Busca horarios disponibles por filtros
   * @param filters - Filtros de búsqueda
   * @returns Lista de horarios disponibles
   */
  findAvailableSchedules(filters: {
    medicalCenterId?: number;
    specialtyId?: number;
    doctorId?: number;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<ScheduleEntity[]>;

  /**
   * Marca un horario como no disponible
   * @param scheduleId - ID del horario a marcar como no disponible
   * @param countryISO - País del horario
   * @returns true si se actualizó correctamente
   */
  markAsUnavailable(scheduleId: number, countryISO: 'PE' | 'CL'): Promise<boolean>;

  /**
   * Marca un horario como disponible nuevamente
   * @param scheduleId - ID del horario a marcar como disponible
   * @param countryISO - País del horario
   * @returns true si se actualizó correctamente
   */
  markAsAvailable(scheduleId: number, countryISO: 'PE' | 'CL'): Promise<boolean>;

  /**
   * Obtiene información completa del horario con datos relacionados
   * @param scheduleId - ID del horario
   * @param countryISO - País del horario
   * @returns Horario con información del centro médico, especialidad y doctor
   */
  findByIdWithDetails(scheduleId: number, countryISO: 'PE' | 'CL'): Promise<{
    schedule: ScheduleEntity;
    medicalCenter: { id: number; name: string; countryISO: string };
    specialty: { id: number; name: string };
    doctor: { id: number; firstName: string; lastName: string };
  } | null>;
}