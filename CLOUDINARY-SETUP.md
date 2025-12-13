# 📸 Configuración de Cloudinary (Alternativa Gratuita a Firebase Storage)

## ¿Por qué Cloudinary?

- ✅ **100% GRATIS** - Sin tarjeta de crédito
- ✅ **25 GB de almacenamiento**
- ✅ **25 GB de transferencia/mes**
- ✅ **Transformación de imágenes** (redimensionar, optimizar)
- ✅ **CDN global** (carga rápida en todo el mundo)
- ✅ **URLs públicas permanentes**

---

## 🚀 Paso 1: Crear Cuenta en Cloudinary

1. Ve a: **https://cloudinary.com/users/register_free**
2. Regístrate con tu email (o con Google)
3. Completa el formulario:
   - Nombre
   - Email
   - Contraseña
4. Click en **"Create Account"**
5. Verifica tu email (revisa tu bandeja de entrada)
6. Inicia sesión en Cloudinary

---

## ⚙️ Paso 2: Obtener tus Credenciales

Cuando inicies sesión, verás el **Dashboard**:

```
Cloud name: djxyz123abc  ← COPIA ESTO
API Key: 123456789012345
API Secret: xxxxxxxxxxxxx (no lo necesitas)
```

**IMPORTANTE:** Solo necesitas el **Cloud Name**

---

## 🔧 Paso 3: Crear Upload Preset

1. En el Dashboard, click en el ícono de **⚙️ Settings** (arriba a la derecha)
2. En el menú lateral, click en **"Upload"**
3. Scroll hacia abajo hasta **"Upload presets"**
4. Click en **"Add upload preset"**
5. Configura así:

   ```
   Upload preset name: joyas_iris
   Signing Mode: Unsigned ← MUY IMPORTANTE
   Folder: productos
   ```

6. Click en **"Save"**

---

## 📝 Paso 4: Configurar en tu Proyecto

Abre el archivo **`admin.js`** y busca estas líneas (están al principio):

```javascript
// CONFIGURACIÓN CLOUDINARY - Reemplaza con tus datos
const CLOUDINARY_CLOUD_NAME = 'TU_CLOUD_NAME'; // Ejemplo: 'djxyz123'
const CLOUDINARY_UPLOAD_PRESET = 'joyas_iris'; // El preset que creaste
```

**Reemplaza:**

- `'TU_CLOUD_NAME'` → Con tu Cloud Name (del Dashboard)
- `'joyas_iris'` → Ya está correcto (es el preset que creaste)

**Ejemplo:**

```javascript
const CLOUDINARY_CLOUD_NAME = 'djxyz123abc'; // ← Tu Cloud Name
const CLOUDINARY_UPLOAD_PRESET = 'joyas_iris';
```

---

## ✅ Paso 5: Verificar que Funciona

1. Abre **`admin.html`** en tu navegador
2. Agrega un producto de prueba con una imagen
3. Si la imagen se sube correctamente, ¡funcionó! 🎉

En la consola deberías ver:

```
✅ Firebase inicializado correctamente
📸 Imágenes: Cloudinary (sin Storage)
```

---

## 📂 Estructura de Imágenes en Cloudinary

Las imágenes se guardarán así:

```
productos/
├── vestido/
│   ├── imagen1.jpg
│   ├── imagen2.jpg
│   └── ...
├── oficina/
│   └── ...
├── varones/
│   └── ...
└── ninos/
    └── ...
```

Puedes ver todas tus imágenes en:
**Cloudinary Dashboard → Media Library**

---

## 🎨 Ventajas de Cloudinary

### Optimización Automática

Las URLs se pueden modificar para:

- Redimensionar: `/w_500,h_500/`
- Calidad: `/q_auto/`
- Formato: `/f_auto/`

**Ejemplo:**

```
Original:
https://res.cloudinary.com/djxyz123/image/upload/productos/vestido/aretes.jpg

Optimizada (500x500px):
https://res.cloudinary.com/djxyz123/image/upload/w_500,h_500,q_auto/productos/vestido/aretes.jpg
```

---

## 🆘 Solución de Problemas

### Error: "Upload preset must be whitelisted"

→ Asegúrate de que el preset sea **"Unsigned"**

### Error: "Invalid cloud_name"

→ Verifica que copiaste bien el Cloud Name en `admin.js`

### Las imágenes no se ven

→ Revisa que la URL en Firestore esté completa y comience con `https://`

---

## 💰 Límites del Plan Gratuito

| Recurso          | Límite Gratuito |
| ---------------- | --------------- |
| Almacenamiento   | 25 GB           |
| Transformaciones | 25,000/mes      |
| Transferencia    | 25 GB/mes       |
| Imágenes         | Ilimitadas      |

Para un negocio de joyería, es **MÁS que suficiente**.

---

## 🔐 Seguridad

- Las imágenes son **públicas** (cualquiera con la URL puede verlas)
- Esto es normal para tiendas online
- Firebase Firestore guarda las URLs de las imágenes
- Solo tú puedes agregar/editar productos (desde `admin.html`)

---

**¡Listo! Ahora tienes almacenamiento de imágenes GRATIS sin necesidad de tarjeta de crédito.** 🎉
