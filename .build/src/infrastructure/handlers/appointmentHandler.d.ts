import { Handler } from 'aws-lambda';
/**
 * Handler principal que determina el tipo de evento y delega al manejador apropiado
 * @param event - Evento de AWS Lambda (HTTP o SQS)
 * @param context - Contexto de ejecución
 * @returns Resultado del procesamiento
 */
declare const handler: Handler;
export default handler;
export { handler };
//# sourceMappingURL=appointmentHandler.d.ts.map