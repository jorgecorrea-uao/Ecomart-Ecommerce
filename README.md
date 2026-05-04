# Ecomart Ecommerce

Aplicación de e-commerce full stack construida con **React + Vite** en el frontend y **Node.js + Express + Sequelize** en el backend.

---

## Requisitos previos

- Node.js 18+
- MySQL (o PostgreSQL)
- Un gestor de base de datos (MySQL Workbench, TablePlus, DBeaver, etc.)

---

## Estructura del proyecto

```
Ecomart-Ecommerce/
├── Backend/
└── Frontend/
```

---

## 1. Configurar el Backend

### 1.1 Instalar dependencias

```bash
cd Backend
npm install
```

### 1.2 Crear la base de datos

Abre tu gestor de base de datos y ejecuta:

```sql
CREATE DATABASE ecomart;
```

### 1.3 Configurar variables de entorno

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
```

Abre `.env` y completa los valores:

```env
PORT=3000
JWT_SECRET=un_secreto_largo_y_seguro_aqui

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecomart
DB_USER=root
DB_PASSWORD=tu_password_de_mysql

FRONTEND_URL=http://localhost:5173

# Credenciales del primer administrador
ADMIN_NOMBRE=Jorge
ADMIN_EMAIL=jorge@ecomart.com
ADMIN_PASSWORD=TuPasswordSeguro123
```

### 1.4 Iniciar el servidor

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`. Las tablas se crean automáticamente al iniciar.

---

## 2. Configurar el Frontend

### 2.1 Instalar dependencias

```bash
cd Frontend
npm install
```

### 2.2 Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` ya tiene el valor correcto por defecto:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2.3 Iniciar el frontend

```bash
npm run dev
```

El frontend corre en `http://localhost:5173`.

---

## 3. Crear el administrador

Con el backend corriendo, ejecuta este comando **una sola vez**:

```bash
cd Backend
npm run seed:admin
```

Esto crea un usuario administrador con las credenciales que pusiste en `.env` (`ADMIN_EMAIL` y `ADMIN_PASSWORD`).

Deberías ver en la consola:
```
Admin creado exitosamente: jorge@ecomart.com
```

---

## 4. Agregar productos

### 4.1 Iniciar sesión como admin

1. Abre `http://localhost:5173`
2. Ve a **Iniciar sesión**
3. Ingresa el email y password del admin que configuraste en `.env`

### 4.2 Ir al panel de administración

Una vez logueado, aparece el link **Admin** en la barra de navegación. Haz clic en él o ve directamente a:

```
http://localhost:5173/admin/products
```

### 4.3 Crear un producto

1. Haz clic en **+ Nuevo producto**
2. Completa el formulario:
   - **Nombre** *(obligatorio)* — ej: `Camiseta Orgánica`
   - **Descripción** *(opcional)* — ej: `Hecha con algodón 100% orgánico`
   - **Precio** *(obligatorio)* — ej: `29.99`
   - **Stock** — cantidad disponible, ej: `50`
   - **Categoría** *(opcional)* — ej: `Ropa`
3. Haz clic en **Guardar**

El producto aparece inmediatamente en la tabla y en la tienda pública (`/products`).

### 4.4 Editar o eliminar un producto

Desde el panel admin (`/admin/products`):
- **Editar** — modifica cualquier campo del producto
- **Eliminar** — elimina el producto con confirmación

---

## 5. Flujo de compra (usuario)

1. Regístrate o inicia sesión como usuario normal
2. Ve a **Productos** y elige un producto
3. En el detalle del producto haz clic en **Agregar al carrito**
4. Ve al carrito con el ícono 🛍️ en la navbar
5. Ajusta las cantidades y haz clic en **Finalizar compra**

---

## Scripts disponibles

### Backend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo |
| `npm start` | Inicia el servidor en producción |
| `npm test` | Ejecuta los tests |
| `npm run seed:admin` | Crea el primer usuario administrador |

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el frontend en modo desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualiza el build de producción |

---

## Endpoints de la API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Registrar usuario |
| POST | `/api/auth/login` | — | Iniciar sesión |
| POST | `/api/auth/logout` | — | Cerrar sesión |
| GET | `/api/products` | — | Listar productos |
| GET | `/api/products/:id` | — | Detalle de producto |
| POST | `/api/products` | Admin | Crear producto |
| PUT | `/api/products/:id` | Admin | Editar producto |
| DELETE | `/api/products/:id` | Admin | Eliminar producto |
| GET | `/api/cart` | Usuario | Ver carrito activo |
| POST | `/api/cart/items` | Usuario | Agregar item al carrito |
| PUT | `/api/cart/items/:id` | Usuario | Actualizar cantidad |
| DELETE | `/api/cart/items/:id` | Usuario | Eliminar item |
| POST | `/api/cart/checkout` | Usuario | Finalizar compra |
| GET | `/api/cart/history` | Usuario | Historial de compras |
