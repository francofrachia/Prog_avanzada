import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

// 1. Configurar el "Productor" de Kafka (el que envía mensajes)
const kafka = new Kafka({
  clientId: "api-producer",
  brokers: ["localhost:9092"], // Apunta al Kafka en Docker
});
const producer = kafka.producer();

// Esta es la función POST que se ejecuta en /api/transactions
export async function POST(request) {
  try {
    // A. Leer el JSON del body (los datos del form)
    const txData = await request.json();

    // B. Armar el "sobre" del evento (EventEnvelope) como pide el PDF
    const transactionId = uuidv4();
    const eventId = uuidv4();

    const payload = {
      fromAccount: txData.fromAccount,
      toAccount: txData.toAccount,
      amount: txData.amount,
      currency: txData.currency,
      userId: txData.userId,
    };

    const eventMessage = {
      id: eventId,
      type: "txn.TransactionInitiated", // Este es el tipo de evento inicial
      version: 1,
      ts: Date.now(),
      transactionId: transactionId,
      userId: txData.userId,
      payload: payload,
    };

    // C. Enviar el evento al tópico 'txn.commands'
    await producer.connect();
    await producer.send({
      topic: "txn.commands",
      messages: [
        {
          key: transactionId, // 'key' es el transactionId para asegurar el orden
          value: JSON.stringify(eventMessage),
        },
      ],
    });
    await producer.disconnect();

    // D. Responder 202 (Aceptado) al frontend
    // Le avisamos que el pedido fue "aceptado" pero no "completado"
    return new Response(
      JSON.stringify({
        message: "Transaction initiated",
        transactionId: transactionId,
      }),
      {
        status: 202,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Manejo de errores (ej: Kafka está caído)
    console.error("Error al procesar la transacción:", error);
    return new Response(JSON.stringify({ message: "Error processing request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}