import { AppointmentCreatedEvent, AppointmentCompletedEvent } from '../events/appointment.events';

/**
 * Puerto para la publicación de eventos de dominio
 * Abstrae el mecanismo de mensajería (SNS, EventBridge, etc.)
 */
export interface EventPublisherPort {
  /**
   * Publica un evento cuando se crea una nueva cita
   * @param event - Evento de cita creada con todos los datos necesarios
   */
  publishAppointmentCreated(event: AppointmentCreatedEvent): Promise<void>;

  /**
   * Publica un evento cuando una cita se completa exitosamente
   * @param event - Evento de cita completada con detalles del procesamiento
   */
  publishAppointmentCompleted(event: AppointmentCompletedEvent): Promise<void>;
}