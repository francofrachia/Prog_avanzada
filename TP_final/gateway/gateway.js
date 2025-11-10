import { Kafka } from "kafkajs";
import { WebSocketServer } from "ws"; // Librería 'ws'

// 1. Configurar el Servidor WebSocket (WSS) en el puerto 8080
const wss = new WebSocketServer({ port: 8080 });
console.log("[Gateway] Servidor WebSocket iniciado en el puerto 8080.");

// Guardar clientes conectados en un Map
const clients = new Map();

// wss.on('connection'): Guardar cliente nuevo y borrarlo si se va
wss.on("connection", (ws) => {
  console.log("[Gateway] Cliente conectado.");
  const clientId = Date.now();
  clients.set(clientId, ws);

  ws.send(JSON.stringify({ type: "system", message: "Conectado al Gateway" }));

  ws.on("close", () => {
    console.log("[Gateway] Cliente desconectado.");
    clients.delete(clientId);
  });
});

// Helper 'broadcast': Enviar un evento a TODOS los clientes conectados
const broadcast = (event) => {
  const message = JSON.stringify(event);
  console.log(`[Gateway] Transmitiendo evento a ${clients.size} clientes: ${event.type}`);
  for (const [clientId, client] of clients.entries()) {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(message);
    }
  }
};

// 2. Configurar el Consumidor de Kafka (para 'txn.events')
const kafka = new Kafka({
  clientId: "gateway",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "gateway-group" });

const runGateway = async () => {
  try {
    await consumer.connect();
    // Se suscribe al tópico de "eventos"
    await consumer.subscribe({ topic: "txn.events", fromBeginning: true });
    console.log("[Gateway] Conectado y escuchando en 'txn.events'...");

    // consumer.run(): Por cada evento que llega de Kafka...
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        // ...lo "gritamos" (broadcast) a los clientes del WebSocket
        broadcast(event);
      },
    });
  } catch (error) {
    console.error("Error fatal en el Gateway:", error);
    process.exit(1);
  }
};

// 3. Iniciar el servicio
runGateway();