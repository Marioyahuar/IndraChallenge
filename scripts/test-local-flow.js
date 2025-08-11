#!/usr/bin/env node

// Script para simular el flujo completo localmente
const { AppointmentService } = require('../dist/src/services/appointmentService');
const { CountryAppointmentService } = require('../dist/src/services/countryAppointmentService');

async function testCompleteFlow() {
  console.log('🚀 Testing complete appointment flow locally...\n');

  try {
    // 1. Crear cita (simula POST /appointments)
    const appointmentService = new AppointmentService();
    const request = {
      insuredId: '12345',
      scheduleId: 100,
      countryISO: 'PE'
    };

    console.log('1. Creating appointment...');
    const appointment = await appointmentService.createAppointment(request);
    console.log('✅ Appointment created:', appointment);

    // 2. Simular procesamiento por país (simula SQS -> Lambda)
    console.log('\n2. Processing country-specific appointment...');
    const countryService = new CountryAppointmentService('PE');
    const sqsMessage = {
      id: appointment.id,
      insuredId: appointment.insuredId,
      scheduleId: appointment.scheduleId,
      countryISO: appointment.countryISO
    };

    await countryService.processAppointment(sqsMessage);
    console.log('✅ Country processing completed');

    // 3. Simular actualización de estado (simula EventBridge -> SQS -> Lambda)
    console.log('\n3. Updating appointment status...');
    await appointmentService.updateAppointmentStatus(appointment.id, 'completed');
    console.log('✅ Status updated to completed');

    // 4. Verificar resultado final
    console.log('\n4. Getting final appointments...');
    const appointments = await appointmentService.getAppointmentsByInsuredId(request.insuredId);
    console.log('✅ Final appointments:', appointments);

    console.log('\n🎉 Complete flow test successful!');

  } catch (error) {
    console.error('❌ Flow test failed:', error.message);
    process.exit(1);
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  testCompleteFlow();
}

module.exports = { testCompleteFlow };