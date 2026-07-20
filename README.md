# TecniHogar

Plataforma web full-stack para contratar **técnicos del hogar verificados** (gasfitería, electricidad y mantenimiento) en Lima, Perú.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite, React Router v6, Tailwind CSS v3, Axios, Zustand, TanStack Query v5 |
| Backend | Java 17 + Spring Boot 3.2, Spring Security 6 + JWT (jjwt 0.12.x), Spring Data JPA, Bean Validation, SpringDoc OpenAPI |
| Base de datos | PostgreSQL 15 + Flyway |
| Imágenes | Cloudinary (SDK Java) |
| DevOps | Docker + Docker Compose |

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose)
- Opcional para desarrollo sin Docker: Java 17, Node 20, Maven 3.9

## Setup local paso a paso

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd tecnihogar
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita `.env` y completa tus credenciales de **Cloudinary** (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
   Sin ellas la app arranca igual, pero la **subida de imágenes** fallará (las imágenes del seed usan ui-avatars/picsum y no dependen de Cloudinary).

3. **Levantar todo con Docker Compose**
   ```bash
   docker compose up --build
   ```
   Esto arranca 3 contenedores: PostgreSQL, backend (Spring Boot) y frontend (Vite). Flyway ejecuta las migraciones V1–V10 automáticamente al iniciar el backend.

4. **Acceder a la aplicación**
   - Frontend: <http://localhost:5174>
   - API (Swagger UI): <http://localhost:8081/api/swagger-ui>
   - API base: <http://localhost:8081/api>

> **Puertos personalizados del host** (para evitar conflictos con otros proyectos Docker): PostgreSQL `5441`, backend `8081`, frontend `5174`. Dentro de la red de Docker los contenedores siguen usando sus puertos internos estándar (5432 / 8080 / 5173).

## Estructura del proyecto

```
tecnihogar/
├── backend/          Spring Boot 3 + Java 17 (API REST, JWT, Flyway, Cloudinary)
│   └── src/main/java/com/tecnihogar/
│       ├── config/       SecurityConfig, CloudinaryConfig, OpenApiConfig
│       ├── controller/   Auth, Technician, ServiceRequest, Message, Review, Notification, Favorite, Report
│       ├── service/      Lógica de negocio
│       ├── repository/   Spring Data JPA
│       ├── model/        Entidades JPA + enums
│       ├── dto/          Records de request/response
│       ├── security/     JwtUtil, JwtFilter, UserDetailsServiceImpl
│       └── exception/    GlobalExceptionHandler
│   └── src/main/resources/db/migration/  V1..V12 (Flyway)
├── frontend/         React 18 + Vite + Tailwind
│   └── src/
│       ├── components/  layout, ui, forms
│       ├── pages/       Home, Search, TechnicianProfile, ServiceRequest, RequestStatus, dashboards, Auth
│       ├── services/    Axios + servicios por dominio
│       ├── store/       Zustand (auth)
│       ├── hooks/       useAuth, useTechnicians
│       └── router/      Rutas con ProtectedRoute por rol
├── docker-compose.yml        Entorno local (3 servicios)
├── docker-compose.prod.yml   Solo backend (producción)
└── .env.example
```

## Endpoints de la API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Público | Registro (`{nombre, email, password, rol}`) |
| POST | `/api/auth/login` | Público | Login → `{token, rol, nombre, id}` |
| GET | `/api/technicians` | Público | Listado con filtros (`especialidad, distrito, minRating, verificado, disponible`) |
| GET | `/api/technicians/featured` | Público | Top 3 por rating |
| GET | `/api/technicians/{id}` | Público | Perfil con zonas, trabajos y reseñas |
| GET | `/api/technicians/me` | TÉCNICO | Perfil propio |
| PUT | `/api/technicians/me` | TÉCNICO | Actualizar perfil |
| PATCH | `/api/technicians/me/availability` | TÉCNICO | `{disponible}` |
| POST | `/api/technicians/me/photo` | TÉCNICO | Multipart → Cloudinary |
| POST | `/api/technicians/me/works` | TÉCNICO | Multipart → nuevo trabajo |
| DELETE | `/api/technicians/me/works/{id}` | TÉCNICO | Eliminar trabajo |
| POST | `/api/requests` | CLIENTE | Crear solicitud |
| GET | `/api/requests/my` | CLIENTE | Mis solicitudes |
| GET | `/api/requests/incoming` | TÉCNICO | Solicitudes entrantes |
| GET | `/api/requests/stats` | Auth | Estadísticas del panel (adapta según rol) |
| GET | `/api/requests/{id}` | Auth | Detalle (solo partes involucradas) |
| PATCH | `/api/requests/{id}/status` | TÉCNICO | `{estado}` |
| GET | `/api/requests/{id}/messages` | Auth | Mensajes del chat (solo partes involucradas) |
| POST | `/api/requests/{id}/messages` | Auth | Enviar mensaje (`{contenido}`) |
| POST | `/api/reviews` | CLIENTE | `{requestId, estrellas, comentario}` |
| GET | `/api/reviews/technician/{id}` | Público | Reseñas de un técnico |
| GET | `/api/notifications/my` | Auth | Mis notificaciones |
| PATCH | `/api/notifications/read-all` | Auth | Marcar todas como leídas |
| POST | `/api/favorites/{technicianId}` | CLIENTE | Agregar favorito |
| DELETE | `/api/favorites/{technicianId}` | CLIENTE | Quitar favorito |
| GET | `/api/favorites/my` | CLIENTE | Mis favoritos |
| POST | `/api/reports` | CLIENTE | `{requestId, tipoIncidente, descripcion}` |

## Documentación de la API (Swagger / OpenAPI)

La API se documenta automáticamente con **SpringDoc OpenAPI 3**. Con el backend corriendo:

- **Swagger UI**: <http://localhost:8081/api/swagger-ui>
- **Especificación OpenAPI (JSON)**: <http://localhost:8081/api/docs>

Los endpoints están agrupados por dominio mediante `@Tag`, y cada operación tiene una descripción (`@Operation`):

| Tag | Descripción |
|-----|-------------|
| Autenticación | Registro, inicio de sesión y usuario actual |
| Técnicos | Búsqueda, perfil público y gestión del perfil propio |
| Solicitudes | Solicitudes de servicio, estado y estadísticas del panel |
| Mensajes | Chat entre el cliente y el técnico dentro de una solicitud |
| Reseñas | Calificaciones y comentarios de los servicios |
| Notificaciones | Notificaciones del usuario autenticado |
| Favoritos | Técnicos favoritos del cliente |
| Reportes | Reportes de incidencias sobre un servicio |

### Probar endpoints protegidos

1. Ejecuta `POST /api/auth/login` con un usuario del seed y copia el `token` de la respuesta.
2. Pulsa el botón **Authorize** 🔒 (arriba a la derecha) y pega el token.
3. El esquema **Bearer JWT** ya está configurado, así que todas las llamadas siguientes irán autenticadas.

## Credenciales de prueba (seed)

Todos los usuarios seed tienen la contraseña **`tecni1234`**.

| Rol | Nombre | Email | Especialidad |
|-----|--------|-------|--------------|
| Técnico | Carlos Mendoza | carlos@tecnihogar.pe | Gasfitería (verificado) |
| Técnico | Ana Torres | ana@tecnihogar.pe | Electricidad (verificado) |
| Técnico | Javier Ramírez | javier@tecnihogar.pe | Mantenimiento (verificado) |
| Técnico | María Vargas | maria@tecnihogar.pe | Gasfitería (no verificada) |
| Técnico | Luis Paredes | luis@tecnihogar.pe | Gasfitería (verificado) |
| Técnico | Diego Castillo | diego@tecnihogar.pe | Electricidad (verificado) |
| Cliente | Rosa Díaz | rosa@tecnihogar.pe | — |

## Deploy a producción

Ver `DEPLOY.md` — se configura en la siguiente fase (EC2 + RDS + Vercel).
