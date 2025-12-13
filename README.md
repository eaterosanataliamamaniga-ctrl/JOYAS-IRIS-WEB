# JOYAS Y ACCESORIOS IRIS - Sistema de Gestión

Sistema web completo para gestión de productos de joyería con integración Firebase, carrito de compras y envío por WhatsApp.

## 🚀 CARACTERÍSTICAS

✅ **Panel de Administración** (`admin.html`)

- Agregar, editar y eliminar productos
- Subida de imágenes a **Cloudinary** (gratuito, sin tarjeta)
- Organización por categorías

✅ **Catálogo Dinámico** (`pagina2.html`)

- Carga de productos desde Firestore
- Filtrado por categorías
- Modal con descripción detallada

✅ **Carrito de Compras**

- Funcionalidad completa con localStorage
- Cálculo automático de totales
- Persistencia de datos

✅ **Envío por WhatsApp**

- Formato profesional de pedidos
- Incluye productos, cantidades y precios
- Integración directa

✅ **Página de Contacto** (`pagina4.html`)

- Formulario de contacto
- Mapa de ubicación
- Información corporativa

---

## 📋 CONFIGURACIÓN INICIAL

### 1️⃣ Configurar Firebase

#### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombra tu proyecto: `joyas-iris` (o el nombre que prefieras)
4. Desactiva Google Analytics (opcional)
5. Click en "Crear proyecto"

#### Paso 2: Habilitar Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Click en "Crear base de datos"
3. Selecciona **"Producción"** o **"Prueba"** según tu necesidad
4. Elige la ubicación: `southamerica-east1` (São Paulo)
5. Click en "Habilitar"

#### Paso 3: Configurar Reglas de Firestore

En la pestaña "Reglas", reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{producto} {
      allow read: if true;  // Permitir lectura a todos
      allow write: if true; // Permitir escritura a todos (cambiar en producción)
    }
  }
}
```

**⚠️ IMPORTANTE:** En producción, restringe las reglas de escritura.

#### Paso 4: Habilitar Firebase Storage

1. En el menú lateral, ve a **Storage**
2. Click en "Comenzar"
3. Acepta las reglas por defecto
4. Click en "Listo"

#### Paso 5: Configurar Reglas de Storage

En la pestaña "Rules", reemplaza con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /productos/{categoria}/{filename} {
      allow read: if true;
      allow write: if true; // Cambiar en producción
    }
  }
}
```

#### Paso 6: Obtener Credenciales

1. En el menú lateral, ve a **Configuración del proyecto** (⚙️)
2. Scroll hasta "Tus apps"
3. Click en el ícono **Web** (`</>`)
4. Registra tu app con un nombre (ej: "Joyas IRIS Web")
5. **NO** marques "Configura también Firebase Hosting"
6. Click en "Registrar app"
7. **COPIA** el código de configuración que aparece

#### Paso 7: Configurar credenciales en el proyecto

Abre el archivo `firebase-config.js` y reemplaza con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: 'TU_API_KEY_AQUI',
  authDomain: 'TU_AUTH_DOMAIN_AQUI',
  projectId: 'TU_PROJECT_ID_AQUI',
  storageBucket: 'TU_STORAGE_BUCKET_AQUI',
  messagingSenderId: 'TU_MESSAGING_SENDER_ID_AQUI',
  appId: 'TU_APP_ID_AQUI',
};
```

---

## 📂 ESTRUCTURA DEL PROYECTO

```
JOYAS Y ACCESORIOS IRIS/
│
├── index.html              # Página principal
├── pagina2.html            # Catálogo de productos
├── pagina3.html            # Tienda/Servicios
├── pagina4.html            # Contacto
├── admin.html              # Panel de administración
│
├── styles.css              # Estilos globales
├── pagina2.css             # Estilos del catálogo
├── pagina3.css             # Estilos de tienda
├── pagina4.css             # Estilos de contacto
├── admin.css               # Estilos del panel admin
│
├── main.js                 # Lógica del carrito y general
├── pagina2.js              # Lógica del catálogo
├── pagina4.js              # Lógica del formulario
├── admin.js                # Lógica del panel admin
├── firebase-config.js      # Configuración de Firebase
│
└── imagenes/
    ├── logo.jpg
    ├── pagina1/
    ├── pagina2/
    ├── pagina3/
    └── productos/          # Carpetas organizadas por categoría
        ├── vestido/
        ├── oficina/
        ├── varones/
        └── ninos/
```

---

## 🛠️ USO DEL SISTEMA

### Panel de Administración (admin.html)

1. Abre `admin.html` en tu navegador
2. Completa el formulario:
   - Nombre del producto
   - Descripción
   - Precio (en Soles)
   - Categoría
   - Stock disponible
   - Material (opcional)
   - Imagen del producto
3. Click en "GUARDAR PRODUCTO"
4. La imagen se sube automáticamente a Firebase Storage
5. El producto aparece en la lista

**Funciones:**

- ✏️ **Editar:** Modifica productos existentes
- 🗑️ **Eliminar:** Borra productos (confirmación requerida)
- 🔍 **Filtrar:** Por categoría

### Catálogo de Productos (pagina2.html)

- Los productos se cargan automáticamente desde Firebase
- Click en categorías para filtrar
- Click en "DESCRIPCIÓN DEL PRODUCTO" para ver detalles
- En el modal, click en "AGREGAR AL CARRITO"

### Carrito de Compras

- Click en el botón flotante 🛒 para abrir
- Los productos se guardan en localStorage
- Click en 🗑️ para eliminar productos
- Click en "RESERVAR POR WHATSAPP" para enviar pedido

### Página de Contacto (pagina4.html)

- Formulario de contacto que redirige a WhatsApp
- Mapa de ubicación interactivo
- Información de contacto y horarios

---

## 📱 CONFIGURAR WHATSAPP

En los siguientes archivos, reemplaza el número de WhatsApp:

### main.js (línea ~168)

```javascript
const numeroWhatsApp = '59171277520'; // TU NÚMERO AQUÍ
```

### pagina4.js (línea ~38)

```javascript
const numeroWhatsApp = '59171277520'; // TU NÚMERO AQUÍ
```

**Formato:** Código de país + número sin espacios ni símbolos

- Ejemplo Bolivia: `59171277520`
- Ejemplo Perú: `51987654321`

---

## 🎨 ESTRUCTURA DE DATOS EN FIRESTORE

### Colección: `productos`

```javascript
{
  nombre: "Aretes de Esmeralda",
  descripcion: "Hermosos aretes con piedras de esmeralda...",
  precio: 450.50,
  categoria: "vestido", // vestido | oficina | varones | ninos
  stock: 5,
  material: "Oro 18k",
  imagenUrl: "https://firebasestorage.googleapis.com/...",
  fechaCreacion: Timestamp,
  fechaActualizacion: Timestamp
}
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Los productos no se cargan

✅ Verifica que Firebase esté configurado correctamente
✅ Revisa la consola del navegador (F12) para errores
✅ Confirma que las reglas de Firestore permitan lectura

### Las imágenes no se suben

✅ Verifica las reglas de Storage
✅ Confirma que el tamaño no exceda 5MB
✅ Usa formatos: JPG, PNG, WEBP

### El carrito no guarda productos

✅ Verifica que localStorage esté habilitado
✅ No uses modo incógnito del navegador

### WhatsApp no abre

✅ Verifica el formato del número (sin espacios ni +)
✅ Asegúrate de tener WhatsApp instalado o WhatsApp Web activo

---

## 🌐 DESPLIEGUE

### Opción 1: Firebase Hosting (Recomendado)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar proyecto
firebase init hosting

# Desplegar
firebase deploy
```

### Opción 2: Servidor Web Local

1. Usa un servidor local como Live Server (VS Code)
2. O Python: `python -m http.server 8000`
3. Abre `http://localhost:8000`

---

## 📞 SOPORTE

Para dudas o problemas:

- 📧 Email: contacto@joyasiris.com
- 📱 WhatsApp: +591 71277520
- 📘 Facebook: [Joyas y Accesorios IRIS](https://www.facebook.com/share/1BUuaXq4yy/)

---

## 📝 NOTAS IMPORTANTES

1. **Seguridad:** Las reglas actuales permiten lectura/escritura a todos. En producción, implementa autenticación.

2. **Imágenes:** Se recomienda optimizar las imágenes antes de subirlas (max 500KB).

3. **Backup:** Firebase tiene backup automático, pero considera exportar tus datos periódicamente.

4. **Costos:** Firebase tiene plan gratuito generoso. Monitorea tu uso en la consola.

---

## ✨ CARACTERÍSTICAS FUTURAS

- [ ] Autenticación de administradores
- [ ] Sistema de valoraciones
- [ ] Búsqueda de productos
- [ ] Integración con pasarelas de pago
- [ ] Panel de estadísticas
- [ ] Notificaciones push

---

**Desarrollado con ❤️ para Joyas y Accesorios IRIS**
