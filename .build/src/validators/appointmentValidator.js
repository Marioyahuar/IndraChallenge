"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentValidator = void 0;
class AppointmentValidator {
    static validateCreateRequest(data) {
        if (!data) {
            throw new Error('Request body is required');
        }
        const { insuredId, scheduleId, countryISO } = data;
        if (!insuredId || typeof insuredId !== 'string') {
            throw new Error('insuredId is required and must be a string');
        }
        if (!/^\d{5}$/.test(insuredId)) {
            throw new Error('insuredId must be exactly 5 digits');
        }
        if (!scheduleId || typeof scheduleId !== 'number') {
            throw new Error('scheduleId is required and must be a number');
        }
        if (!countryISO || typeof countryISO !== 'string') {
            throw new Error('countryISO is required and must be a string');
        }
        if (!['PE', 'CL'].includes(countryISO)) {
            throw new Error('countryISO must be either PE or CL');
        }
        return {
            insuredId,
            scheduleId,
            countryISO: countryISO
        };
    }
    static validateInsuredId(insuredId) {
        if (!insuredId || typeof insuredId !== 'string') {
            throw new Error('insuredId is required and must be a string');
        }
        if (!/^\d{5}$/.test(insuredId)) {
            throw new Error('insuredId must be exactly 5 digits');
        }
    }
}
exports.AppointmentValidator = AppointmentValidator;
//# sourceMappingURL=appointmentValidator.js.map