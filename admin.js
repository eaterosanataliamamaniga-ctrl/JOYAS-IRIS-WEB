// ========================================================
// ADMINISTRACIÓN DE PRODUCTOS - FIREBASE
// ========================================================

let productoEditandoId = null;
let imagenSeleccionada = null;

// Referencias del DOM
const formProducto = document.getElementById('form-producto');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const listaProductos = document.getElementById('lista-productos');
const filtroCategoria = document.getElementById('filtro-categoria');
const inputImagen = document.getElementById('imagen');
const previewImagen = document.getElementById('preview-imagen');
const mensajeFormulario = document.getElementById('mensaje-formulario');

// ========================================================
// CARGAR PRODUCTOS DESDE FIRESTORE
// ========================================================

function cargarProductos(categoriaFiltro = '') {
  listaProductos.innerHTML = '<p class="cargando">Cargando productos...</p>';

  let query = db.collection('productos');

  if (categoriaFiltro) {
    query = query.where('categoria', '==', categoriaFiltro);
  }

  query
    .get()
    .then((snapshot) => {
      listaProductos.innerHTML = '';

      if (snapshot.empty) {
        listaProductos.innerHTML =
          '<p class="cargando">No hay productos registrados.</p>';
        return;
      }

      snapshot.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        renderizarProducto(producto);
      });
    })
    .catch((error) => {
      console.error('Error al cargar productos:', error);
      listaProductos.innerHTML =
        '<p class="cargando">Error al cargar productos.</p>';
    });
}

// ========================================================
// RENDERIZAR PRODUCTO EN LA LISTA
// ========================================================

function renderizarProducto(producto) {
  const div = document.createElement('div');
  div.className = 'producto-item';
  div.dataset.id = producto.id;

  const categoriaTexto = {
    vestido: 'Mujeres de vestido',
    oficina: 'Mujeres de pollera',
    varones: 'Varones',
    ninos: 'Niños y niñas',
  };

  div.innerHTML = `
        <img src="${producto.imagenUrl || 'imagenes/placeholder.jpg'}" alt="${
    producto.nombre
  }">
        <div class="producto-info">
            <h4>${producto.nombre}</h4>
            <p class="precio">Bs/ ${parseFloat(producto.precio).toFixed(2)}</p>
            <p>${producto.descripcion.substring(0, 80)}${
    producto.descripcion.length > 80 ? '...' : ''
  }</p>
            <span class="categoria-badge">${
              categoriaTexto[producto.categoria] || producto.categoria
            }</span>
            <p><strong>Stock:</strong> ${producto.stock} unidades</p>
            ${
              producto.material
                ? `<p><strong>Material:</strong> ${producto.material}</p>`
                : ''
            }
        </div>
        <div class="producto-acciones">
            <button class="btn-editar" onclick="editarProducto('${
              producto.id
            }')"><i class="fas fa-edit"></i> Editar</button>
            <button class="btn-eliminar" onclick="eliminarProducto('${
              producto.id
            }', '${
    producto.nombre
  }')"><i class="fas fa-trash-alt"></i> Eliminar</button>
        </div>
    `;

  listaProductos.appendChild(div);
}

// ========================================================
// PREVIEW DE IMAGEN
// ========================================================

inputImagen.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (file) {
    imagenSeleccionada = file;
    const reader = new FileReader();

    reader.onload = (event) => {
      previewImagen.classList.remove('vacio');
      previewImagen.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
    };

    reader.readAsDataURL(file);
  } else {
    previewImagen.classList.add('vacio');
    previewImagen.innerHTML = '';
    imagenSeleccionada = null;
  }
});

// ========================================================
// SUBIR IMAGEN A CLOUDINARY (Alternativa Gratuita)
// ========================================================

// CONFIGURACIÓN CLOUDINARY - Reemplaza con tus datos
const CLOUDINARY_CLOUD_NAME = 'ddrg10zgh'; // Ejemplo: 'djxyz123'
const CLOUDINARY_UPLOAD_PRESET = 'joyas_iris'; // El preset que creaste

async function subirImagen(file, categoria) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `productos/${categoria}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error('Error al subir imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url; // URL pública de la imagen
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
}

// ========================================================
// GUARDAR PRODUCTO
// ========================================================

formProducto.addEventListener('submit', async (e) => {
  e.preventDefault();

  btnGuardar.disabled = true;
  btnGuardar.textContent = '⏳ GUARDANDO...';

  try {
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const categoria = document.getElementById('categoria').value;
    const stock = parseInt(document.getElementById('stock').value);
    const material = document.getElementById('material').value.trim();
    const destacado = document.getElementById('destacado').checked;

    let imagenUrl = null;

    // Si hay una imagen nueva, subirla
    if (imagenSeleccionada) {
      imagenUrl = await subirImagen(imagenSeleccionada, categoria);
    }

    const productoData = {
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
      material,
      destacado: destacado || false,
      fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Solo actualizar la URL de la imagen si hay una nueva
    if (imagenUrl) {
      productoData.imagenUrl = imagenUrl;
    }

    if (productoEditandoId) {
      // EDITAR producto existente
      await db
        .collection('productos')
        .doc(productoEditandoId)
        .update(productoData);
      mostrarMensaje('Producto actualizado correctamente', 'exito');
    } else {
      // CREAR nuevo producto
      productoData.fechaCreacion =
        firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('productos').add(productoData);
      mostrarMensaje('Producto agregado correctamente', 'exito');
    }

    limpiarFormulario();
    cargarProductos(filtroCategoria.value);
  } catch (error) {
    console.error('Error al guardar producto:', error);
    mostrarMensaje('Error al guardar el producto: ' + error.message, 'error');
  } finally {
    btnGuardar.disabled = false;
    btnGuardar.textContent = 'GUARDAR PRODUCTO';
  }
});

// ========================================================
// EDITAR PRODUCTO
// ========================================================

window.editarProducto = async (id) => {
  try {
    const doc = await db.collection('productos').doc(id).get();

    if (!doc.exists) {
      alert('Producto no encontrado');
      return;
    }

    const producto = doc.data();
    productoEditandoId = id;

    document.getElementById('producto-id').value = id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('categoria').value = producto.categoria;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('material').value = producto.material || '';
    document.getElementById('destacado').checked = producto.destacado || false;

    // Mostrar imagen actual
    if (producto.imagenUrl) {
      previewImagen.classList.remove('vacio');
      previewImagen.innerHTML = `<img src="${producto.imagenUrl}" alt="Imagen actual">`;
    }

    btnGuardar.textContent = 'ACTUALIZAR PRODUCTO';

    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error al cargar producto:', error);
    alert('Error al cargar el producto');
  }
};

// ========================================================
// ELIMINAR PRODUCTO
// ========================================================

window.eliminarProducto = async (id, nombre) => {
  if (!confirm(`¿Está seguro de eliminar el producto "${nombre}"?`)) {
    return;
  }

  try {
    await db.collection('productos').doc(id).delete();
    mostrarMensaje('Producto eliminado correctamente', 'exito');
    cargarProductos(filtroCategoria.value);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    mostrarMensaje('Error al eliminar el producto', 'error');
  }
};

// ========================================================
// CANCELAR EDICIÓN
// ========================================================

btnCancelar.addEventListener('click', () => {
  limpiarFormulario();
});

// ========================================================
// LIMPIAR FORMULARIO
// ========================================================

function limpiarFormulario() {
  formProducto.reset();
  productoEditandoId = null;
  imagenSeleccionada = null;
  previewImagen.classList.add('vacio');
  previewImagen.innerHTML = '';
  btnGuardar.textContent = 'GUARDAR PRODUCTO';
  mensajeFormulario.className = 'mensaje-formulario';
  mensajeFormulario.style.display = 'none';
}

// ========================================================
// MOSTRAR MENSAJE
// ========================================================

function mostrarMensaje(texto, tipo) {
  mensajeFormulario.textContent = texto;
  mensajeFormulario.className = `mensaje-formulario ${tipo}`;

  setTimeout(() => {
    mensajeFormulario.style.display = 'none';
  }, 5000);
}

// ========================================================
// FILTRO POR CATEGORÍA
// ========================================================

filtroCategoria.addEventListener('change', (e) => {
  cargarProductos(e.target.value);
});

// ========================================================
// INICIALIZAR
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  previewImagen.classList.add('vacio');
  cargarProductos();
});
