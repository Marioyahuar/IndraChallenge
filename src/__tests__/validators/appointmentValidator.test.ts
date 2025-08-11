import { AppointmentValidator } from '../../validators/appointmentValidator';

describe('AppointmentValidator', () => {
  describe('validateCreateRequest', () => {
    it('should validate a correct appointment request', () => {
      const validRequest = {
        insuredId: '12345',
        scheduleId: 100,
        countryISO: 'PE'
      };

      const result = AppointmentValidator.validateCreateRequest(validRequest);

      expect(result).toEqual(validRequest);
    });

    it('should throw error for missing request body', () => {
      expect(() => {
        AppointmentValidator.validateCreateRequest(null);
      }).toThrow('Request body is required');
    });

    it('should throw error for invalid insuredId', () => {
      const invalidRequest = {
        insuredId: '123',
        scheduleId: 100,
        countryISO: 'PE'
      };

      expect(() => {
        AppointmentValidator.validateCreateRequest(invalidRequest);
      }).toThrow('insuredId must be exactly 5 digits');
    });

    it('should throw error for non-numeric insuredId', () => {
      const invalidRequest = {
        insuredId: 'ABCDE',
        scheduleId: 100,
        countryISO: 'PE'
      };

      expect(() => {
        AppointmentValidator.validateCreateRequest(invalidRequest);
      }).toThrow('insuredId must be exactly 5 digits');
    });

    it('should throw error for missing scheduleId', () => {
      const invalidRequest = {
        insuredId: '12345',
        countryISO: 'PE'
      };

      expect(() => {
        AppointmentValidator.validateCreateRequest(invalidRequest);
      }).toThrow('scheduleId is required and must be a number');
    });

    it('should throw error for invalid countryISO', () => {
      const invalidRequest = {
        insuredId: '12345',
        scheduleId: 100,
        countryISO: 'US'
      };

      expect(() => {
        AppointmentValidator.validateCreateRequest(invalidRequest);
      }).toThrow('countryISO must be either PE or CL');
    });
  });

  describe('validateInsuredId', () => {
    it('should validate correct insuredId', () => {
      expect(() => {
        AppointmentValidator.validateInsuredId('12345');
      }).not.toThrow();
    });

    it('should throw error for invalid insuredId', () => {
      expect(() => {
        AppointmentValidator.validateInsuredId('123');
      }).toThrow('insuredId must be exactly 5 digits');
    });
  });
});