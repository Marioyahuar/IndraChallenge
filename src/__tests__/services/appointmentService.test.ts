import { AppointmentService } from '../../services/appointmentService';
import { DynamoService } from '../../services/dynamoService';
import { SnsService } from '../../services/snsService';

jest.mock('../../services/dynamoService');
jest.mock('../../services/snsService');

const mockDynamoService = DynamoService as jest.MockedClass<typeof DynamoService>;
const mockSnsService = SnsService as jest.MockedClass<typeof SnsService>;

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;
  let mockDynamoInstance: jest.Mocked<DynamoService>;
  let mockSnsInstance: jest.Mocked<SnsService>;

  beforeEach(() => {
    mockDynamoInstance = new mockDynamoService() as jest.Mocked<DynamoService>;
    mockSnsInstance = new mockSnsService() as jest.Mocked<SnsService>;
    
    appointmentService = new AppointmentService();
    (appointmentService as any).dynamoService = mockDynamoInstance;
    (appointmentService as any).snsService = mockSnsInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      const request = {
        insuredId: '12345',
        scheduleId: 100,
        countryISO: 'PE' as const
      };

      mockDynamoInstance.createAppointment.mockResolvedValue();
      mockSnsInstance.publishAppointment.mockResolvedValue();

      const result = await appointmentService.createAppointment(request);

      expect(result).toMatchObject({
        insuredId: request.insuredId,
        scheduleId: request.scheduleId,
        countryISO: request.countryISO,
        status: 'pending'
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      
      expect(mockDynamoInstance.createAppointment).toHaveBeenCalledTimes(1);
      expect(mockSnsInstance.publishAppointment).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAppointmentsByInsuredId', () => {
    it('should return appointments for insured id', async () => {
      const insuredId = '12345';
      const mockAppointments = [{
        id: 'test-id',
        insuredId,
        scheduleId: 100,
        countryISO: 'PE' as const,
        status: 'pending' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }];

      mockDynamoInstance.getAppointmentsByInsuredId.mockResolvedValue(mockAppointments);

      const result = await appointmentService.getAppointmentsByInsuredId(insuredId);

      expect(result).toEqual(mockAppointments);
      expect(mockDynamoInstance.getAppointmentsByInsuredId).toHaveBeenCalledWith(insuredId);
    });
  });

  describe('updateAppointmentStatus', () => {
    it('should update appointment status', async () => {
      const appointmentId = 'test-id';
      const status = 'completed';

      mockDynamoInstance.updateAppointmentStatus.mockResolvedValue();

      await appointmentService.updateAppointmentStatus(appointmentId, status);

      expect(mockDynamoInstance.updateAppointmentStatus).toHaveBeenCalledWith(appointmentId, status);
    });
  });
});