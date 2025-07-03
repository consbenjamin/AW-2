# 🛒 Ecommerce Tech Store.

Proyecto desarrollado como entrega para AW2.

---

## 🚀 Stack Tecnológico

- **Frontend**: Next.js (Pages Router) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB (con Mongoose)
- **Autenticación**: JWT (JSON Web Token)
- **Control de Acceso**: Middleware `verificarToken` y `esAdmin`
- **Otros**:
  - Dotenv para configuración
  - bcryptjs para encriptar contraseñas


## 🛠️ Proceso de desarrollo y roadmap

### 1. Inicialización del proyecto

- Se creó el backend con Express y Mongoose.
- Se configuró conexión a MongoDB.
- Se definieron modelos: `Usuario`, `Producto`, `Venta`.

### 2. Autenticación y seguridad

- Se implementó JWT para autenticación segura.
- Se crearon middlewares:
  - `verificarToken`: protege rutas privadas.
  - `esAdmin`: restringe acceso a rutas de administración.

### 3. API REST

- Rutas CRUD para productos (`GET`, `POST`, `PUT`, `DELETE`)
- Rutas de autenticación y registro de usuarios
- Rutas para obtener y editar perfil del usuario logueado

