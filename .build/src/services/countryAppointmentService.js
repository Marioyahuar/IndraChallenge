"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryAppointmentService = void 0;
const mysqlService_1 = require("./mysqlService");
const eventBridgeService_1 = require("./eventBridgeService");
class CountryAppointmentService {
    mysqlService;
    eventBridgeService;
    constructor(countryISO) {
        this.mysqlService = new mysqlService_1.MySqlService(countryISO);
        this.eventBridgeService = new eventBridgeService_1.EventBridgeService();
    }
    async processAppointment(message) {
        const mysqlAppointment = {
            insuredId: message.insuredId,
            scheduleId: message.scheduleId,
            countryISO: message.countryISO
        };
        const insertId = await this.mysqlService.createAppointment(mysqlAppointment);
        console.log(`Appointment saved to MySQL with ID: ${insertId} for country: ${message.countryISO}`);
        const eventDetail = {
            appointmentId: message.id,
            insuredId: message.insuredId,
            scheduleId: message.scheduleId,
            countryISO: message.countryISO
        };
        await this.eventBridgeService.publishAppointmentCompleted(eventDetail);
        console.log(`EventBridge event published for appointment: ${message.id}`);
    }
}
exports.CountryAppointmentService = CountryAppointmentService;
//# sourceMappingURL=countryAppointmentService.js.map