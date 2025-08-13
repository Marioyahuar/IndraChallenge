"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentsByInsuredUseCase = void 0;
/**
 * Caso de uso para obtener todas las citas de un asegurado
 * Implementa la consulta de citas siguiendo principios CQRS
 */
class GetAppointmentsByInsuredUseCase {
    appointmentRepository;
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    /**
     * Ejecuta el caso de uso de consulta de citas por asegurado
     * @param request - Datos de entrada con el ID del asegurado
     * @returns Lista de citas del asegurado ordenadas por fecha
     */
    async execute(request) {
        // 1. Validar el ID del asegurado
        this.validateInsuredId(request.insuredId);
        // 2. Consultar citas en el repositorio
        const appointments = await this.appointmentRepository.findByInsuredId(request.insuredId);
        // 3. Mapear entidades de dominio a DTOs de respuesta
        const appointmentDtos = appointments.map(appointment => ({
            id: appointment.id,
            insuredId: appointment.insuredId,
            scheduleId: appointment.scheduleId,
            countryISO: appointment.countryISO,
            status: appointment.status,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt
        }));
        return {
            appointments: appointmentDtos,
            totalCount: appointmentDtos.length
        };
    }
    /**
     * Valida que el ID del asegurado tenga el formato correcto
     * @param insuredId - ID del asegurado a validar
     */
    validateInsuredId(insuredId) {
        if (!insuredId || typeof insuredId !== 'string') {
            throw new Error('InsuredId es requerido y debe ser string');
        }
        if (!/^\d{5}$/.test(insuredId)) {
            throw new Error('InsuredId debe tener exactamente 5 dígitos');
        }
    }
}
exports.GetAppointmentsByInsuredUseCase = GetAppointmentsByInsuredUseCase;
//# sourceMappingURL=getAppointmentsByInsured.usecase.js.map