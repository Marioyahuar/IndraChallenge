import { CountryAppointmentService } from '../../services/countryAppointmentService';
import { MySqlService } from '../../services/mysqlService';
import { EventBridgeService } from '../../services/eventBridgeService';

jest.mock('../../services/mysqlService');
jest.mock('../../services/eventBridgeService');

const mockMySqlService = MySqlService as jest.MockedClass<typeof MySqlService>;
const mockEventBridgeService = EventBridgeService as jest.MockedClass<typeof EventBridgeService>;

describe('CountryAppointmentService', () => {
  let countryService: CountryAppointmentService;
  let mockMySqlInstance: jest.Mocked<MySqlService>;
  let mockEventBridgeInstance: jest.Mocked<EventBridgeService>;

  beforeEach(() => {
    mockMySqlInstance = new mockMySqlService() as jest.Mocked<MySqlService>;
    mockEventBridgeInstance = new mockEventBridgeService() as jest.Mocked<EventBridgeService>;
    
    countryService = new CountryAppointmentService();
    (countryService as any).mysqlService = mockMySqlInstance;
    (countryService as any).eventBridgeService = mockEventBridgeInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processAppointment', () => {
    it('should process appointment successfully', async () => {
      const message = {
        id: 'test-id',
        insuredId: '12345',
        scheduleId: 100,
        countryISO: 'PE' as const
      };

      const insertId = 1;
      mockMySqlInstance.createAppointment.mockResolvedValue(insertId);
      mockEventBridgeInstance.publishAppointmentCompleted.mockResolvedValue();

      await countryService.processAppointment(message);

      expect(mockMySqlInstance.createAppointment).toHaveBeenCalledWith({
        insuredId: message.insuredId,
        scheduleId: message.scheduleId,
        countryISO: message.countryISO
      });

      expect(mockEventBridgeInstance.publishAppointmentCompleted).toHaveBeenCalledWith({
        appointmentId: message.id,
        insuredId: message.insuredId,
        scheduleId: message.scheduleId,
        countryISO: message.countryISO
      });
    });

    it('should handle MySQL error', async () => {
      const message = {
        id: 'test-id',
        insuredId: '12345',
        scheduleId: 100,
        countryISO: 'PE' as const
      };

      mockMySqlInstance.createAppointment.mockRejectedValue(new Error('MySQL error'));

      await expect(countryService.processAppointment(message)).rejects.toThrow('MySQL error');
      expect(mockEventBridgeInstance.publishAppointmentCompleted).not.toHaveBeenCalled();
    });
  });
});