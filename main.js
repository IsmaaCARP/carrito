
const divListaDeProductos = document.getElementById("listaDeProductos");

const tbodyCarrito = document.getElementById("tbodyCarrito");


const spanTotal = document.getElementById("total");

let productos = [];

let carrito = [];
  
/**
  * Clases 
  */
class Producto {

  constructor (nombre, precio, stock) {
      this.nombre = nombre;
      this.precio = precio;
      this.stock = stock;
  }

  descontarStock () {
      this.stock--;
  }
}

class ProductoCarrito {

  constructor (nombre, precio, cantidad = 1) {
      this.nombre = nombre;
      this.precio = precio;
      this.cantidad = cantidad;
  }

  sumarCantidad () {
      this.cantidad++;
  }
}

/**
  * Funciones 
  */

function calcularTotal () {

  let total = 0;  

       total = carrito.reduce( (acumulador, productoCarrito) => {
      return acumulador + (productoCarrito.cantidad * productoCarrito.precio);
  }, 0);

  
  spanTotal.innerHTML = `$${total}`;
}

function eliminarProducto (productoAEliminar) {

  
  const indiceProductoEncontrado = carrito.findIndex( (productoCarrito) => productoCarrito.nombre === productoAEliminar.nombre);

  if(indiceProductoEncontrado !== -1) {

      
      carrito.splice(indiceProductoEncontrado, 1);
  }

  
  crearCarrito();
}

function crearCarrito () {

  
  tbodyCarrito.innerHTML = "";

  for(const productoCarrito of carrito) {

      
      const tr = document.createElement("tr");

      const tdNombre = document.createElement("td");
      tdNombre.innerText = `${productoCarrito.nombre}`;

      const tdPrecio = document.createElement("td");
      tdPrecio.innerText = `$${productoCarrito.precio}`;

      const tdCantidad = document.createElement("td");
      tdCantidad.innerText = `${productoCarrito.cantidad}`;

      const tdAcciones = document.createElement("td");
      const btnEliminarProducto = document.createElement("button");
      btnEliminarProducto.innerText = "Eliminar";

      
      btnEliminarProducto.addEventListener("click", () => {
          eliminarProducto(productoCarrito);
      });

      tdAcciones.append(btnEliminarProducto);

      
      tr.append(tdNombre, tdPrecio, tdCantidad, tdAcciones);

      
      tbodyCarrito.append(tr);
  }

  calcularTotal();

}

function productoTieneStock (productoAAgregar) {
  return productoAAgregar.stock >= 1;
}

function agregarProductoAlCarrito (productoAAgregar) {

  
  const productoEncontrado = carrito.findIndex( (productoCarrito) => productoCarrito.nombre === productoAAgregar.nombre);

  
  if(productoEncontrado === -1) {

      
      carrito.push(
          new ProductoCarrito(productoAAgregar.nombre, productoAAgregar.precio));

      
      productoAAgregar.descontarStock();


  } else { 
      
      if(productoTieneStock(productoAAgregar)) {

          
          carrito[productoEncontrado].sumarCantidad();

          productoAAgregar.descontarStock();

      } else {

          Swal.fire({
              icon: 'error',
              title: 'No hay stock',
              text: 'El producto no tiene stock',
          })
      }
  }

  
  crearCarrito();
  crearListaDeProductos(productos);
}

function crearListaDeProductos () {

  
  divListaDeProductos.innerHTML = "";

  
  for(const productoDeLista of productos) {

      
      const div = document.createElement("div");

      
      const nombre = document.createElement("h3");
      nombre.innerText = productoDeLista.nombre;

      
      const precio = document.createElement("h4");
      precio.innerText = `$${productoDeLista.precio}`;

      
      const stock = document.createElement("h4");
      stock.innerText = `Stock: ${productoDeLista.stock}`;

      
      const btnAgregarAlCarrito = document.createElement("button");
      btnAgregarAlCarrito.innerText = "Agregar al carrito";

      
      btnAgregarAlCarrito.addEventListener("click", () => {

          
          agregarProductoAlCarrito(productoDeLista)});

      
      div.append(nombre, precio, stock, btnAgregarAlCarrito);

      
      divListaDeProductos.append(div);
  }

}

function getProductsOfJSON () {

  fetch('/productos.json')
      .then( (response) => {
          return response.json();
      })
      .then( (productosJSON) => {

          for(const productoJSON of productosJSON) {

              productos.push(new Producto(
                  productoJSON.nombre,
                  productoJSON.precio,
                  productoJSON.stock,
              ));
          }

          crearListaDeProductos()
    });
}



getProductsOfJSON ();