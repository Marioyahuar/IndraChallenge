"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const uuid_1 = require("uuid");
const dynamoService_1 = require("./dynamoService");
const snsService_1 = require("./snsService");
class AppointmentService {
    dynamoService;
    snsService;
    constructor() {
        this.dynamoService = new dynamoService_1.DynamoService();
        this.snsService = new snsService_1.SnsService();
    }
    async createAppointment(request) {
        const now = new Date().toISOString();
        const appointment = {
            id: (0, uuid_1.v4)(),
            insuredId: request.insuredId,
            scheduleId: request.scheduleId,
            countryISO: request.countryISO,
            status: 'pending',
            createdAt: now,
            updatedAt: now
        };
        await this.dynamoService.createAppointment(appointment);
        await this.snsService.publishAppointment({
            id: appointment.id,
            insuredId: appointment.insuredId,
            scheduleId: appointment.scheduleId,
            countryISO: appointment.countryISO
        });
        return this.mapToResponse(appointment);
    }
    async getAppointmentsByInsuredId(insuredId) {
        const appointments = await this.dynamoService.getAppointmentsByInsuredId(insuredId);
        return appointments.map(this.mapToResponse);
    }
    async updateAppointmentStatus(appointmentId, status) {
        await this.dynamoService.updateAppointmentStatus(appointmentId, status);
    }
    mapToResponse(entity) {
        return {
            id: entity.id,
            insuredId: entity.insuredId,
            scheduleId: entity.scheduleId,
            countryISO: entity.countryISO,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=appointmentService.js.map