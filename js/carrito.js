const contenedorCarrito = document.getElementById("contenedorCarrito")
const contenedorTotal = document.querySelector(".total")
const finalizarCompra = document.querySelector(".finalizarCompra")
const metodosPago = document.querySelector(".modal-body")
const btnConfirmar = document.querySelector(".btnConfirmarCompra")

console.log(contenedorCarrito);

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function crearCarrito () {

    contenedorCarrito.innerHTML = " "
    

    if(carrito.length === 0) {
    finalizarCompra.innerHTML = ""
    contenedorCarrito.innerHTML = `
        <article>
            <p>
                El carrito esta vacio
            </p>
            <a href="../pages/productos.html">
                Puede visitar nuestra seccion de productos para encontrar lo que busca
            </a>
        </article>
        `
        contenedorTotal.innerHTML = ""

        return;
    }

    carrito.forEach(producto => {
        const cardCarrito = document.createElement('div')
        cardCarrito.classList.add('cardCarrito')

        cardCarrito.innerHTML =  `
                <div>
                    <img src="${producto.imagen}" alt="">
                    <h4>${producto.nombreProducto}</h4>
                </div> 

                <div class="agregarEliminar">
                    <button class="botonRestar">-</button>
                    <p>${producto.cantidad}</p>
                    <button class="botonSumar">+</button>
                </div>
                <div class="precioCarrito">
                    <h4>${producto.total}</h4>
                </div>
                <div>
                    <button class="botonEliminar">X</button>
                </div>
        
        `

        contenedorCarrito.appendChild(cardCarrito)

        

        const botonRestar = cardCarrito.querySelector(".botonRestar");
        const botonSumar = cardCarrito.querySelector(".botonSumar");
        const botonEliminar = cardCarrito.querySelector(".botonEliminar");

        botonRestar.addEventListener("click", restar);
        botonSumar.addEventListener("click", sumar);
        botonEliminar.addEventListener("click", eliminar)

        function restar() {
            if(producto.cantidad > 1) {
                producto.cantidad -= 1;
                producto.total = producto.precioProducto * producto.cantidad;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                contenedorCarrito.innerHTML = "";
                crearCarrito();
               
            }
        }

        function sumar() {
                producto.cantidad += 1;
                producto.total = producto.precioProducto * producto.cantidad;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                contenedorCarrito.innerHTML = "";
                crearCarrito();
               
            
        }

        function eliminar(){
            const index = carrito.indexOf(producto);
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            contenedorCarrito.innerHTML = "";
            crearCarrito();
           
        }

    });



    function calcularTotal() {
        if(carrito.length > 0) {
        let total = 0;
        carrito.forEach(producto =>{
            total += producto.total
        })
        contenedorTotal.innerHTML = `
        <span>Total: </span> $${total.toLocaleString("es-AR")}
        `
        finalizarCompra.innerHTML = ""
        const botonFinalizar = document.createElement('button')
        botonFinalizar.classList.add('button')
        botonFinalizar.classList.add('buttonFinalizar')
        botonFinalizar.setAttribute("data-bs-toggle", "modal")
        botonFinalizar.setAttribute("data-bs-target", "#miModal")

        botonFinalizar.innerHTML = `
            Finzalizar Compra
        `
        finalizarCompra.appendChild(botonFinalizar)
        

        }
    }

    function mostrarMetodosPago() {
        metodosPago.innerHTML = ""
        const formPagos = document.createElement("form")
        formPagos.innerHTML = `
                <div class="inputEmail">
                    <label>Email</label>
                    <input type="email" class="emailCompra" placeholder="ejemplo@email.com">
                </div>
                <div>
                    <label>
                        <input class="opcionPago" type="radio" name="pago" value="credito">
                        Tarjeta Crédito (Hasta 6 cuotas sin interés)
                    </label>
                </div>
                <div>
                    <label>
                        <input class="opcionPago" type="radio" name="pago" value="debito">
                        Tarjeta Débito (10% de descuento)
                    </label>
                </div>
                <div>
                    <label>
                        <input class="opcionPago" type="radio" name="pago" value="transferencia">
                        Transferencia (15% de descuento)
                    </label>
                </div>
                <div>
                    <label>
                        <input class="opcionPago" type="radio" name="pago" value="efectivo">
                        Efectivo en el local (20% de descuento)
                    </label>
                </div>
            `
            const opciones = formPagos.querySelectorAll(".opcionPago")
            const totalModal = document.createElement("p")
            formPagos.appendChild(totalModal)
            opciones.forEach((opcion) =>{
                opcion.addEventListener("change", (e) =>{
                const opcionSeleccionada = e.target.value;
                localStorage.setItem("opcionSeleccionada", e.target.value)
                let total = 0;
                carrito.forEach(producto => total += producto.total)

                let totalConDescuento = 0;

                switch(opcionSeleccionada) {
                    case "credito":
                        totalConDescuento = total;
                        break;
                    case "debito":
                        totalConDescuento = total - (total * 0.10);
                        break;
                    case "transferencia":
                        totalConDescuento = total - (total * 0.15);
                        break;
                    case "efectivo":
                        totalConDescuento = total - (total * 0.20);
                        break;
                }
                totalModal.innerHTML = `Total con descuento: $${totalConDescuento.toLocaleString("es-AR")}`
                    })
                })

                
            metodosPago.appendChild(formPagos)
    }
    mostrarMetodosPago();
    calcularTotal();

}


btnConfirmar.addEventListener("click", () => {
    const email = document.querySelector(".emailCompra").value
    const opcionSeleccionada = document.querySelector(".opcionPago:checked")
    if(!email || !opcionSeleccionada) {
        Swal.fire({
            title: "Error",
            text: "Por favor completá el email y seleccioná un método de pago",
            icon: "error"
        })
        return
    }
    Swal.fire({
        title: "¡Compra realizada!",
        text: `Te enviaremos el link de pago y los medios de envio o retiro a: ${email}`,
        icon: "success"
    }).then(() => {
    carrito = []
    localStorage.clear()
    crearCarrito()
    window.location.href = "../index.html";
})
    
})
crearCarrito();