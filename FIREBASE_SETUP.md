# 🔥 Guía de Configuración Firebase para Boza

## 📋 Pasos para Configurar Firebase

### 1️⃣ Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en **"Agregar proyecto"**
3. Nombra tu proyecto: `boza-hackathon` (o el nombre que prefieras)
4. Acepta los términos y crea el proyecto

### 2️⃣ Habilitar Autenticación

1. En el menú lateral, clic en **"Authentication"**
2. Clic en **"Comenzar"** (Get Started)
3. En la pestaña **"Sign-in method"**, habilita:
   - ✅ **Correo electrónico/contraseña** → Activar
4. Guarda cambios

### 3️⃣ Crear Base de Datos Firestore

1. En el menú lateral, clic en **"Firestore Database"**
2. Clic en **"Crear base de datos"**
3. Selecciona modo:
   - 🧪 **Prueba (Test mode)** para desarrollo
   - 🔒 **Producción** para deploy final
4. Elige ubicación: `us-central1` o la más cercana
5. Clic en **"Habilitar"**

### 4️⃣ Obtener Credenciales

1. En el panel principal, clic en el ícono de engranaje ⚙️ → **"Configuración del proyecto"**
2. Desplázate a **"Tus aplicaciones"**
3. Clic en el ícono **`</>`** (Web)
4. Registra tu app: nombre `Boza Web`
5. **Copia** el objeto `firebaseConfig` que aparece

### 5️⃣ Configurar tu Proyecto Local

1. Abre el archivo `firebase-config.js`
2. Reemplaza los valores de prueba con tus credenciales reales:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234567890"
};
```

### 6️⃣ Crear Usuario de Prueba

En Firebase Console → **Authentication** → **Users**:
1. Clic en **"Agregar usuario"**
2. Email: `admin@boza.com`
3. Contraseña: `Boza2025!`
4. Guardar

### 7️⃣ Estructura de Datos en Firestore

Crea estas colecciones manualmente o déjalas que se creen automáticamente:

#### Colección: `usuarios`
```
usuarios/
  {uid}/
    email: string
    nombre: string (opcional)
    rol: string (admin, usuario)
    ultimoAcceso: timestamp
```

#### Colección: `statistics`
```
statistics/
  current/
    activeUsers: number
    collectionsToday: number
    recycledKg: number
    co2SavedKg: number
    updatedAt: timestamp
```

#### Colección: `activities`
```
activities/
  {autoID}/
    type: string (collection, user, report, alert, success)
    description: string
    timestamp: timestamp
    userId: string (opcional)
```

### 8️⃣ Reglas de Seguridad (Firestore)

En **Firestore Database** → **Reglas**, pega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios autenticados pueden leer/escribir sus propios datos
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Solo usuarios autenticados pueden leer estadísticas
    match /statistics/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Ajustar según roles
    }
    
    // Actividades: lectura para autenticados
    match /activities/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

### 9️⃣ Probar la Aplicación

1. Abre `index.html` en un navegador (usa Live Server o similar)
2. Inicia sesión con: `admin@boza.com` / `Boza2025!`
3. Deberías ser redirigido al Dashboard

## 🚀 Comandos Git para Subir Cambios

```powershell
# Ver estado
git status

# Agregar archivos (excluyendo .env si existe)
git add -A

# Commit
git commit -m "Integrar Firebase: autenticación y Firestore"

# Push
git push origin main
```

## 🔒 Seguridad

- ✅ **NO subas** credenciales reales en `firebase-config.js` a repositorios públicos
- ✅ Usa variables de entorno para producción
- ✅ Configura reglas de seguridad en Firestore
- ✅ Habilita App Check para producción

## 📚 Recursos

- [Documentación Firebase](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firebase Auth](https://firebase.google.com/docs/auth/web/start)

## 🐛 Troubleshooting

### Error: "Firebase not defined"
- Verifica que los scripts de Firebase estén antes de `firebase-config.js`

### Error: "Permission denied"
- Revisa las reglas de Firestore
- Verifica que el usuario esté autenticado

### No redirige al Dashboard
- Abre la consola del navegador (F12)
- Revisa errores de JavaScript
- Verifica la ruta en `script.js` línea de redirección
