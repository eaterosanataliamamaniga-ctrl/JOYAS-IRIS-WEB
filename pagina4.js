// ========================================================
// PÁGINA 4 - CONTACTO
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  const formContacto = document.getElementById('form-contacto');
  const mensajeRespuesta = document.getElementById('mensaje-respuesta');

  if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Obtener valores del formulario
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const asunto = document.getElementById('asunto').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      // Validaciones básicas
      if (!nombre || !email || !asunto || !mensaje) {
        mostrarMensaje(
          'Por favor, complete todos los campos obligatorios.',
          'error',
        );
        return;
      }

      // Crear mensaje para WhatsApp
      let mensajeWhatsApp = `*NUEVO MENSAJE DE CONTACTO*\n\n`;
      mensajeWhatsApp += `👤 *Nombre:* ${nombre}\n`;
      mensajeWhatsApp += `📧 *Email:* ${email}\n`;

      if (telefono) {
        mensajeWhatsApp += `📞 *Teléfono:* ${telefono}\n`;
      }

      mensajeWhatsApp += `📝 *Asunto:* ${asunto}\n\n`;
      mensajeWhatsApp += `💬 *Mensaje:*\n${mensaje}`;

      // Número de WhatsApp del negocio
      const numeroWhatsApp = '59171277520';
      const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        mensajeWhatsApp,
      )}`;

      // Mostrar mensaje de éxito
      mostrarMensaje('Redirigiendo a WhatsApp...', 'exito');

      // Abrir WhatsApp en nueva pestaña
      setTimeout(() => {
        window.open(enlaceWhatsApp, '_blank');
        formContacto.reset();

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          mensajeRespuesta.style.display = 'none';
        }, 3000);
      }, 500);
    });
  }

  function mostrarMensaje(texto, tipo) {
    mensajeRespuesta.textContent = texto;
    mensajeRespuesta.className = `mensaje-respuesta ${tipo}`;
  }
});
