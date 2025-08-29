
const carrito = ['Producto 1', 'Producto 2', 'Producto 3'];

carrito.map( producto => {
    return `El producto es: ${producto}`;
});

//Spread operator
let lenguajes = ['JavaScript', 'PHP', 'Python'];
let frameworks = ['React', 'Laravel', 'Django'];

//Unir ambos arrays en un solo array
let tecnologias = [...lenguajes, ...frameworks];

console.log(tecnologias);

let tecnologias2 = ['HTML', 'CSS'];

//Otra forma de unir arrays en un solo array
let teconogiasCompletas = lenguajes.concat(frameworks, tecnologias2);

console.log(teconogiasCompletas);
