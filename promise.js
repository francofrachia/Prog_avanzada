

// promises

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    let descuento = false;
    if (descuento) {
      resolve("Descuento aplicado");
    } else {
      reject("No se pudo aplicar el descuento");
    }
}, 3000);
}       );