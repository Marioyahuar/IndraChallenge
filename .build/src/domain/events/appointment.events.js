"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentCompletedEvent = exports.AppointmentCreatedEvent = void 0;
/**
 * Evento de dominio que se dispara cuando se crea una nueva cita
 * Representa un hecho importante en el dominio que otros contextos deben conocer
 */
class AppointmentCreatedEvent {
    appointmentId;
    insuredId;
    scheduleId;
    countryISO;
    occurredAt;
    constructor(appointmentId, insuredId, scheduleId, countryISO, occurredAt = new Date().toISOString()) {
        this.appointmentId = appointmentId;
        this.insuredId = insuredId;
        this.scheduleId = scheduleId;
        this.countryISO = countryISO;
        this.occurredAt = occurredAt;
    }
    /**
     * Convierte el evento a formato para mensajería
     */
    toMessage() {
        return {
            id: this.appointmentId,
            insuredId: this.insuredId,
            scheduleId: this.scheduleId,
            countryISO: this.countryISO,
            occurredAt: this.occurredAt
        };
    }
}
exports.AppointmentCreatedEvent = AppointmentCreatedEvent;
/**
 * Evento de dominio que se dispara cuando una cita se completa
 * Indica que el procesamiento por país fue exitoso
 */
class AppointmentCompletedEvent {
    appointmentId;
    insuredId;
    scheduleId;
    countryISO;
    medicalRecordId;
    occurredAt;
    constructor(appointmentId, insuredId, scheduleId, countryISO, medicalRecordId, occurredAt = new Date().toISOString()) {
        this.appointmentId = appointmentId;
        this.insuredId = insuredId;
        this.scheduleId = scheduleId;
        this.countryISO = countryISO;
        this.medicalRecordId = medicalRecordId;
        this.occurredAt = occurredAt;
    }
    /**
     * Convierte el evento a formato para EventBridge
     */
    toEventBridge() {
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
exports.AppointmentCompletedEvent = AppointmentCompletedEvent;
//# sourceMappingURL=appointment.events.js.map