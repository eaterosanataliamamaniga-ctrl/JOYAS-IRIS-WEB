# ⚡ GUÍA RÁPIDA DE INICIO

## 🎯 Pasos para empezar en 5 minutos

### 1. Configurar Firebase (3 min)

1. Ve a https://console.firebase.google.com/
2. Crea un proyecto nuevo
3. Habilita **Firestore Database** y **Storage**
4. Copia las credenciales de tu app web
5. Pégalas en `firebase-config.js`

### 2. Agregar tu primer producto (1 min)

1. Abre `admin.html` en el navegador
2. Llena el formulario:
   - Nombre: "Aretes de Plata"
   - Descripción: "Hermosos aretes de plata 925"
   - Precio: 150
   - Categoría: Joyería para mujeres de vestido
   - Stock: 10
   - Sube una imagen
3. Click en "GUARDAR PRODUCTO"

### 3. Ver tu catálogo (30 seg)

1. Abre `pagina2.html`
2. ¡Tu producto ya está visible!
3. Click en "DESCRIPCIÓN DEL PRODUCTO"
4. Click en "AGREGAR AL CARRITO"

### 4. Probar el carrito (30 seg)

1. Click en el ícono 🛒 flotante
2. Verifica que tu producto esté ahí
3. Click en "RESERVAR POR WHATSAPP"
4. ¡Se abre WhatsApp con el pedido formateado!

---

## 📝 Checklist de Configuración

- [ ] Crear proyecto en Firebase
- [ ] Habilitar Firestore
- [ ] Habilitar Storage
- [ ] Copiar credenciales a `firebase-config.js`
- [ ] Cambiar número de WhatsApp en `main.js`
- [ ] Cambiar número de WhatsApp en `pagina4.js`
- [ ] Agregar tu logo en `imagenes/logo.jpg`
- [ ] Actualizar mapa en `pagina4.html`
- [ ] Actualizar información de contacto

---

## 🔥 Estructura de Categorías en Firebase

Al crear productos, usa estos valores exactos para categoría:

- `vestido` → Joyería para mujeres de vestido
- `oficina` → Joyería para mujeres de oficina
- `varones` → Joyería para varones
- `ninos` → Joyería para niños y niñas

---

## 🎨 Archivos que debes personalizar

| Archivo                 | Qué cambiar                          |
| ----------------------- | ------------------------------------ |
| `firebase-config.js`    | Credenciales de Firebase             |
| `main.js` (línea 168)   | Número de WhatsApp                   |
| `pagina4.js` (línea 38) | Número de WhatsApp                   |
| `pagina4.html`          | Dirección, teléfono, email, horarios |
| `imagenes/logo.jpg`     | Tu logo                              |

---

## 🚀 Comandos útiles

### Abrir con Live Server (VS Code)

```
Click derecho en index.html → Open with Live Server
```

### Servidor Python

```bash
python -m http.server 8000
```

### Ver en el navegador

```
http://localhost:8000
```

---

## ⚠️ Errores Comunes

### "Firebase is not defined"

➡️ Verifica que las rutas a los scripts de Firebase sean correctas

### "Permission denied"

➡️ Revisa las reglas de Firestore y Storage en la consola de Firebase

### "No se cargan las imágenes"

➡️ Asegúrate de que Storage esté habilitado y las reglas permitan lectura

### "WhatsApp no abre"

➡️ Verifica el formato del número (sin + ni espacios)

---

## 📚 Recursos

- [Documentación Firebase](https://firebase.google.com/docs)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [Firebase Storage](https://firebase.google.com/docs/storage)

---

¡Listo! Tu tienda está operativa. 🎉
