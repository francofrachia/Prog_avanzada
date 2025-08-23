//metodos en arrays

const personas = [
    { nombre: 'Juan', edad: 30, aprendiendo: 'JavaScript' },
    { nombre: 'Ana', edad: 25, aprendiendo: 'Python' }, 
    { nombre: 'Pedro', edad: 35, aprendiendo: 'Java' },
    { nombre: 'Maria', edad: 20, aprendiendo: 'C++' },
    { nombre: 'Luis', edad: 28, aprendiendo: 'Ruby' }
]

console.log(personas);

const personas2 = [
    { nombre: 'Laura', edad: 32, aprendiendo: 'Go' },
    { nombre: 'Carlos', edad: 29, aprendiendo: 'Swift' },
    { nombre: 'Marta', edad: 27, aprendiendo: 'Kotlin' },
    { nombre: 'Sofia', edad: 24, aprendiendo: 'PHP' }
];

console.log(personas2);
//función pe FITRAR mayores de 22 años

const mayores = [...personas, ...personas2].filter(persona => persona.nombre === 'Juan' || persona.aprendiendo === 'JavaScript');