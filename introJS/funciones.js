
//function declaration
function saludar(nombre) {
    console.log("Bienvenido, " + nombre + "!")
}

saludar("Tito");

//function expresion
const cliente = function(nombreCliente, edadCliente) {
    console.log("Mostrando datos del ciente: Nombre: " + nombreCliente + ", Edad: " + edadCliente)
}

cliente("Juan", 20);

function actividad(nombre = "Walter White", nombreActividad = "Profesor de quimica") {
    console.log(`El cliente ${nombre} esta realizando la actividad: ${nombreActividad}`)
}

actividad("Juan", "programacion en JavaScript");
actividad("Ernesto", "desarrollo web");
actividad(); //parametros por defecto