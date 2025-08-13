"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecord = void 0;
/**
 * Entidad de dominio que representa un registro médico
 * Almacenado en la base de datos específica por país
 */
class MedicalRecord {
    insuredId;
    scheduleId;
    countryISO;
    appointmentId;
    createdAt;
    id;
    constructor(insuredId, scheduleId, countryISO, appointmentId, createdAt, id) {
        this.insuredId = insuredId;
        this.scheduleId = scheduleId;
        this.countryISO = countryISO;
        this.appointmentId = appointmentId;
        this.createdAt = createdAt;
        this.id = id;
        this.validateData();
    }
    /**
     * Valida los datos del registro médico según las reglas de negocio
     */
    validateData() {
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
    toPersistence() {
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
    static fromPersistence(data) {
        return new MedicalRecord(data.insuredId, data.scheduleId, data.countryISO, data.appointmentId, data.createdAt, data.id);
    }
}
exports.MedicalRecord = MedicalRecord;
//# sourceMappingURL=medicalRecord.entity.js.map