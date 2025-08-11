import { v4 as uuidv4 } from 'uuid';
import { AppointmentRequest, AppointmentEntity, AppointmentResponse } from '../types';
import { DynamoService } from './dynamoService';
import { SnsService } from './snsService';

export class AppointmentService {
  private dynamoService: DynamoService;
  private snsService: SnsService;

  constructor() {
    this.dynamoService = new DynamoService();
    this.snsService = new SnsService();
  }

  async createAppointment(request: AppointmentRequest): Promise<AppointmentResponse> {
    const now = new Date().toISOString();
    const appointment: AppointmentEntity = {
      id: uuidv4(),
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

  async getAppointmentsByInsuredId(insuredId: string): Promise<AppointmentResponse[]> {
    const appointments = await this.dynamoService.getAppointmentsByInsuredId(insuredId);
    return appointments.map(this.mapToResponse);
  }

  async updateAppointmentStatus(appointmentId: string, status: 'pending' | 'completed'): Promise<void> {
    await this.dynamoService.updateAppointmentStatus(appointmentId, status);
  }

  private mapToResponse(entity: AppointmentEntity): AppointmentResponse {
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