"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const countryAppointmentService_1 = require("../services/countryAppointmentService");
const countryService = new countryAppointmentService_1.CountryAppointmentService('PE');
const handler = async (event) => {
    try {
        console.log(`Processing ${event.Records.length} PE appointments`);
        for (const record of event.Records) {
            const message = JSON.parse(record.body);
            if (message.Message) {
                const sqsMessage = JSON.parse(message.Message);
                console.log(`Processing PE appointment for insuredId: ${sqsMessage.insuredId}`);
                await countryService.processAppointment(sqsMessage);
            }
            else {
                console.log(`Processing direct PE appointment for insuredId: ${message.insuredId}`);
                await countryService.processAppointment(message);
            }
        }
        console.log('All PE appointments processed successfully');
    }
    catch (error) {
        console.error('Error processing PE appointments:', error);
        throw error;
    }
};
exports.handler = handler;
//# sourceMappingURL=appointmentPe.js.map