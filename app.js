//BOTÓN SALUDO

const btnSaludo = document.querySelector("#btnSaludo");
btnSaludo.addEventListener("click", () => {
    const nombre = prompt("¿Cómo te llamas?", "Invitado");
    nombre ? alert(`Hola ${nombre}`) : alert("Sigues como Invitado");
});

//CATÁLOGO DE PRODUCTOS (definición del array de productos)

const productos = [
    { id: 1, nombre: "Pienso para cabras", tipo: "Cabras", precio: "12.19" },
    { id: 2, nombre: "Pienso para corzos", tipo: "Corzos", precio: "10.59" },
    { id: 3, nombre: "Pienso para caballas", tipo: "Caballas", precio: "12.999" },
    { id: 4, nombre: "Pienso para jabalís", tipo: "Jabalís", precio: "10.9" },
    { id: 5, nombre: "Pienso para vacalouras", tipo: "Vacalouras", precio: "12.99" },
    { id: 6, nombre: "Pienso para ratas", tipo: "Ratas", precio: "5.99" },
    { id: 7, nombre: "Pienso para carrachos", tipo: "Carrachos", precio: "18.99" },
    { id: 8, nombre: "Pienso para hormigas", tipo: "Hormigas", precio: "10.224" }
];

// DIBUJAR CATÁLOGO DE PRODUCTOS EN EL DOM

const catalogo = document.querySelector("#gridProductos")
for (const p of productos) {
    const card = document.createElement("article")
    card.className = "product"
    card.innerHTML = `
    <h4>${p.nombre}</h4>
    <p>Tipo: ${p.tipo}</p>
    <p class="price">${aEur(Number(p.precio))}</p>
    <button class="btn" data-id="${p.id}">Añadir</button>
    `;
    catalogo.appendChild(card)
}

// BOTONES AÑADIR AL CARRITO

const botones = document.querySelectorAll(".btn");
botones.forEach(btn => {
    btn.addEventListener("click", () => {
        const idProducto = btn.getAttribute("data-id");
        agregar(Number(idProducto));
    })
});

// BOTONES AÑADIR AL CARRITO (USANDO EVENT DELEGATION)
// La delegación de eventos (event delegation) en JavaScript
// es una técnica que permite manejar eventos de múltiples elementos hijos
// adjuntando un único detector de eventos a un elemento padre común
// Event bubbling - Propagacion de eventos
// event.target.closest('[data-id]') 

const grid = document.querySelector("#gridProductos");
grid.addEventListener("click", (event) => { 
    // event se refiere al propio evento de click que estoy escuchando
    const boton = event.target.closest(".button[data-id]");
    if (!boton) return;
    const idProducto = boton.getAttribute("data-id");
    agregar(Number(idProducto));
});

// BUSCAR PRODUCTO POR ID (retorna un objeto producto o undefined si no encuentra)

// Lo hago en función flecha en este ejercicio, pero lo suyo es hacerlo con función clasica
const buscarProducto = idProducto => productos.find(producto => producto.id === idProducto);

// CARRITO DE LA COMPRA (lo inicializo vacío)

let carrito = [];

// BOTÓN VACIAR CARRITO (lo selecciono y le añado el listener)

const btnVaciar = document.querySelector("#btnVaciar");
btnVaciar.addEventListener("click", vaciarCarrito);

// AGREGAR PRODUCTO AL CARRITO

function agregar(idProducto) {
    // busco el producto en el catálogo
    const p = buscarProducto(idProducto);
    // si no lo encuentro, salgo
    if (!p) return;
    // busco si ya existe una línea en el carrito con ese idProducto
    const linea = carrito.find((item) => item.id === idProducto);
    // si la línea ya existe, incremento la cantidad y actualizo el subtotal
    if (linea) {
        linea.cantidad += 1;
        linea.subtotal = +(linea.cantidad * Number(p.precio));
    } else {
        // si no existe la línea, la creo con cantidad 1 y subtotal igual al precio del producto
        carrito.push({ id: p.id, nombre: p.nombre, cantidad: 1, subtotal: +p.precio })
    }
    // finalmente dibujo el carrito actualizado
    dibujarCarrito(carrito);
}

// DIBUJAR CARRITO DE LA COMPRA

// La función recibe un array de líneas del carrito
// Cada línea es un objeto con id, nombre, cantidad y subtotal
function dibujarCarrito(lineas = []) {
    // selecciono los elementos del DOM donde voy a dibujar el carrito
    const ulCarrito = document.querySelector("#listaCarrito");
    const txtUnidades = document.querySelector("#txtUnidades");
    const txtTotal = document.querySelector("#txtTotal");
    // limpio el contenido previo del carrito
    ulCarrito.innerHTML = "";
    let totalUnidades = 0;
    let totalPrecio = 0;

    // Recorro las líneas del carrito y las dibujo
    // Además, voy acumulando el total de unidades y el total del precio
    lineas.forEach(item => {
        // Creo un elemento li con cada línea del carrito
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - ${item.cantidad} x ${aEur(item.subtotal)}`;
        // Añado el li al ul del carrito
        ulCarrito.appendChild(li);
        // Acumulo las unidades y el precio total
        totalUnidades += item.cantidad;
        totalPrecio += item.subtotal;
    });
    // Actualizo los unidades y precio en el DOM
    txtUnidades.textContent = totalUnidades;
    txtTotal.textContent = aEur(totalPrecio);

}

// VACIAR CARRITO DE LA COMPRA

function vaciarCarrito() {
    carrito = [];
    dibujarCarrito([]);
};

// FUNCIONES AUXILIARES

function aEur(importe) {
    return `${importe.toFixed(2)} €`; 
};

function precioConIVA(precio = 0, iva = 0.21) {
    return precio + (precio * iva);
}
