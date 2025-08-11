import { MySqlService } from './mysqlService';
import { EventBridgeService } from './eventBridgeService';
import { SqsMessage, EventBridgeDetail } from '../types';

export class CountryAppointmentService {
  private mysqlService: MySqlService;
  private eventBridgeService: EventBridgeService;

  constructor(countryISO: 'PE' | 'CL') {
    this.mysqlService = new MySqlService(countryISO);
    this.eventBridgeService = new EventBridgeService();
  }

  async processAppointment(message: SqsMessage): Promise<void> {
    const mysqlAppointment = {
      insuredId: message.insuredId,
      scheduleId: message.scheduleId,
      countryISO: message.countryISO
    };

    const insertId = await this.mysqlService.createAppointment(mysqlAppointment);
    
    console.log(`Appointment saved to MySQL with ID: ${insertId} for country: ${message.countryISO}`);

    const eventDetail: EventBridgeDetail = {
      appointmentId: message.id,
      insuredId: message.insuredId,
      scheduleId: message.scheduleId,
      countryISO: message.countryISO
    };

    await this.eventBridgeService.publishAppointmentCompleted(eventDetail);
    
    console.log(`EventBridge event published for appointment: ${message.id}`);
  }
}