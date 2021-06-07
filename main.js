let carrito = {};
let cards = document.getElementById('cards');
let productos = document.getElementById('productos');
let footer = document.getElementById('footer');
let templateCard = document.getElementById('template-card').content;
let templateFooter = document.getElementById('template-footer').content;
let templateCarrito = document.getElementById('template-carrito').content;
let fragment = document.createDocumentFragment();

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        completarCarrito();
    };
});

const fetchData = async () => {
    try {
        const respuesta = await fetch('api.json');
        const data = await respuesta.json();
        completarCards(data);
    } catch (error) {
        console.log(error);
    }
};

let completarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.nombre;
        templateCard.querySelector('p span').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute("src", producto.imagenUrl);
        templateCard.querySelector('.btn-dark').dataset.id = producto.id;

        let clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

cards.addEventListener('click', e => {
    agregarCarrito(e);
});

let agregarCarrito = e => {
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

let setCarrito = objeto => {
    let producto = {
        id:objeto.querySelector('.btn-dark').dataset.id,
        nombre:objeto.querySelector('h5').textContent,
        precio:objeto.querySelector('p span').textContent,
        cantidad: 1
    };
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    };
    carrito[producto.id] = {...producto};
    completarCarrito();
};

let completarCarrito = () => {
    console.log(carrito);
    productos.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-success').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    productos.appendChild(fragment);
    completarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
};

let completarFooter = () => {
    footer.innerHTML = '';
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>
        `
        return;
    };
    let nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0);
    let nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad*precio,0);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    let botonVaciar = document.getElementById('vaciar-carrito');
    botonVaciar.addEventListener('click', () => {
        carrito = {};
        completarCarrito();
    });
};

productos.addEventListener('click', e => {
    botonSumaResta(e);
});

let botonSumaResta = e => {
    //Botón Suma
    if(e.target.classList.contains('btn-success')) {
        let producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
        carrito[e.target.dataset.id] = {...producto};
        completarCarrito();
    };
    //Botón Resta
    if(e.target.classList.contains('btn-danger')) {
        let producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1;
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        };
        completarCarrito();
    };
    e.stopPropagation();
};

