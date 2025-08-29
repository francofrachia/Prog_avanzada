//ejercicio 1

const router = {
    modelo: "TL-WR840N",
    marca: "TP-Link",
    puertos: "4",
    velocidad: "300Mbps",
    soportaWifi: true,
}

console.log(router);

//ejercicio 2

const dispositivos = [
{ tipo: "Router", marca: "Cisco", modelo: "1941", precio: 1200 },
{ tipo: "Switch", marca: "TP-Link", modelo: "TL-SG108", precio: 150 },
{ tipo: "Firewall", marca: "Cisco", modelo: "ASA 5506-X", precio: 2500 },
{ tipo: "Access Point", marca: "Ubiquiti", modelo: "UniFi AP AC Pro", precio: 320 },
{ tipo: "Router", marca: "TP-Link", modelo: "Archer C7", precio: 180 }
];

console.log(dispositivos);

//ejercicio 3

const dispositivosTpLink = dispositivos.filter(d => d.marca === "TP-Link");

console.log(dispositivosTpLink);

//ejercicio 4

const servidores = [
{ nombre: "Servidor Web", ip: "192.168.1.10", sistema: "Linux" },
{ nombre: "Servidor de Base de Datos", ip: "192.168.1.11", sistema: "Windows"},
{ nombre: "Servidor de Correo", ip: "192.168.1.12", sistema: "Linux" },
{ nombre: "Servidor DNS", ip: "192.168.1.13", sistema: "Linux" },
{ nombre: "Servidor de Archivos", ip: "192.168.1.14", sistema: "Windows" }
];

const direccionesIP = servidores.map(s => s.ip);

console.log(direccionesIP);

//ejercicio 5

const paquetesDatos = [
{ id: 1, origen: "192.168.1.5", destino: "192.168.1.10", tamaño: 1200, prioridad: 3 },
{ id: 2, origen: "192.168.1.7", destino: "192.168.1.12", tamaño: 800, prioridad: 1 },
{id: 3, origen: "192.168.1.3", destino: "192.168.1.11", tamaño: 1500, prioridad: 5 },
{id: 4, origen: "192.168.1.8", destino: "192.168.1.14", tamaño: 950, prioridad: 2 },
{id: 5, origen: "192.168.1.2", destino: "192.168.1.13", tamaño: 2000, prioridad: 4 } 
];

const tamañoMayor1000 = paquetesDatos.filter(p => p.tamaño > 1000);

console.log(tamañoMayor1000);

//ejercicio 6

const traficoRed = {
"08:00": 1250,
"09:00": 1870,
"10:00": 2100,
"11:00": 1950,
"12:00": 1600,
"13:00": 1300,
"14:00": 1700,
"15:00": 2200,
"16:00": 1800,
"17:00": 1500
};

// Total de datos transferidos
const totalDatos = Object.values(traficoRed).reduce((acc, curr) => acc + curr, 0);

// Hora con mayor tráfico
let horaMayorTrafico = null;
let maxDatos = 0;
for (let hora in traficoRed) {
    if (traficoRed[hora] > maxDatos) {
        maxDatos = traficoRed[hora];
        horaMayorTrafico = hora;
    }
}

console.log ("todal de datos :" + totalDatos);
console.log ("hora de mayor trafico :" + horaMayorTrafico);

//ejercicio 7

const conexiones = [
{ id: 1, origen: "192.168.1.5", destino: "192.168.1.10", protocolo: "HTTP" },
{ id: 2, origen: "192.168.1.7", destino: "192.168.1.12", protocolo: "FTP" },
{ id: 3, origen: "192.168.1.3", destino: "192.168.1.11", protocolo: "SSH" },
{ id: 4, origen: "192.168.1.8", destino: "192.168.1.14", protocolo: "HTTP" },
{id: 5, origen: "192.168.1.2", destino: "192.168.1.13", protocolo: "HTTPS" },
{id: 6, origen: "192.168.1.6", destino: "192.168.1.10", protocolo: "FTP" },
{ id: 7, origen: "192.168.1.9", destino: "192.168.1.15", protocolo: "SSH" },
{ id: 8, origen: "192.168.1.4", destino: "192.168.1.11", protocolo: "HTTP" }
];

// Contar conexiones por protocolo
const conexionesPorProtocolo = {};
conexiones.forEach(c => {
    if (!conexionesPorProtocolo[c.protocolo]) {
        conexionesPorProtocolo[c.protocolo] = 0;
    }
    conexionesPorProtocolo[c.protocolo]++;
});

console.log("conexiones por protocolo :", conexionesPorProtocolo);

//ejercicio 8
//le agregue las prioridades a las alertas para poder ordenarlas porque no estaban en el ejercicio
const alertas = [
  { id: 1, dispositivo: "PC-Desarrollo", ip: "192.168.1.5", nivel: "alto", mensaje: "Tráfico sospechoso detectado" },
  { id: 2, dispositivo: "PC-Marketing", ip: "192.168.1.7", nivel: "medio", mensaje: "Intento de acceso no autorizado" },
  { id: 3, dispositivo: "Servidor-Web", ip: "192.168.1.10", nivel: "alto", mensaje: "Ataque de fuerza bruta detectado" },
  { id: 4, dispositivo: "Servidor-BD", ip: "192.168.1.11", nivel: "bajo", mensaje: "Conexión inusual detectada" }
];

const conexionesActivas = [
{ origen: "192.168.1.5", destino: "192.168.1.10", protocolo: "HTTP", bytes: 8500 },
{origen: "192.168.1.7", destino: "192.168.1.11", protocolo: "MySQL", bytes: 12000 },
{origen: "192.168.1.5", destino: "192.168.1.11", protocolo: "MySQL", bytes: 9200 }
];
// Crea un informe que combine la información de dispositivos y conexiones
// Encuentra los dispositivos de origen y destino
// Tu código aquí
// Retorna un objeto con la información combinada

const informeActividad = conexionesActivas.map(conexion => {
    const dispositivoOrigen = alertas.find(alerta => alerta.ip === conexion.origen);
    const dispositivoDestino = alertas.find(alerta => alerta.ip === conexion.destino);
    
    return {
        origen: dispositivoOrigen ? dispositivoOrigen.dispositivo : conexion.origen,
        destino: dispositivoDestino ? dispositivoDestino.dispositivo : conexion.destino,
        protocolo: conexion.protocolo,
        bytes: conexion.bytes,
        nivelAlerta: dispositivoOrigen ? dispositivoOrigen.nivel : "desconocido"
    };
});

// Filtro solo las conexiones que tengan dispositivos con alerta "alto"
const alertasCriticas = informeActividad.filter(conexion => conexion.nivelAlerta === "alto");

const mensajes = alertasCriticas.map(alerta =>
  `ALERTA: Dispositivo ${alerta.origen} → ${alerta.destino} (${alerta.protocolo}, ${alerta.bytes} bytes)`
);

console.log("Informe de actividad de red:", informeActividad);
console.log("Mensajes para el administrador:", mensajes);

//ejercicio 9

const topologiaRed_1 = {
nodos: [
{ id: "A", tipo: "Router", ubicacion: "Planta 1" },
{ id: "B", tipo: "Switch", ubicacion: "Planta 1" },
{ id: "C", tipo: "Switch", ubicacion: "Planta 2" },
{ id: "D", tipo: "Switch", ubicacion: "Planta 3" },
{ id: "E", tipo: "Router", ubicacion: "Planta 3" }
],
conexiones: [
{ origen: "A", destino: "B", ancho_banda: 1000 },
{ origen: "A", destino: "C", ancho_banda: 1000 },
{ origen: "B", destino: "C", ancho_banda: 100 },
{ origen: "B", destino: "D", ancho_banda: 100 },
{ origen: "C", destino: "D", ancho_banda: 100 },
{ origen: "C", destino: "E", ancho_banda: 1000 },
{ origen: "D", destino: "E", ancho_banda: 1000 }
]
};

const conexionesPorNodo_1 = {};
topologiaRed_1.nodos.forEach(nodo => {
conexionesPorNodo_1[nodo.id] = 0;
});

topologiaRed_1.conexiones.forEach(conexion => {
  conexionesPorNodo_1[conexion.origen]++;
  conexionesPorNodo_1[conexion.destino]++;
});

const nodosOrdenados = Object.entries(conexionesPorNodo_1)
  .sort((a, b) => b[1] - a[1]);

// Sugerencias de optimización
const sugerencias = nodosOrdenados
  .filter(([nodo, cantidad]) => cantidad > 2)
  .map(([nodo, cantidad]) => `El nodo ${nodo} tiene ${cantidad} conexiones. Podría necesitar más ancho de banda.`);

console.log("Conexiones por nodo:", conexionesPorNodo_1);
console.log("Nodos ordenados por número de conexiones:", nodosOrdenados);
console.log("Sugerencias de optimización:", sugerencias);

//ejercicio 10

const topologiaRed_2 = {
nodos: [
{ id: "A", tipo: "Router", ubicacion: "Planta 1" },
{ id: "B", tipo: "Switch", ubicacion: "Planta 1" },
{ id: "C", tipo: "Switch", ubicacion: "Planta 2" },
{ id: "D", tipo: "Switch", ubicacion: "Planta 3" },
{ id: "E", tipo: "Router", ubicacion: "Planta 3" }
],
conexiones: [
{ origen: "A", destino: "B", ancho_banda: 1000 },
{ origen: "A", destino: "C", ancho_banda: 1000 },
{ origen: "B", destino: "C", ancho_banda: 100 },
{ origen: "B", destino: "D", ancho_banda: 100 },
{ origen: "C", destino: "D", ancho_banda: 100 },
{ origen: "C", destino: "E", ancho_banda: 1000 },
{ origen: "D", destino: "E", ancho_banda: 1000 }
]
};

//cuenta las conexiones por nodo
const conexionesPorNodo2= {};
topologiaRed_2.nodos.forEach(nodo => {
conexionesPorNodo2[nodo.id] = 0;
});

// Tu código aquí para contar las conexiones
topologiaRed_2.conexiones.forEach(conexion => {
  conexionesPorNodo2[conexion.origen]++;
  conexionesPorNodo2[conexion.destino]++;
});

// Ordenar nodos de mayor a menor
const nodosOrdenados2 = Object.entries(conexionesPorNodo2)
  .sort((a, b) => b[1] - a[1]);

// Identificar cuellos de botella
const optimizaciones = nodosOrdenados2.map(([nodo, conexiones]) => {
  if (conexiones > 2) {
    return `El nodo ${nodo} es un punto crítico (${conexiones} conexiones). Se recomienda revisar su ancho de banda.`;
  } else {
    return `El nodo ${nodo} tiene una carga normal (${conexiones} conexiones).`;
  }
});

console.log("Conexiones por nodo:", conexionesPorNodo2);
console.log("Nodos ordenados:", nodosOrdenados2);
console.log("Recomendaciones:", optimizaciones);