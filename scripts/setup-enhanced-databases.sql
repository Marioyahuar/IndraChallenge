-- Rimac Medical Appointment System - Enhanced Database Schema
-- Modelo completo con schedules y tablas de referencia

-- ================================
-- TABLAS DE REFERENCIA
-- ================================

-- Centros médicos
CREATE TABLE medical_centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(100),
    country_iso CHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Especialidades médicas
CREATE TABLE specialties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctores
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    medical_license VARCHAR(50) NOT NULL UNIQUE,
    specialty_id INT NOT NULL,
    medical_center_id INT NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id),
    FOREIGN KEY (medical_center_id) REFERENCES medical_centers(id)
);

-- ================================
-- TABLA DE HORARIOS DISPONIBLES
-- ================================

-- Schedules - Slots de tiempo disponibles para citas
CREATE TABLE schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medical_center_id INT NOT NULL,
    specialty_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_datetime DATETIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_center_id) REFERENCES medical_centers(id),
    FOREIGN KEY (specialty_id) REFERENCES specialties(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    UNIQUE KEY unique_schedule (doctor_id, appointment_datetime)
);

-- ================================
-- TABLA DE CITAS ACTUALIZADA
-- ================================

-- Appointments - Tabla actualizada con referencia a schedule
DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    insured_id VARCHAR(50) NOT NULL,
    schedule_id INT NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    medical_record_id INT NULL,
    country_iso CHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id),
    UNIQUE KEY unique_appointment (insured_id, schedule_id),
    INDEX idx_insured_id (insured_id),
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_country_iso (country_iso)
);

-- ================================
-- DATOS DE EJEMPLO
-- ================================

-- Insertar centro médico
INSERT INTO medical_centers (name, address, phone, email, country_iso) VALUES
('Centro Médico Rimac Lima', 'Av. Javier Prado Este 4200, Lima', '+51-1-411-1111', 'lima@rimac.com', 'PE');

-- Insertar especialidades
INSERT INTO specialties (name, description) VALUES
('Cardiología', 'Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón'),
('Medicina General', 'Atención médica integral y continuada para pacientes de todas las edades'),
('Psicología', 'Evaluación, diagnóstico y tratamiento de trastornos mentales y del comportamiento');

-- Insertar doctores
INSERT INTO doctors (first_name, last_name, medical_license, specialty_id, medical_center_id, email, phone) VALUES
-- Cardiología
('Carlos', 'Rodriguez', 'CMP-12345', 1, 1, 'carlos.rodriguez@rimac.com', '+51-999-111-001'),
('Ana', 'Martinez', 'CMP-12346', 1, 1, 'ana.martinez@rimac.com', '+51-999-111-002'),
-- Medicina General
('Luis', 'Garcia', 'CMP-12347', 2, 1, 'luis.garcia@rimac.com', '+51-999-111-003'),
('Maria', 'Lopez', 'CMP-12348', 2, 1, 'maria.lopez@rimac.com', '+51-999-111-004'),
-- Psicología
('Sofia', 'Hernandez', 'CPsP-98765', 3, 1, 'sofia.hernandez@rimac.com', '+51-999-111-005'),
('Diego', 'Torres', 'CPsP-98766', 3, 1, 'diego.torres@rimac.com', '+51-999-111-006');

-- ================================
-- HORARIOS PARA LA SEMANA 14-21 AGOSTO 2025
-- ================================

-- Generar schedules para cada día de la semana (14-21 agosto)
-- Horario: 8:00 AM a 12:00 PM (8 citas de 30 min cada una)
-- Para cada doctor en cada día

-- Miércoles 14 Agosto 2025
INSERT INTO schedules (medical_center_id, specialty_id, doctor_id, appointment_datetime) VALUES
-- Dr. Carlos Rodriguez (Cardiología)
(1, 1, 1, '2025-08-14 08:00:00'),
(1, 1, 1, '2025-08-14 08:30:00'),
(1, 1, 1, '2025-08-14 09:00:00'),
(1, 1, 1, '2025-08-14 09:30:00'),
(1, 1, 1, '2025-08-14 10:00:00'),
(1, 1, 1, '2025-08-14 10:30:00'),
(1, 1, 1, '2025-08-14 11:00:00'),
(1, 1, 1, '2025-08-14 11:30:00'),
-- Dra. Ana Martinez (Cardiología)
(1, 1, 2, '2025-08-14 08:00:00'),
(1, 1, 2, '2025-08-14 08:30:00'),
(1, 1, 2, '2025-08-14 09:00:00'),
(1, 1, 2, '2025-08-14 09:30:00'),
(1, 1, 2, '2025-08-14 10:00:00'),
(1, 1, 2, '2025-08-14 10:30:00'),
(1, 1, 2, '2025-08-14 11:00:00'),
(1, 1, 2, '2025-08-14 11:30:00'),
-- Dr. Luis Garcia (Medicina General)
(1, 2, 3, '2025-08-14 08:00:00'),
(1, 2, 3, '2025-08-14 08:30:00'),
(1, 2, 3, '2025-08-14 09:00:00'),
(1, 2, 3, '2025-08-14 09:30:00'),
(1, 2, 3, '2025-08-14 10:00:00'),
(1, 2, 3, '2025-08-14 10:30:00'),
(1, 2, 3, '2025-08-14 11:00:00'),
(1, 2, 3, '2025-08-14 11:30:00'),
-- Dra. Maria Lopez (Medicina General)
(1, 2, 4, '2025-08-14 08:00:00'),
(1, 2, 4, '2025-08-14 08:30:00'),
(1, 2, 4, '2025-08-14 09:00:00'),
(1, 2, 4, '2025-08-14 09:30:00'),
(1, 2, 4, '2025-08-14 10:00:00'),
(1, 2, 4, '2025-08-14 10:30:00'),
(1, 2, 4, '2025-08-14 11:00:00'),
(1, 2, 4, '2025-08-14 11:30:00'),
-- Dra. Sofia Hernandez (Psicología)
(1, 3, 5, '2025-08-14 08:00:00'),
(1, 3, 5, '2025-08-14 08:30:00'),
(1, 3, 5, '2025-08-14 09:00:00'),
(1, 3, 5, '2025-08-14 09:30:00'),
(1, 3, 5, '2025-08-14 10:00:00'),
(1, 3, 5, '2025-08-14 10:30:00'),
(1, 3, 5, '2025-08-14 11:00:00'),
(1, 3, 5, '2025-08-14 11:30:00'),
-- Dr. Diego Torres (Psicología)
(1, 3, 6, '2025-08-14 08:00:00'),
(1, 3, 6, '2025-08-14 08:30:00'),
(1, 3, 6, '2025-08-14 09:00:00'),
(1, 3, 6, '2025-08-14 09:30:00'),
(1, 3, 6, '2025-08-14 10:00:00'),
(1, 3, 6, '2025-08-14 10:30:00'),
(1, 3, 6, '2025-08-14 11:00:00'),
(1, 3, 6, '2025-08-14 11:30:00');

-- Jueves 15 Agosto 2025
INSERT INTO schedules (medical_center_id, specialty_id, doctor_id, appointment_datetime) VALUES
-- Dr. Carlos Rodriguez (Cardiología)
(1, 1, 1, '2025-08-15 08:00:00'),
(1, 1, 1, '2025-08-15 08:30:00'),
(1, 1, 1, '2025-08-15 09:00:00'),
(1, 1, 1, '2025-08-15 09:30:00'),
(1, 1, 1, '2025-08-15 10:00:00'),
(1, 1, 1, '2025-08-15 10:30:00'),
(1, 1, 1, '2025-08-15 11:00:00'),
(1, 1, 1, '2025-08-15 11:30:00'),
-- Dra. Ana Martinez (Cardiología)
(1, 1, 2, '2025-08-15 08:00:00'),
(1, 1, 2, '2025-08-15 08:30:00'),
(1, 1, 2, '2025-08-15 09:00:00'),
(1, 1, 2, '2025-08-15 09:30:00'),
(1, 1, 2, '2025-08-15 10:00:00'),
(1, 1, 2, '2025-08-15 10:30:00'),
(1, 1, 2, '2025-08-15 11:00:00'),
(1, 1, 2, '2025-08-15 11:30:00'),
-- Dr. Luis Garcia (Medicina General)
(1, 2, 3, '2025-08-15 08:00:00'),
(1, 2, 3, '2025-08-15 08:30:00'),
(1, 2, 3, '2025-08-15 09:00:00'),
(1, 2, 3, '2025-08-15 09:30:00'),
(1, 2, 3, '2025-08-15 10:00:00'),
(1, 2, 3, '2025-08-15 10:30:00'),
(1, 2, 3, '2025-08-15 11:00:00'),
(1, 2, 3, '2025-08-15 11:30:00'),
-- Dra. Maria Lopez (Medicina General)
(1, 2, 4, '2025-08-15 08:00:00'),
(1, 2, 4, '2025-08-15 08:30:00'),
(1, 2, 4, '2025-08-15 09:00:00'),
(1, 2, 4, '2025-08-15 09:30:00'),
(1, 2, 4, '2025-08-15 10:00:00'),
(1, 2, 4, '2025-08-15 10:30:00'),
(1, 2, 4, '2025-08-15 11:00:00'),
(1, 2, 4, '2025-08-15 11:30:00'),
-- Dra. Sofia Hernandez (Psicología)
(1, 3, 5, '2025-08-15 08:00:00'),
(1, 3, 5, '2025-08-15 08:30:00'),
(1, 3, 5, '2025-08-15 09:00:00'),
(1, 3, 5, '2025-08-15 09:30:00'),
(1, 3, 5, '2025-08-15 10:00:00'),
(1, 3, 5, '2025-08-15 10:30:00'),
(1, 3, 5, '2025-08-15 11:00:00'),
(1, 3, 5, '2025-08-15 11:30:00'),
-- Dr. Diego Torres (Psicología)
(1, 3, 6, '2025-08-15 08:00:00'),
(1, 3, 6, '2025-08-15 08:30:00'),
(1, 3, 6, '2025-08-15 09:00:00'),
(1, 3, 6, '2025-08-15 09:30:00'),
(1, 3, 6, '2025-08-15 10:00:00'),
(1, 3, 6, '2025-08-15 10:30:00'),
(1, 3, 6, '2025-08-15 11:00:00'),
(1, 3, 6, '2025-08-15 11:30:00');

-- Viernes 16 Agosto 2025
INSERT INTO schedules (medical_center_id, specialty_id, doctor_id, appointment_datetime) VALUES
-- Dr. Carlos Rodriguez (Cardiología)
(1, 1, 1, '2025-08-16 08:00:00'),
(1, 1, 1, '2025-08-16 08:30:00'),
(1, 1, 1, '2025-08-16 09:00:00'),
(1, 1, 1, '2025-08-16 09:30:00'),
(1, 1, 1, '2025-08-16 10:00:00'),
(1, 1, 1, '2025-08-16 10:30:00'),
(1, 1, 1, '2025-08-16 11:00:00'),
(1, 1, 1, '2025-08-16 11:30:00'),
-- Dra. Ana Martinez (Cardiología)
(1, 1, 2, '2025-08-16 08:00:00'),
(1, 1, 2, '2025-08-16 08:30:00'),
(1, 1, 2, '2025-08-16 09:00:00'),
(1, 1, 2, '2025-08-16 09:30:00'),
(1, 1, 2, '2025-08-16 10:00:00'),
(1, 1, 2, '2025-08-16 10:30:00'),
(1, 1, 2, '2025-08-16 11:00:00'),
(1, 1, 2, '2025-08-16 11:30:00'),
-- Dr. Luis Garcia (Medicina General)
(1, 2, 3, '2025-08-16 08:00:00'),
(1, 2, 3, '2025-08-16 08:30:00'),
(1, 2, 3, '2025-08-16 09:00:00'),
(1, 2, 3, '2025-08-16 09:30:00'),
(1, 2, 3, '2025-08-16 10:00:00'),
(1, 2, 3, '2025-08-16 10:30:00'),
(1, 2, 3, '2025-08-16 11:00:00'),
(1, 2, 3, '2025-08-16 11:30:00'),
-- Dra. Maria Lopez (Medicina General)
(1, 2, 4, '2025-08-16 08:00:00'),
(1, 2, 4, '2025-08-16 08:30:00'),
(1, 2, 4, '2025-08-16 09:00:00'),
(1, 2, 4, '2025-08-16 09:30:00'),
(1, 2, 4, '2025-08-16 10:00:00'),
(1, 2, 4, '2025-08-16 10:30:00'),
(1, 2, 4, '2025-08-16 11:00:00'),
(1, 2, 4, '2025-08-16 11:30:00'),
-- Dra. Sofia Hernandez (Psicología)
(1, 3, 5, '2025-08-16 08:00:00'),
(1, 3, 5, '2025-08-16 08:30:00'),
(1, 3, 5, '2025-08-16 09:00:00'),
(1, 3, 5, '2025-08-16 09:30:00'),
(1, 3, 5, '2025-08-16 10:00:00'),
(1, 3, 5, '2025-08-16 10:30:00'),
(1, 3, 5, '2025-08-16 11:00:00'),
(1, 3, 5, '2025-08-16 11:30:00'),
-- Dr. Diego Torres (Psicología)
(1, 3, 6, '2025-08-16 08:00:00'),
(1, 3, 6, '2025-08-16 08:30:00'),
(1, 3, 6, '2025-08-16 09:00:00'),
(1, 3, 6, '2025-08-16 09:30:00'),
(1, 3, 6, '2025-08-16 10:00:00'),
(1, 3, 6, '2025-08-16 10:30:00'),
(1, 3, 6, '2025-08-16 11:00:00'),
(1, 3, 6, '2025-08-16 11:30:00');

-- Continuar con los días restantes (19, 20, 21 agosto - lunes, martes, miércoles)
-- Lunes 19 Agosto 2025
INSERT INTO schedules (medical_center_id, specialty_id, doctor_id, appointment_datetime) VALUES
-- Dr. Carlos Rodriguez (Cardiología)
(1, 1, 1, '2025-08-19 08:00:00'),
(1, 1, 1, '2025-08-19 08:30:00'),
(1, 1, 1, '2025-08-19 09:00:00'),
(1, 1, 1, '2025-08-19 09:30:00'),
(1, 1, 1, '2025-08-19 10:00:00'),
(1, 1, 1, '2025-08-19 10:30:00'),
(1, 1, 1, '2025-08-19 11:00:00'),
(1, 1, 1, '2025-08-19 11:30:00'),
-- Dra. Ana Martinez (Cardiología)
(1, 1, 2, '2025-08-19 08:00:00'),
(1, 1, 2, '2025-08-19 08:30:00'),
(1, 1, 2, '2025-08-19 09:00:00'),
(1, 1, 2, '2025-08-19 09:30:00'),
(1, 1, 2, '2025-08-19 10:00:00'),
(1, 1, 2, '2025-08-19 10:30:00'),
(1, 1, 2, '2025-08-19 11:00:00'),
(1, 1, 2, '2025-08-19 11:30:00'),
-- Dr. Luis Garcia (Medicina General)
(1, 2, 3, '2025-08-19 08:00:00'),
(1, 2, 3, '2025-08-19 08:30:00'),
(1, 2, 3, '2025-08-19 09:00:00'),
(1, 2, 3, '2025-08-19 09:30:00'),
(1, 2, 3, '2025-08-19 10:00:00'),
(1, 2, 3, '2025-08-19 10:30:00'),
(1, 2, 3, '2025-08-19 11:00:00'),
(1, 2, 3, '2025-08-19 11:30:00'),
-- Dra. Maria Lopez (Medicina General)
(1, 2, 4, '2025-08-19 08:00:00'),
(1, 2, 4, '2025-08-19 08:30:00'),
(1, 2, 4, '2025-08-19 09:00:00'),
(1, 2, 4, '2025-08-19 09:30:00'),
(1, 2, 4, '2025-08-19 10:00:00'),
(1, 2, 4, '2025-08-19 10:30:00'),
(1, 2, 4, '2025-08-19 11:00:00'),
(1, 2, 4, '2025-08-19 11:30:00'),
-- Dra. Sofia Hernandez (Psicología)
(1, 3, 5, '2025-08-19 08:00:00'),
(1, 3, 5, '2025-08-19 08:30:00'),
(1, 3, 5, '2025-08-19 09:00:00'),
(1, 3, 5, '2025-08-19 09:30:00'),
(1, 3, 5, '2025-08-19 10:00:00'),
(1, 3, 5, '2025-08-19 10:30:00'),
(1, 3, 5, '2025-08-19 11:00:00'),
(1, 3, 5, '2025-08-19 11:30:00'),
-- Dr. Diego Torres (Psicología)
(1, 3, 6, '2025-08-19 08:00:00'),
(1, 3, 6, '2025-08-19 08:30:00'),
(1, 3, 6, '2025-08-19 09:00:00'),
(1, 3, 6, '2025-08-19 09:30:00'),
(1, 3, 6, '2025-08-19 10:00:00'),
(1, 3, 6, '2025-08-19 10:30:00'),
(1, 3, 6, '2025-08-19 11:00:00'),
(1, 3, 6, '2025-08-19 11:30:00');

-- Martes 20 Agosto 2025
INSERT INTO schedules (medical_center_id, specialty_id, doctor_id, appointment_datetime) VALUES
-- Dr. Carlos Rodriguez (Cardiología)
(1, 1, 1, '2025-08-20 08:00:00'),
(1, 1, 1, '2025-08-20 08:30:00'),
(1, 1, 1, '2025-08-20 09:00:00'),
(1, 1, 1, '2025-08-20 09:30:00'),
(1, 1, 1, '2025-08-20 10:00:00'),
(1, 1, 1, '2025-08-20 10:30:00'),
(1, 1, 1, '2025-08-20 11:00:00'),
(1, 1, 1, '2025-08-20 11:30:00'),
-- Dra. Ana Martinez (Cardiología)
(1, 1, 2, '2025-08-20 08:00:00'),
(1, 1, 2, '2025-08-20 08:30:00'),
(1, 1, 2, '2025-08-20 09:00:00'),
(1, 1, 2, '2025-08-20 09:30:00'),
(1, 1, 2, '2025-08-20 10:00:00'),
(1, 1, 2, '2025-08-20 10:30:00'),
(1, 1, 2, '2025-08-20 11:00:00'),
(1, 1, 2, '2025-08-20 11:30:00'),
-- Dr. Luis Garcia (Medicina General)
(1, 2, 3, '2025-08-20 08:00:00'),
(1, 2, 3, '2025-08-20 08:30:00'),
(1, 2, 3, '2025-08-20 09:00:00'),
(1, 2, 3, '2025-08-20 09:30:00'),
(1, 2, 3, '2025-08-20 10:00:00'),
(1, 2, 3, '2025-08-20 10:30:00'),
(1, 2, 3, '2025-08-20 11:00:00'),
(1, 2, 3, '2025-08-20 11:30:00'),
-- Dra. Maria Lopez (Medicina General)
(1, 2, 4, '2025-08-20 08:00:00'),
(1, 2, 4, '2025-08-20 08:30:00'),
(1, 2, 4, '2025-08-20 09:00:00'),
(1, 2, 4, '2025-08-20 09:30:00'),
(1, 2, 4, '2025-08-20 10:00:00'),
(1, 2, 4, '2025-08-20 10:30:00'),
(1, 2, 4, '2025-08-20 11:00:00'),
(1, 2, 4, '2025-08-20 11:30:00'),
-- Dra. Sofia Hernandez (Psicología)
(1, 3, 5, '2025-08-20 08:00:00'),
(1, 3, 5, '2025-08-20 08:30:00'),
(1, 3, 5, '2025-08-20 09:00:00'),
(1, 3, 5, '2025-08-20 09:30:00'),
(1, 3, 5, '2025-08-20 10:00:00'),
(1, 3, 5, '2025-08-20 10:30:00'),
(1, 3, 5, '2025-08-20 11:00:00'),
(1, 3, 5, '2025-08-20 11:30:00'),
-- Dr. Diego Torres (Psicología)
(1, 3, 6, '2025-08-20 08:00:00'),
(1, 3, 6, '2025-08-20 08:30:00'),
(1, 3, 6, '2025-08-20 09:00:00'),
(1, 3, 6, '2025-08-20 09:30:00'),
(1, 3, 6, '2025-08-20 10:00:00'),
(1, 3, 6, '2025-08-20 10:30:00'),
(1, 3, 6, '2025-08-20 11:00:00'),
(1, 3, 6, '2025-08-20 11:30:00');

-- Miércoles 21 Agosto 2025
INSERT INTO schedules (medical_center_id, specialty_id, doctor_id, appointment_datetime) VALUES
-- Dr. Carlos Rodriguez (Cardiología)
(1, 1, 1, '2025-08-21 08:00:00'),
(1, 1, 1, '2025-08-21 08:30:00'),
(1, 1, 1, '2025-08-21 09:00:00'),
(1, 1, 1, '2025-08-21 09:30:00'),
(1, 1, 1, '2025-08-21 10:00:00'),
(1, 1, 1, '2025-08-21 10:30:00'),
(1, 1, 1, '2025-08-21 11:00:00'),
(1, 1, 1, '2025-08-21 11:30:00'),
-- Dra. Ana Martinez (Cardiología)
(1, 1, 2, '2025-08-21 08:00:00'),
(1, 1, 2, '2025-08-21 08:30:00'),
(1, 1, 2, '2025-08-21 09:00:00'),
(1, 1, 2, '2025-08-21 09:30:00'),
(1, 1, 2, '2025-08-21 10:00:00'),
(1, 1, 2, '2025-08-21 10:30:00'),
(1, 1, 2, '2025-08-21 11:00:00'),
(1, 1, 2, '2025-08-21 11:30:00'),
-- Dr. Luis Garcia (Medicina General)
(1, 2, 3, '2025-08-21 08:00:00'),
(1, 2, 3, '2025-08-21 08:30:00'),
(1, 2, 3, '2025-08-21 09:00:00'),
(1, 2, 3, '2025-08-21 09:30:00'),
(1, 2, 3, '2025-08-21 10:00:00'),
(1, 2, 3, '2025-08-21 10:30:00'),
(1, 2, 3, '2025-08-21 11:00:00'),
(1, 2, 3, '2025-08-21 11:30:00'),
-- Dra. Maria Lopez (Medicina General)
(1, 2, 4, '2025-08-21 08:00:00'),
(1, 2, 4, '2025-08-21 08:30:00'),
(1, 2, 4, '2025-08-21 09:00:00'),
(1, 2, 4, '2025-08-21 09:30:00'),
(1, 2, 4, '2025-08-21 10:00:00'),
(1, 2, 4, '2025-08-21 10:30:00'),
(1, 2, 4, '2025-08-21 11:00:00'),
(1, 2, 4, '2025-08-21 11:30:00'),
-- Dra. Sofia Hernandez (Psicología)
(1, 3, 5, '2025-08-21 08:00:00'),
(1, 3, 5, '2025-08-21 08:30:00'),
(1, 3, 5, '2025-08-21 09:00:00'),
(1, 3, 5, '2025-08-21 09:30:00'),
(1, 3, 5, '2025-08-21 10:00:00'),
(1, 3, 5, '2025-08-21 10:30:00'),
(1, 3, 5, '2025-08-21 11:00:00'),
(1, 3, 5, '2025-08-21 11:30:00'),
-- Dr. Diego Torres (Psicología)
(1, 3, 6, '2025-08-21 08:00:00'),
(1, 3, 6, '2025-08-21 08:30:00'),
(1, 3, 6, '2025-08-21 09:00:00'),
(1, 3, 6, '2025-08-21 09:30:00'),
(1, 3, 6, '2025-08-21 10:00:00'),
(1, 3, 6, '2025-08-21 10:30:00'),
(1, 3, 6, '2025-08-21 11:00:00'),
(1, 3, 6, '2025-08-21 11:30:00');

-- ================================
-- CONSULTAS DE VERIFICACIÓN
-- ================================

-- Verificar schedules creados
SELECT 
    s.id as schedule_id,
    mc.name as medical_center,
    sp.name as specialty,
    CONCAT(d.first_name, ' ', d.last_name) as doctor,
    s.appointment_datetime,
    s.is_available
FROM schedules s
JOIN medical_centers mc ON s.medical_center_id = mc.id
JOIN specialties sp ON s.specialty_id = sp.id
JOIN doctors d ON s.doctor_id = d.id
ORDER BY s.appointment_datetime, sp.name, d.last_name
LIMIT 20;

-- Verificar total de schedules por día
SELECT 
    DATE(appointment_datetime) as fecha,
    COUNT(*) as total_slots
FROM schedules 
GROUP BY DATE(appointment_datetime)
ORDER BY fecha;