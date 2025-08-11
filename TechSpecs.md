# Documento Técnico – Reto Técnico Backend Rimac

## Objetivo

Implementar una aplicación backend serverless en AWS que permita agendar citas médicas para asegurados en Perú o Chile, siguiendo los pasos y requisitos dados.

---

## 1. Stack Tecnológico

- **Lenguaje:** TypeScript
- **Runtime:** Node.js (versión LTS)
- **Framework:** Serverless Framework
- **Base de datos NoSQL:** DynamoDB (para estado de agendamientos)
- **Base de datos SQL:** MySQL en RDS (para registro final de citas)
- **Mensajería y eventos:** SNS, SQS, EventBridge
- **API:** API Gateway
- **Documentación:** OpenAPI/Swagger
- **Pruebas:** Jest (unitarias)

---

## 2. Arquitectura General

- **Lambda principal `appointment`:**
  - `POST /appointments` → guarda cita en DynamoDB (estado: `pending`), publica en SNS.
  - `GET /appointments/{insuredId}` → consulta citas por asegurado en DynamoDB.
- **SNS** → tópico único con filtro por `countryISO` o tópicos separados por país.
- **SQS** → una cola por país (`SQS_PE`, `SQS_CL`).
- **Lambda por país** (`appointment_pe`, `appointment_cl`) → procesa cita, guarda en MySQL y emite evento de confirmación vía EventBridge.
- **EventBridge** → envía mensaje a SQS de respuesta.
- **Lambda `appointment` (listener)** → recibe confirmación, actualiza DynamoDB (estado: `completed`).

---

## 3. Modelado de Datos

### DynamoDB: `Appointments`

| Campo        | Tipo   | Notas                        |
| ------------ | ------ | ---------------------------- |
| `id`         | string | UUID                         |
| `insuredId`  | string | Código asegurado (5 dígitos) |
| `scheduleId` | number | ID de espacio                |
| `countryISO` | string | "PE" o "CL"                  |
| `status`     | string | pending / completed          |
| `createdAt`  | string | ISO date                     |
| `updatedAt`  | string | ISO date                     |

### MySQL (RDS): `appointments`

| Campo        | Tipo       |
| ------------ | ---------- |
| `id`         | int PK     |
| `insuredId`  | varchar(5) |
| `scheduleId` | int        |
| `countryISO` | char(2)    |
| `createdAt`  | datetime   |

---

## 4. Flujo de Ejecución

1. **POST /appointments**
   - Validar payload `{ insuredId, scheduleId, countryISO }`
   - Guardar en DynamoDB con estado `pending`
   - Publicar evento en SNS con atributo `countryISO`
2. **SNS → SQS**
   - Filtro por país, envía a la cola correspondiente (`SQS_PE` o `SQS_CL`)
3. **Lambdas por país**
   - Leer mensaje de SQS
   - Insertar cita en RDS
   - Publicar evento en EventBridge (`appointment.completed`)
4. **EventBridge → SQS de respuesta**
   - Enviar confirmación
5. **Lambda `appointment` listener**
   - Leer confirmación
   - Actualizar estado en DynamoDB a `completed`
6. **GET /appointments/{insuredId}**
   - Consultar DynamoDB por `insuredId`
   - Devolver lista con estado actual

---

## 5. Infraestructura (Serverless Framework)

**Recursos creados por código**:

- API Gateway (dos endpoints: POST y GET)
- Lambdas (`appointment`, `appointment_pe`, `appointment_cl`)
- DynamoDB table `Appointments`
- SNS tópico (con filtros o separados)
- SQS (`SQS_PE`, `SQS_CL`, `SQS_Response`)
- EventBridge rule

**No creado por código**:

- RDS MySQL (usar variables de entorno para conexión)

---

## 6. Patrones y Principios

- **Arquitectura limpia** (capas: controller → service → repository)
- **Principios SOLID**
- Patrón de diseño:
  - **Publisher-Subscriber** (SNS/SQS)
  - **CQRS** (lectura y escritura separadas)
- Tipado estricto con interfaces y DTOs en TypeScript

---

## 7. Documentación y Pruebas

- **Swagger/OpenAPI** para endpoints
- **Jest** para pruebas unitarias de cada capa
- **README** con pasos de despliegue y uso

---

## 8. Variables de Entorno

```env
DYNAMO_TABLE=Appointments
RDS_HOST=...
RDS_USER=...
RDS_PASSWORD=...
SNS_TOPIC_ARN=...
SQS_PE_URL=...
SQS_CL_URL=...
SQS_RESPONSE_URL=...
```

## 9. Ejecución local

npm install
sls offline start # con plugin serverless-offline
jest # ejecutar pruebas
