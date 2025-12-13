/**
 * ===============================================================
 * ARCHIVO: main.js
 * UNIFICACIÓN DE LÓGICA: Carrusel, GSAP y Carrito de Compras
 * ===============================================================
 */

// 1. SELECTORES GLOBALES (PARA EVITAR ERRORES DE SCOPE)
const productosGrid = document.querySelector('.productos-grid');
const notificacionToast = document.getElementById('notificacion-carrito');
const prodAnadidoNombre = document.getElementById('prod-anadido-nombre');

document.addEventListener('DOMContentLoaded', () => {
  // ===============================================
  // LÓGICA DEL CARRITO (LISTA DE RESERVA)
  // ===============================================

  const carritoSidebar = document.getElementById('carrito-sidebar');
  const abrirBtn = document.getElementById('abrir-carrito-btn');
  const cerrarBtn = document.getElementById('cerrar-carrito');
  const productosLista = document.getElementById('productos-carrito');
  const totalElemento = document.getElementById('carrito-total');
  const reservarBtn = document.getElementById('reservar-whatsapp-btn');

  // Inicializar el carrito desde localStorage
  let carrito = JSON.parse(localStorage.getItem('joyasCarrito')) || [];

  // --- Funciones del Carrito ---

  const mostrarNotificacion = (nombre) => {
    if (notificacionToast && prodAnadidoNombre) {
      // Remover clase anterior si existe
      notificacionToast.classList.remove('mostrar');

      // Pequeño delay para reiniciar la animación
      setTimeout(() => {
        prodAnadidoNombre.textContent = nombre.toUpperCase();
        notificacionToast.classList.add('mostrar');

        // Ocultar después de 3 segundos
        setTimeout(() => {
          notificacionToast.classList.remove('mostrar');
        }, 3000);
      }, 10);
    }
  };

  // Hacer la función global para uso desde otros scripts
  window.mostrarNotificacionCarrito = mostrarNotificacion;

  const guardarCarrito = () => {
    localStorage.setItem('joyasCarrito', JSON.stringify(carrito));
    actualizarCarritoUI();
  };

  const calcularTotal = () => {
    // Asegura que el cálculo del precio se haga correctamente
    return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  };

  const dibujarItemCarrito = (item) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-carrito');
    itemDiv.dataset.id = item.id;

    // Usar la imagen del producto o una por defecto
    const imgSrc = item.imagen || item.imagenUrl || `imagenes/default.jpg`;

    itemDiv.innerHTML = `
            <img src="${imgSrc}" alt="${item.nombre}">
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <p>Precio: Bs. ${parseFloat(item.precio).toFixed(2)}</p>
            </div>
            <div class="item-cantidad-precio">
                <span class="precio-item">Bs. ${(
                  item.precio * item.cantidad
                ).toFixed(2)}</span>
                <div class="cantidad-controles">
                    <button class="btn-cantidad btn-decrementar" data-id="${
                      item.id
                    }">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cantidad">Cant: ${item.cantidad}</span>
                    <button class="btn-cantidad btn-incrementar" data-id="${
                      item.id
                    }">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="eliminar-btn" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

    // Evento para eliminar
    itemDiv.querySelector('.eliminar-btn').addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      carrito = carrito.filter((prod) => prod.id != id);
      guardarCarrito();
    });

    // Evento para incrementar cantidad
    itemDiv.querySelector('.btn-incrementar').addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const producto = carrito.find((prod) => prod.id == id);
      if (producto) {
        producto.cantidad++;
        guardarCarrito();
      }
    });

    // Evento para decrementar cantidad
    itemDiv.querySelector('.btn-decrementar').addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const producto = carrito.find((prod) => prod.id == id);
      if (producto) {
        if (producto.cantidad > 1) {
          producto.cantidad--;
          guardarCarrito();
        } else {
          // Si la cantidad es 1, eliminar el producto
          carrito = carrito.filter((prod) => prod.id != id);
          guardarCarrito();
        }
      }
    });

    return itemDiv;
  };

  const actualizarCarritoUI = () => {
    productosLista.innerHTML = '';

    if (carrito.length === 0) {
      productosLista.innerHTML =
        '<p class="carrito-vacio-msg">El carrito está vacío.</p>';
      totalElemento.textContent = 'Bs. 0.00';
      reservarBtn.classList.add('disabled');
    } else {
      // Eliminar el mensaje de vacío si hay productos (siempre está dentro de productosLista)

      carrito.forEach((item) => {
        productosLista.appendChild(dibujarItemCarrito(item));
      });
      const total = calcularTotal();
      totalElemento.textContent = `Bs. ${total.toFixed(2)}`;
      reservarBtn.classList.remove('disabled');
    }

    // Actualiza el número de WhatsApp en cada actualización
    actualizarEnlaceWhatsApp();

    // Actualizar el contador del carrito
    actualizarContadorCarrito();
  };

  // Función para actualizar el contador de productos en el badge del carrito
  const actualizarContadorCarrito = () => {
    const contadorElemento = document.getElementById('carrito-contador');
    if (contadorElemento) {
      const totalProductos = carrito.reduce(
        (sum, item) => sum + item.cantidad,
        0,
      );
      contadorElemento.textContent = totalProductos;

      // Mostrar u ocultar el badge según si hay productos
      if (totalProductos > 0) {
        contadorElemento.style.display = 'flex';
      } else {
        contadorElemento.style.display = 'none';
      }
    }
  };

  // Hacer la función global para uso desde otros scripts
  window.actualizarContadorCarrito = actualizarContadorCarrito;

  const abrirCarrito = () => {
    carritoSidebar.classList.add('abierto');
  };

  const cerrarCarrito = () => {
    carritoSidebar.classList.remove('abierto');
  };

  // --- Añadir Producto (Central) ---

  // Función global para agregar productos al carrito
  window.agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find((item) => item.id == producto.id);

    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        cantidad: 1,
        imagen: producto.imagenUrl || 'imagenes/default.jpg',
      });
    }

    guardarCarrito();
    mostrarNotificacion(producto.nombre);
  };

  document.querySelectorAll('.producto-btn-agregar').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const btn = e.currentTarget;

      const id = btn.dataset.id;
      const nombre = btn.dataset.nombre;
      const precio = parseFloat(btn.dataset.precio);

      // Obtener la ruta de la imagen del producto (ajustado para el HTML de la página 1)
      const imagen = btn.closest('.producto-card').querySelector('img').src;

      const productoData = { id, nombre, precio, imagenUrl: imagen };
      window.agregarAlCarrito(productoData);
      // Puedes decidir si quieres abrir el sidebar o solo mostrar la notificación:
      // abrirCarrito();
    });
  });

  // --- Generar Enlace de WhatsApp (Corregido y Centralizado) ---

  const actualizarEnlaceWhatsApp = () => {
    if (carrito.length === 0) {
      reservarBtn.href = '#';
      reservarBtn.style.pointerEvents = 'none';
      return;
    }

    reservarBtn.style.pointerEvents = 'auto';

    let mensaje = `╔════════════════════════════════╗
║   JOYAS Y ACCESORIOS IRIS      ║
║      Solicitud de Reserva      ║
╚════════════════════════════════╝

📋 *Detalles del Pedido:*
`;
    let total = 0;

    carrito.forEach((item) => {
      const subtotal = item.precio * item.cantidad;
      mensaje += `\n▪️ *${item.nombre}*\n   • Cantidad: ${
        item.cantidad
      } unidad${
        item.cantidad > 1 ? 'es' : ''
      }\n   • Precio unitario: Bs. ${item.precio.toFixed(
        2,
      )}\n   • Subtotal: *Bs. ${subtotal.toFixed(2)}*\n`;
      total += subtotal;
    });

    mensaje += `\n${'─'.repeat(35)}\n`;
    mensaje += `💎 *TOTAL A PAGAR: Bs. ${total.toFixed(2)}*\n`;
    mensaje += `${'─'.repeat(35)}\n\n`;
    mensaje += `📞 *¿Podrían confirmar disponibilidad?*\n\n`;
    mensaje += `Gracias por su atención. Quedo atento a su respuesta. 🙏✨`;

    // 🛑 REEMPLAZA ESTO con tu número de WhatsApp (formato internacional sin +)
    const numeroWhatsApp = '59171277520';
    const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje,
    )}`;

    reservarBtn.href = enlaceWhatsApp;
    reservarBtn.setAttribute('target', '_blank'); // Abre en una nueva pestaña
  };

  // --- Event Listeners del Sidebar ---

  abrirBtn.addEventListener('click', abrirCarrito);
  cerrarBtn.addEventListener('click', cerrarCarrito);

  // Cierre al hacer clic fuera del carrito
  document.addEventListener('click', (e) => {
    if (
      carritoSidebar.classList.contains('abierto') &&
      !carritoSidebar.contains(e.target) &&
      !abrirBtn.contains(e.target)
    ) {
      cerrarCarrito();
    }
  });

  // Inicialización del carrito
  actualizarCarritoUI();

  // ===============================================
  // LÓGICA DEL CARRUSEL DE NOVEDADES
  // ===============================================

  // Lista de imágenes para el carrusel de Novedades
  const imagenesNovedades = [
    'imagenes/pagina1/2.jpg',
    'imagenes/pagina1/3.jpg',
    'imagenes/pagina1/4.jpg',
  ];

  let indiceActual = 0;
  let autoSlideInterval;
  const slideDuration = 5000; // 5000 milisegundos = 5 segundos

  // Selectores
  const imgElemento = document.querySelector('.novedad-carrusel-img');
  const btnAnterior = document.querySelector('.prev-arrow');
  const btnSiguiente = document.querySelector('.next-arrow');
  const carouselContainer = document.querySelector('.novedad-carrusel-cont');

  function actualizarCarrusel(direccion) {
    if (!imgElemento) return;

    // 1. ANIMACIÓN DE SALIDA
    gsap.to(imgElemento, {
      duration: 0.3,
      opacity: 0,
      x: direccion === 'next' ? -50 : 50,
      ease: 'power2.in',
      onComplete: () => {
        // 2. CAMBIO DE IMAGEN
        if (direccion === 'next') {
          indiceActual = (indiceActual + 1) % imagenesNovedades.length;
        } else {
          indiceActual =
            (indiceActual - 1 + imagenesNovedades.length) %
            imagenesNovedades.length;
        }

        imgElemento.src = imagenesNovedades[indiceActual];

        // 3. ANIMACIÓN DE ENTRADA
        gsap.fromTo(
          imgElemento,
          {
            opacity: 0,
            x: direccion === 'next' ? 50 : -50,
          },
          {
            duration: 0.4,
            opacity: 1,
            x: 0,
            ease: 'power2.out',
          },
        );
      },
    });
  }

  function startAutoplay() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);

    autoSlideInterval = setInterval(() => {
      actualizarCarrusel('next');
    }, slideDuration);
  }

  function stopAutoplay() {
    clearInterval(autoSlideInterval);
  }

  if (btnSiguiente && btnAnterior && imgElemento && carouselContainer) {
    btnSiguiente.addEventListener('click', () => {
      stopAutoplay();
      actualizarCarrusel('next');
      startAutoplay();
    });

    btnAnterior.addEventListener('click', () => {
      stopAutoplay();
      actualizarCarrusel('prev');
      startAutoplay();
    });

    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    startAutoplay();

    gsap.set(imgElemento, { opacity: 1 });
  }

  // ===============================================
  // ANIMACIÓN: LO MÁS VENDIDO (INTERACCIÓN CON EL RATÓN)
  // ===============================================

  const productosAnimacion = gsap.utils.toArray('#mas-vendido .producto-card');
  const contenedorDorado = document.querySelector('.vendido-contenedor-dorado');

  const filaSuperior = productosAnimacion.slice(0, 2);
  const filaInferior = productosAnimacion.slice(2);

  if (contenedorDorado && productosAnimacion.length === 4) {
    gsap.set(productosAnimacion, { y: 0, opacity: 1, x: 0 });

    contenedorDorado.addEventListener('mouseenter', () => {
      gsap.to(filaSuperior, {
        y: -15,
        x: -15,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.05,
      });

      gsap.to(filaInferior, {
        y: 15,
        x: 15,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.05,
      });
    });

    contenedorDorado.addEventListener('mouseleave', () => {
      gsap.to(productosAnimacion, {
        y: 0,
        x: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  }
});
