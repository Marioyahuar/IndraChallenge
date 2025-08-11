# Rimac Appointment API

API serverless para el agendamiento de citas médicas para asegurados en Perú y Chile, implementada con AWS Lambda, DynamoDB, SNS, SQS y EventBridge.

## 🏗️ Arquitectura

La aplicación implementa una arquitectura event-driven con los siguientes componentes:

- **Lambda `appointment`**: Maneja endpoints REST (POST/GET) y procesa confirmaciones
- **SNS**: Publica eventos de citas con filtros por país
- **SQS**: Colas separadas por país (PE/CL) y cola de respuesta
- **Lambdas por país**: Procesan citas específicas del país y guardan en RDS
- **EventBridge**: Maneja eventos de confirmación de citas
- **DynamoDB**: Almacena estado de citas (pending/completed)
- **MySQL RDS**: Almacena registro final de citas por país

## 📋 Flujo de Procesamiento

1. **POST /appointments** → Guarda en DynamoDB (status: pending) → Publica en SNS
2. **SNS** → Filtra por país → Envía a SQS correspondiente
3. **Lambda país** → Procesa SQS → Guarda en MySQL → Publica en EventBridge
4. **EventBridge** → Envía confirmación a SQS de respuesta
5. **Lambda appointment** → Procesa confirmación → Actualiza DynamoDB (status: completed)

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

## ⚙️ Variables de Entorno

```env
RDS_HOST=your-rds-endpoint
RDS_USER=your-db-user
RDS_PASSWORD=your-db-password
RDS_DATABASE=appointments
```

## 📦 Despliegue

```bash
# Despliegue en desarrollo
npm run deploy

# Despliegue en producción
sls deploy --stage prod
```

## 🔧 Desarrollo Local

```bash
# Iniciar servidor local
npm run dev

# Ejecutar pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Lint del código
npm run lint
```

## 📚 API Endpoints

### POST /appointments
Crea una nueva cita médica.

**Request Body:**
```json
{
  "insuredId": "12345",
  "scheduleId": 100,
  "countryISO": "PE"
}
```

**Response:**
```json
{
  "message": "Appointment request received and is being processed",
  "appointment": {
    "id": "uuid",
    "insuredId": "12345",
    "scheduleId": 100,
    "countryISO": "PE",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /appointments/{insuredId}
Obtiene todas las citas de un asegurado.

**Response:**
```json
{
  "appointments": [
    {
      "id": "uuid",
      "insuredId": "12345",
      "scheduleId": 100,
      "countryISO": "PE",
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:05:00.000Z"
    }
  ]
}
```

## 🗄️ Modelo de Datos

### DynamoDB - Appointments
```typescript
{
  id: string;           // UUID
  insuredId: string;    // 5 dígitos
  scheduleId: number;   // ID del espacio
  countryISO: 'PE' | 'CL';
  status: 'pending' | 'completed';
  createdAt: string;    // ISO date
  updatedAt: string;    // ISO date
}
```

### MySQL - appointments (Bases de datos separadas por país)
```sql
-- Base de datos para Perú
CREATE DATABASE appointments_pe;
USE appointments_pe;
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  insuredId VARCHAR(5) NOT NULL,
  scheduleId INT NOT NULL,
  countryISO CHAR(2) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Base de datos para Chile  
CREATE DATABASE appointments_cl;
USE appointments_cl;
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  insuredId VARCHAR(5) NOT NULL,
  scheduleId INT NOT NULL,
  countryISO CHAR(2) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Pruebas

El proyecto incluye pruebas unitarias para:
- Validadores de entrada
- Servicios de dominio
- Servicios de infraestructura

```bash
# Ejecutar todas las pruebas
npm test

# Ver cobertura
npm test -- --coverage
```

## 📖 Documentación API

La documentación completa de la API está disponible en `swagger.yml` y puede visualizarse usando herramientas como Swagger UI.

## 🏛️ Patrones de Diseño Implementados

- **Clean Architecture**: Separación clara de capas (handlers, services, repositories)
- **Publisher-Subscriber**: Comunicación asíncrona vía SNS/SQS
- **CQRS**: Separación de comandos (write) y consultas (read)
- **Repository Pattern**: Abstracción de acceso a datos
- **Dependency Injection**: Inyección manual de dependencias

## 📋 Principios SOLID

- **S** - Single Responsibility: Cada clase tiene una responsabilidad específica
- **O** - Open/Closed: Extensible sin modificar código existente
- **L** - Liskov Substitution: Interfaces bien definidas
- **I** - Interface Segregation: Interfaces específicas y no genéricas
- **D** - Dependency Inversion: Dependencias hacia abstracciones

## 🔍 Monitoreo y Logging

Los logs están disponibles en CloudWatch con información detallada de:
- Procesamiento de citas
- Errores de validación
- Eventos de SNS/SQS
- Operaciones de base de datos

## ⚠️ Consideraciones

- Las citas se procesan de forma asíncrona
- El estado inicial es siempre "pending"
- La confirmación actualiza el estado a "completed"
- Validación estricta de formatos de entrada
- Manejo robusto de errores en cada capa

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License