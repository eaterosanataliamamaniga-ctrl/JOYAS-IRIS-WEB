// ========================================================
// PÁGINA 2 - COLECCIONES (Carga dinámica desde Firebase)
// ========================================================

let categoriaActual = 'vestido';
let productoActualModal = null;

const categoriaTextos = {
  vestido: 'Joyería para mujeres de vestido',
  oficina: 'Joyería para mujeres de pollera',
  varones: 'Joyería para varones',
  ninos: 'Joyería para niños y niñas',
};

// ========================================================
// CARGAR PRODUCTOS POR CATEGORÍA
// ========================================================

function cargarProductosPorCategoria(categoria) {
  categoriaActual = categoria;
  const gridProductos = document.getElementById('grid-productos');
  const nombreCategoria = document.getElementById('nombre-categoria-actual');

  // Actualizar título de categoría
  nombreCategoria.textContent = categoriaTextos[categoria];

  // Mostrar mensaje de carga
  gridProductos.innerHTML =
    '<p class="cargando-productos">Cargando productos...</p>';

  // Consultar Firestore (sin orderBy para evitar necesidad de índice)
  db.collection('productos')
    .where('categoria', '==', categoria)
    .get()
    .then((snapshot) => {
      gridProductos.innerHTML = '';

      if (snapshot.empty) {
        gridProductos.innerHTML =
          '<p class="cargando-productos">No hay productos en esta categoría.</p>';
        return;
      }

      let index = 0;
      snapshot.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        renderizarProductoCard(producto, index);
        index++;
      });
    })
    .catch((error) => {
      console.error('Error al cargar productos:', error);
      gridProductos.innerHTML =
        '<p class="cargando-productos">Error al cargar productos. Revisa la consola (F12) para más detalles.</p>';
    });
}

// ========================================================
// RENDERIZAR TARJETA DE PRODUCTO
// ========================================================

function renderizarProductoCard(producto, index) {
  const gridProductos = document.getElementById('grid-productos');

  const card = document.createElement('div');
  card.className = 'producto-card-coleccion';
  card.dataset.productoId = producto.id;

  // Alternar colores de botones
  const btnClass = index % 2 === 0 ? 'btn-dorado' : 'btn-verde';

  card.innerHTML = `
        <img src="${producto.imagenUrl || 'imagenes/placeholder.jpg'}" alt="${
    producto.nombre
  }">
        <div class="producto-info-card">
            <h4 class="producto-nombre-card">${producto.nombre}</h4>
            <p class="producto-precio-card">Bs. ${parseFloat(
              producto.precio,
            ).toFixed(2)}</p>
        </div>
        <div class="producto-acciones-card">
            <a href="#" class="descripcion-btn ${btnClass}" data-producto-id="${
    producto.id
  }">
                <i class="fas fa-file-alt"></i> VER DETALLES
            </a>
            <button class="btn-agregar-carrito-card" data-producto-id="${
              producto.id
            }" ${producto.stock <= 0 ? 'disabled' : ''}>
                <i class="fas fa-cart-plus"></i> AGREGAR
            </button>
        </div>
    `;

  gridProductos.appendChild(card);

  // Agregar evento al botón de descripción
  const btnDescripcion = card.querySelector('.descripcion-btn');
  btnDescripcion.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarModalProducto(producto);
  });

  // Agregar evento al botón de agregar al carrito
  const btnAgregarCarrito = card.querySelector('.btn-agregar-carrito-card');
  btnAgregarCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    if (producto.stock > 0) {
      agregarAlCarritoDirecto(producto);
    }
  });
}

// ========================================================
// AGREGAR AL CARRITO DIRECTO (SIN MODAL)
// ========================================================

function agregarAlCarritoDirecto(producto) {
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
        imagenUrl: producto.imagenUrl,
        cantidad: 1,
      });
    }

    localStorage.setItem('joyasCarrito', JSON.stringify(carrito));

    if (typeof window.mostrarNotificacionCarrito === 'function') {
      window.mostrarNotificacionCarrito(producto.nombre);
    } else {
      alert(`${producto.nombre} agregado al carrito`);
    }
  }
}

// ========================================================
// MODAL DE DESCRIPCIÓN
// ========================================================

function mostrarModalProducto(producto) {
  productoActualModal = producto;

  const modal = document.getElementById('modal-producto');
  const modalImg = document.getElementById('modal-img');
  const modalNombre = document.getElementById('modal-nombre');
  const modalPrecio = document.getElementById('modal-precio');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalMaterial = document.getElementById('modal-material');
  const modalStock = document.getElementById('modal-stock');

  modalImg.src = producto.imagenUrl || 'imagenes/placeholder.jpg';
  modalImg.alt = producto.nombre;
  modalNombre.textContent = producto.nombre;
  modalPrecio.textContent = `Bs. ${parseFloat(producto.precio).toFixed(2)}`;
  modalDescripcion.textContent = producto.descripcion;

  if (producto.material) {
    modalMaterial.innerHTML = `<strong>Material:</strong> ${producto.material}`;
    modalMaterial.style.display = 'block';
  } else {
    modalMaterial.style.display = 'none';
  }

  modalStock.innerHTML = `<strong>Disponibilidad:</strong> ${
    producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'
  }`;

  // Deshabilitar botón si no hay stock
  const btnAgregarCarrito = document.getElementById('agregar-carrito-modal');
  btnAgregarCarrito.disabled = producto.stock <= 0;
  btnAgregarCarrito.innerHTML =
    producto.stock > 0
      ? '<i class="fas fa-cart-plus"></i> AGREGAR AL CARRITO'
      : '<i class="fas fa-times-circle"></i> AGOTADO';

  modal.classList.add('activo');
}

function cerrarModalProducto() {
  const modal = document.getElementById('modal-producto');
  modal.classList.remove('activo');
  productoActualModal = null;
}

// ========================================================
// CAMBIAR CATEGORÍA
// ========================================================

function configurarCategorias() {
  const linksCategoria = document.querySelectorAll('.cat-link');

  linksCategoria.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Quitar clase activo de todos
      linksCategoria.forEach((l) => l.classList.remove('activo'));

      // Agregar clase activo al clickeado
      link.classList.add('activo');

      // Cargar productos de la categoría
      const categoria = link.dataset.categoria;
      cargarProductosPorCategoria(categoria);
    });
  });
}

// ========================================================
// AGREGAR AL CARRITO DESDE MODAL
// ========================================================

function agregarAlCarritoDesdeModal() {
  if (!productoActualModal) return;

  // Verificar si existe la función global agregarAlCarrito (de main.js)
  if (typeof window.agregarAlCarrito === 'function') {
    window.agregarAlCarrito(productoActualModal);
    cerrarModalProducto();
  } else {
    // Fallback: Agregar directamente al localStorage
    let carrito = JSON.parse(localStorage.getItem('joyasCarrito')) || [];

    const itemExistente = carrito.find(
      (item) => item.id === productoActualModal.id,
    );

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      carrito.push({
        id: productoActualModal.id,
        nombre: productoActualModal.nombre,
        precio: parseFloat(productoActualModal.precio),
        imagenUrl: productoActualModal.imagenUrl,
        cantidad: 1,
      });
    }

    localStorage.setItem('joyasCarrito', JSON.stringify(carrito));

    // Mostrar notificación
    if (typeof window.mostrarNotificacionCarrito === 'function') {
      window.mostrarNotificacionCarrito(productoActualModal.nombre);
    } else {
      alert(`${productoActualModal.nombre} agregado al carrito`);
    }

    cerrarModalProducto();
  }
}

// ========================================================
// EVENTOS DEL MODAL
// ========================================================

function configurarModal() {
  const modal = document.getElementById('modal-producto');
  const cerrarBtn = document.querySelector('.cerrar-modal');
  const btnAgregarCarrito = document.getElementById('agregar-carrito-modal');

  // Cerrar modal con la X
  cerrarBtn.addEventListener('click', cerrarModalProducto);

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModalProducto();
    }
  });

  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('activo')) {
      cerrarModalProducto();
    }
  });

  // Agregar al carrito
  btnAgregarCarrito.addEventListener('click', agregarAlCarritoDesdeModal);
}

// ========================================================
// INICIALIZAR PÁGINA 2
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Solo ejecutar si estamos en pagina2.html
  if (document.getElementById('colecciones-page')) {
    configurarCategorias();
    configurarModal();

    // Cargar productos de la categoría por defecto
    cargarProductosPorCategoria('vestido');
  }
});
