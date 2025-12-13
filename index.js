// ========================================================
// INDEX.JS - Productos Destacados (Más Vendidos)
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  cargarProductosDestacados();
});

// ========================================================
// CARGAR PRODUCTOS DESTACADOS
// ========================================================

function cargarProductosDestacados() {
  const gridDestacados = document.getElementById('productos-destacados');

  if (!gridDestacados) return;

  gridDestacados.innerHTML =
    '<p class="cargando-productos" style="grid-column: 1/-1; text-align: center; color: #999;">Cargando productos destacados...</p>';

  // Consultar productos marcados como destacados
  db.collection('productos')
    .where('destacado', '==', true)
    .limit(4) // Solo 4 productos
    .get()
    .then((snapshot) => {
      gridDestacados.innerHTML = '';

      if (snapshot.empty) {
        gridDestacados.innerHTML =
          '<p class="cargando-productos" style="grid-column: 1/-1; text-align: center; color: #999;">No hay productos destacados aún. Marca algunos productos como "Más Vendido" desde el panel de administración.</p>';
        return;
      }

      snapshot.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        renderizarProductoDestacado(producto);
      });
    })
    .catch((error) => {
      console.error('Error al cargar productos destacados:', error);
      gridDestacados.innerHTML =
        '<p class="cargando-productos" style="grid-column: 1/-1; text-align: center; color: #999;">Error al cargar productos.</p>';
    });
}

// ========================================================
// RENDERIZAR PRODUCTO DESTACADO
// ========================================================

function renderizarProductoDestacado(producto) {
  const gridDestacados = document.getElementById('productos-destacados');

  const card = document.createElement('div');
  card.className = 'producto-card';

  card.innerHTML = `
        <img src="${producto.imagenUrl || 'imagenes/placeholder.jpg'}" alt="${
    producto.nombre
  }">
        <h4>${producto.nombre}</h4>
        <p class="producto-precio">Bs. ${parseFloat(producto.precio).toFixed(
          2,
        )}</p>

        <a href="#"
           class="cta-btn producto-btn producto-btn-agregar"
           data-id="${producto.id}"
           data-nombre="${producto.nombre}"
           data-precio="${producto.precio}"
           data-imagen="${producto.imagenUrl}"
           data-clase-btn="btn-dorado">
            AÑADIR A CARRITO
        </a>
    `;

  gridDestacados.appendChild(card);

  // Agregar evento al botón
  const btnAgregar = card.querySelector('.producto-btn-agregar');
  btnAgregar.addEventListener('click', (e) => {
    e.preventDefault();
    agregarProductoDesdeIndex(producto);
  });
}

// ========================================================
// AGREGAR PRODUCTO AL CARRITO DESDE INDEX
// ========================================================

function agregarProductoDesdeIndex(producto) {
  if (typeof window.agregarAlCarrito === 'function') {
    window.agregarAlCarrito(producto);
  } else {
    // Fallback
    let carrito = JSON.parse(localStorage.getItem('joyasCarrito')) || [];

    const itemExistente = carrito.find((item) => item.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        imagenUrl: producto.imagenUrl || 'imagenes/placeholder.jpg',
        cantidad: 1,
      });
    }

    localStorage.setItem('joyasCarrito', JSON.stringify(carrito));

    if (typeof window.mostrarNotificacionCarrito === 'function') {
      window.mostrarNotificacionCarrito(producto.nombre);
    }

    // Actualizar contador
    if (typeof window.actualizarContadorCarrito === 'function') {
      window.actualizarContadorCarrito();
    }
  }
}
