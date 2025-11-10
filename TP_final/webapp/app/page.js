"use client"; // Archivo para el navegador

import { useState } from "react";
import useWebSocket from "react-use-websocket"; // Librería para el WebSocket

// Apunta al Gateway (Vigilante)
const WS_URL = "ws://localhost:8080";

// --- Funciones "Traductoras" para la UI ---
const friendlyEventNames = {
  "txn.FundsReserved": " Fondos Reservados",
  "txn.FraudChecked": " Chequeo de Fraude",
  "txn.Committed": " Transacción Completada",
  "txn.Notified": " Notificación Enviada",
  "txn.Reversed": " Transacción Revertida",
};

const renderPayload = (event) => {
  const payload = event.payload;
  switch (event.type) {
    case "txn.FundsReserved":
      return (
        <p>Monto: ${payload.amount} (ID: ...{payload.holdId.slice(-6)})</p>
      );
    case "txn.FraudChecked":
      const riskClass =
        payload.risk === "HIGH" ? "text-red-400 font-bold" : "text-green-400 font-bold";
      return (
        <p>Resultado: <span className={riskClass}>{payload.risk}</span></p>
      );
    case "txn.Committed":
      return <p>ID confirmación: ...{payload.ledgerTxId.slice(-6)}</p>;
    case "txn.Notified":
      return <p>Enviada a: {payload.channels.join(", ")}</p>;
    case "txn.Reversed":
      return <p className="text-red-400">Razón: {payload.reason}</p>;
    default:
      return <pre>{JSON.stringify(payload, null, 2)}</pre>;
  }
};
// --- Fin de las Traductoras ---


export default function Home() {
  // Estados de React: Guardar datos del form y la lista de eventos del timeline
  const [userId, setUserId] = useState("user-123");
  const [fromAccount, setFromAccount] = useState("ACC-001");
  const [toAccount, setToAccount] = useState("ACC-002");
  const [amount, setAmount] = useState("100.00");
  const [currency, setCurrency] = useState("USD");
  const [events, setEvents] = useState([]);

  // Conexión WebSocket: Usar 'useWebSocket' para conectar al Gateway
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    // onMessage: Cuando llega un evento, parsearlo y añadirlo a la lista 'events'
    onMessage: (message) => {
      const event = JSON.parse(message.data);
      console.log("Evento recibido del Gateway:", event);
      setEvents((prevEvents) => [event, ...prevEvents]); // Añade al principio de la lista
    },
    shouldReconnect: (closeEvent) => true,
  });

  // handleSubmit: Se llama al apretar el botón
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEvents([]); // 1. Limpiar timeline viejo

    const txData = {
      userId,
      fromAccount,
      toAccount,
      amount: parseFloat(amount),
      currency,
    };

    try {
      // 2. Hacer 'fetch' (POST) a nuestra API /api/transactions
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData),
      });
      // (Manejo de errores de la API, si quisiéramos)
      const result = await response.json();
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    }
  };

  // Render (HTML): Formulario y Timeline
  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-950 text-gray-200">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Sistema de Eventos Bancarios</h1>
        <p className="text-gray-400 mb-8">
          Procesamiento de transacciones en tiempo real con Kafka
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna 1: Formulario */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Nueva Transacción</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">ID de Usuario</label>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-2"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Cuenta Origen</label>
                  <input type="text" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-2"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Cuenta Destino</label>
                  <input type="text" value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-2"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Monto</label>
                  <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-2"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Moneda</label>
                  <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-2"/>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200">
                Iniciar Transacción
              </button>
            </form>
          </div>

          {/* Columna 2: Timeline */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Línea de Tiempo de la Transacción</h2>
            <div className="h-96 overflow-y-auto space-y-4" style={{ minHeight: "300px" }}>
              {events.length === 0 ? (
                <p className="text-gray-500 text-center mt-16">
                  Aún no hay eventos. Inicia una transacción para ver la línea de tiempo.
                </p>
              ) : (
                // Mapear la lista 'events' para dibujar cada evento en el timeline
                events.map((event) => {
                  const eventName = friendlyEventNames[event.type] || event.type;
                  return (
                    <div key={event.id} className="p-3 bg-gray-800 rounded-md shadow-sm">
                      <p className="font-semibold text-blue-400">{eventName}</p>
                      <div className="text-sm text-gray-300 mt-2">
                        {renderPayload(event)}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">TxID: {event.transactionId}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}