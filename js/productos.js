fetch('../data/data.json')
  .then(response => response.json())
  .then(productos => {
    const contenedor = document.getElementById('contenedorProductos')

    productos.forEach(producto => {
      const card = document.createElement('div')
      card.classList.add('cardProducto')

      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="infoProducto">
          <div class="nombrePrecio">
            <h4>${producto.nombre}</h4>
            <p>$${producto.precio.toLocaleString('es-AR')}</p>
          </div>
          <div class="botonesProducto">
            <button class="btnAgregar">Agregar al carrito</button>
          </div>
        </div>
      `

      const boton = card.querySelector('.btnAgregar')
      boton.addEventListener('click', () => agregarAlCarrito(producto))

      contenedor.appendChild(card)
    })
  })

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(producto) {
    const  nombreProducto = producto.nombre;

    const precioProducto = producto.precio

    const imgProducto = producto.imagen;


const proExistente = carrito.find(item => item.id === producto.id)

    if(proExistente) {
        proExistente.cantidad++
        proExistente.total = proExistente.precioProducto * proExistente.cantidad;
    }else {
        const  nuevoProducto = {
            id: producto.id,
            nombreProducto,
            precioProducto,
            imagen: imgProducto,
            cantidad: 1,
            total : precioProducto * 1
        }
        carrito.push(nuevoProducto)

    }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        console.log(carrito);

        const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000
    })

    Toast.fire({
        icon: "success",
        title: "Producto agregado al carrito"
    })

}

