let carrito = [];
const carritoItems = document.getElementById('carrito-items');
const total = document.getElementById('total');

function agregarAlCarrito(nombre, precio) {
  const itemExistente = carrito.find(producto => producto.nombre === nombre);
  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarrito();
}

function eliminarDelCarrito(nombre) {
  carrito = carrito.filter(producto => producto.nombre !== nombre);
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoItems.innerHTML = '';
  let totalCompra = 0;

  carrito.forEach(producto => {
    const item = document.createElement('div');
    item.className = 'carrito-item';
    item.innerHTML = `
      <span>${producto.nombre} (x${producto.cantidad})</span>
      <span>S/ ${(producto.precio * producto.cantidad).toFixed(2)}</span>
      <button onclick="eliminarDelCarrito('${producto.nombre}')">❌</button>
    `;
    carritoItems.appendChild(item);
    totalCompra += producto.precio * producto.cantidad;
  });

  total.innerText = totalCompra.toFixed(2);
}

// 🧾 NUEVA función de pagar con boleta imprimible
function pagarCarrito() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const boletaSeccion = document.getElementById("boleta");
  const boletaDetalle = document.getElementById("boleta-detalle");
  const boletaTotal = document.getElementById("boleta-total");

  boletaDetalle.innerHTML = "";
  let totalCompra = 0;

  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    totalCompra += subtotal;

    const detalle = document.createElement("p");
    detalle.innerHTML = `
      <strong>${producto.nombre}</strong> - 
      Cantidad: ${producto.cantidad} - 
      Precio Unitario: S/ ${producto.precio.toFixed(2)} - 
      Subtotal: S/ ${subtotal.toFixed(2)}
    `;
    boletaDetalle.appendChild(detalle);
  });

  boletaTotal.innerText = totalCompra.toFixed(2);
  boletaSeccion.style.display = "block";

  vaciarCarrito(); // Limpia el carrito
}
function descargarBoletaWord() {
  const detalle = document.getElementById('boleta-detalle').innerHTML;
  const total = document.getElementById('boleta-total').innerText;

  const contenidoHTML = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Boleta</title></head>
    <body>
      <h2>🧾 Boleta de Compra</h2>
      ${detalle}
      <p><strong>Total:</strong> S/ ${total}</p>
      <p><em>Su pedido llegará dentro de 10 días hábiles.</em></p>
    </body>
    </html>`;

  const blob = new Blob(['\ufeff', contenidoHTML], {
    type: 'application/msword',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'boleta.doc';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
