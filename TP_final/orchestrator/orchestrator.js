import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

// 1. Configurar Kafka: Consumidor (para 'txn.commands') y Productor (para 'txn.events')
const kafka = new Kafka({
  clientId: "orchestrator",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "orchestrator-group" });
const producer = kafka.producer();

// 2. Helper: Función para crear y enviar eventos nuevos
const produceEvent = async (topic, type, transactionId, userId, payload) => {
  const eventId = uuidv4();
  const eventMessage = {
    id: eventId,
    type: type,
    version: 1,
    ts: Date.now(),
    transactionId: transactionId,
    userId: userId,
    payload: payload,
  };

  await producer.send({
    topic: topic,
    messages: [{ key: transactionId, value: JSON.stringify(eventMessage) }],
  });
  console.log(`[Orchestrator] Evento producido: ${type} (Tx: ${transactionId})`);
};

// 3. Lógica principal: Conectar, suscribir y correr
const runOrchestrator = async () => {
  try {
    await producer.connect();
    await consumer.connect();

    // Se suscribe al tópico de "comandos"
    await consumer.subscribe({ topic: "txn.commands", fromBeginning: true });
    console.log("[Orchestrator] Conectado y escuchando en 'txn.commands'...");

    // consumer.run() se ejecuta por cada mensaje que llega
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawMessage = message.value.toString();
        const event = JSON.parse(rawMessage);
        const { transactionId, userId, payload: txPayload } = event;

        console.log(`\n[Orchestrator] Mensaje recibido: ${event.type} (Tx: ${transactionId})`);

        try {
          // PASO 1: Simular reserva de fondos -> Producir evento 'FundsReserved'
          console.log(`[Orchestrator] Paso 1: Reservando fondos...`);
          await produceEvent(
            "txn.events",
            "txn.FundsReserved",
            transactionId,
            userId,
            { ok: true, holdId: uuidv4(), amount: txPayload.amount }
          );

          // PASO 2: Simular fraude (con random) -> Producir evento 'FraudChecked'
          const risk = Math.random() < 0.8 ? "LOW" : "HIGH"; // 80% LOW, 20% HIGH
          console.log(`[Orchestrator] Paso 2: Chequeando fraude... (Riesgo: ${risk})`);
          await produceEvent(
            "txn.events",
            "txn.FraudChecked",
            transactionId,
            userId,
            { risk: risk }
          );

          // PASO 3: Decisión (Saga)
          if (risk === "LOW") {
            // Si es "LOW" (Camino Feliz): Producir 'Committed' y 'Notified'
            console.log(`[Orchestrator] Paso 3 (Feliz): Confirmando (Commit)...`);
            await produceEvent(
              "txn.events",
              "txn.Committed",
              transactionId,
              userId,
              { ledgerTxId: uuidv4() }
            );
            await produceEvent(
              "txn.events",
              "txn.Notified",
              transactionId,
              userId,
              { channels: ["email", "push"] }
            );
            console.log(`[Orchestrator] Tx ${transactionId} completada.`);
          } else {
            // Si es "HIGH" (Camino Triste): Producir 'Reversed' (Rollback)
            console.log(`[Orchestrator] Paso 3 (Triste): Revirtiendo (Rollback)...`);
            await produceEvent(
              "txn.events",
              "txn.Reversed",
              transactionId,
              userId,
              { reason: "High fraud risk" }
            );
            console.log(`[Orchestrator] Tx ${transactionId} revertida.`);
          }
        } catch (processingError) {
          // Error Inesperado: Mandar el mensaje roto al 'txn.dlq'
          console.error(`[Orchestrator] ERROR PROCESANDO Tx ${transactionId}:`, processingError);
          await produceEvent(
            "txn.dlq",
            "error.ProcessingFailed",
            transactionId,
            userId,
            {
              originalMessage: rawMessage,
              error: processingError.message,
            }
          );
        }
      },
    });
  } catch (error) {
    console.error("Error fatal al iniciar el Orchestrator:", error);
    process.exit(1);
  }
};

// 4. Iniciar el servicio
runOrchestrator();