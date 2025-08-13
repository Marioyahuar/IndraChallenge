-- Script completo para crear las bases de datos y tablas
-- Para el sistema de agendamiento de citas médicas Rimac

-- ===================================================
-- ELIMINAR BASES DE DATOS EXISTENTES (si existen)
-- ===================================================

DROP DATABASE IF EXISTS appointments_pe;
DROP DATABASE IF EXISTS appointments_cl;

-- ===================================================
-- CREAR BASES DE DATOS
-- ===================================================

-- Base de datos para Perú
CREATE DATABASE appointments_pe 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Base de datos para Chile
CREATE DATABASE appointments_cl 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- ===================================================
-- CREAR TABLAS PARA PERÚ
-- ===================================================

USE appointments_pe;

CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  insuredId VARCHAR(5) NOT NULL COMMENT 'Código del asegurado (5 dígitos)',
  scheduleId INT NOT NULL COMMENT 'ID del espacio de cita (centro médico + especialidad + médico + fecha)',
  countryISO CHAR(2) NOT NULL DEFAULT 'PE' COMMENT 'Código de país ISO',
  appointmentId VARCHAR(36) NOT NULL COMMENT 'UUID de la cita en DynamoDB',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  
  -- Índices para optimizar consultas
  INDEX idx_insured_id (insuredId),
  INDEX idx_appointment_id (appointmentId),
  INDEX idx_schedule_id (scheduleId),
  INDEX idx_created_at (createdAt),
  
  -- Constraints
  CONSTRAINT chk_insured_id_pe CHECK (insuredId REGEXP '^[0-9]{5}$'),
  CONSTRAINT chk_country_pe CHECK (countryISO = 'PE')
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabla de citas médicas procesadas para Perú';

-- ===================================================
-- CREAR TABLAS PARA CHILE
-- ===================================================

USE appointments_cl;

CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  insuredId VARCHAR(5) NOT NULL COMMENT 'Código del asegurado (5 dígitos)',
  scheduleId INT NOT NULL COMMENT 'ID del espacio de cita (centro médico + especialidad + médico + fecha)',
  countryISO CHAR(2) NOT NULL DEFAULT 'CL' COMMENT 'Código de país ISO',
  appointmentId VARCHAR(36) NOT NULL COMMENT 'UUID de la cita en DynamoDB',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  
  -- Índices para optimizar consultas
  INDEX idx_insured_id (insuredId),
  INDEX idx_appointment_id (appointmentId),
  INDEX idx_schedule_id (scheduleId),
  INDEX idx_created_at (createdAt),
  
  -- Constraints
  CONSTRAINT chk_insured_id_cl CHECK (insuredId REGEXP '^[0-9]{5}$'),
  CONSTRAINT chk_country_cl CHECK (countryISO = 'CL')
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabla de citas médicas procesadas para Chile';

-- ===================================================
-- VERIFICAR CREACIÓN
-- ===================================================

-- Mostrar bases de datos creadas
SHOW DATABASES LIKE 'appointments_%';

-- Verificar tabla de Perú
USE appointments_pe;
DESCRIBE appointments;
SELECT COUNT(*) as 'Registros en appointments_pe' FROM appointments;

-- Verificar tabla de Chile  
USE appointments_cl;
DESCRIBE appointments;
SELECT COUNT(*) as 'Registros en appointments_cl' FROM appointments;

-- ===================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ===================================================

-- Insertar datos de prueba en Perú
USE appointments_pe;
INSERT INTO appointments (insuredId, scheduleId, countryISO, appointmentId) VALUES 
('12345', 100, 'PE', 'test-uuid-pe-001'),
('67890', 101, 'PE', 'test-uuid-pe-002');

-- Insertar datos de prueba en Chile
USE appointments_cl;
INSERT INTO appointments (insuredId, scheduleId, countryISO, appointmentId) VALUES 
('11111', 200, 'CL', 'test-uuid-cl-001'),
('22222', 201, 'CL', 'test-uuid-cl-002');

-- Verificar datos insertados
USE appointments_pe;
SELECT * FROM appointments;

USE appointments_cl;
SELECT * FROM appointments;

-- ===================================================
-- INFORMACIÓN DE CONFIGURACIÓN
-- ===================================================

SELECT 'Setup completed successfully!' as Status;
SELECT 'Peru database: appointments_pe' as Info;
SELECT 'Chile database: appointments_cl' as Info;
SELECT 'Both databases ready for Rimac appointment system' as Info;