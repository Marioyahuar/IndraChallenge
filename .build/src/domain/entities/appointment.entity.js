"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentEntity = void 0;
/**
 * Entidad de dominio que representa una cita médica
 * Contiene la lógica de negocio y las reglas de dominio
 */
class AppointmentEntity {
    id;
    insuredId;
    scheduleId;
    countryISO;
    status;
    createdAt;
    updatedAt;
    constructor(id, insuredId, scheduleId, countryISO, status, createdAt, updatedAt) {
        this.id = id;
        this.insuredId = insuredId;
        this.scheduleId = scheduleId;
        this.countryISO = countryISO;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validateInsuredId(insuredId);
        this.validateScheduleId(scheduleId);
        this.validateCountryISO(countryISO);
    }
    /**
     * Valida que el ID del asegurado tenga el formato correcto
     * Regla de negocio: Debe ser exactamente 5 dígitos
     */
    validateInsuredId(insuredId) {
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
    validateScheduleId(scheduleId) {
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
    validateCountryISO(countryISO) {
        if (!['PE', 'CL'].includes(countryISO)) {
            throw new Error('CountryISO debe ser PE o CL');
        }
    }
    /**
     * Marca la cita como completada
     * Regla de negocio: Solo se puede completar si está pendiente
     */
    complete() {
        if (this.status === 'completed') {
            throw new Error('La cita ya está completada');
        }
        this.status = 'completed';
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Verifica si la cita está pendiente de procesamiento
     */
    isPending() {
        return this.status === 'pending';
    }
    /**
     * Verifica si la cita ya fue completada
     */
    isCompleted() {
        return this.status === 'completed';
    }
    /**
     * Obtiene los datos de la cita para persistencia
     */
    toPersistence() {
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
exports.AppointmentEntity = AppointmentEntity;
//# sourceMappingURL=appointment.entity.js.map