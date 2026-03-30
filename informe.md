# Informe del proyecto PetTime

Fecha: 2026-02-03

## 1) Resumen
PetTime es un MVP de una plataforma de paseos de mascotas con autenticación JWT, gestión de paseadores (incluye edición de perfil), reservas y pago simulado. El repositorio está dividido en dos aplicaciones:
- `backend/`: API REST en Spring Boot.
- `frontend/`: SPA en Angular 17.

## 2) Estructura del proyecto (alto nivel)
```
PetTime/
  backend/
    src/main/java/com/pettime/
      controller/
      dto/
      model/entity/
      repository/
      security/
      service/
    src/main/resources/
      application.properties
    pom.xml
    Dockerfile
  frontend/
    src/
      app/
        core/
        features/
          paseadores/
            profile-editor/
        shared/
      styles.scss
      index.html
      main.ts
      polyfills.ts
    angular.json
    package.json
    tsconfig*.json
  .gitignore
```

## 3) Tecnologías y dependencias principales
### Backend
- Java 21 + Spring Boot 3.2.3 (Web, Validation, Data JPA, Security).
- MySQL como BD (driver `mysql-connector-j`).
- JWT con `jjwt`.
- Lombok.
- Dockerfile para empaquetar el JAR.

### Frontend
- Angular 17 (standalone components, signals, interceptor funcional).
- Bootstrap 5 + Popper.
- Leaflet (mapas) y tipos.
- RxJS.

## 4) Arquitectura y relación entre componentes
### Flujo general
1. El usuario se registra o inicia sesión en el frontend.
2. El frontend llama a la API (`/api/auth/**`) y guarda el JWT en `localStorage`.
3. El interceptor agrega `Authorization: Bearer <token>` a cada request.
4. Las rutas protegidas en frontend (`/paseadores`, `/reservas`, `/mi-perfil`) usan `authGuard` y `paseadorGuard` en el caso del perfil.
5. El backend valida el JWT y autoriza el acceso.

### Capas backend
- `controller/`: expone endpoints REST.
- `service/`: lógica de negocio (pago simulado).
- `repository/`: acceso a datos con JPA.
- `model/entity/`: entidades JPA.
- `security/`: filtro JWT, config de seguridad y detalles de usuario.

### Entidades y relaciones (JPA)
- `Usuario` (base) con herencia `JOINED`.
- `Paseador` extiende `Usuario`.
- `Reserva`:
  - `ManyToOne` con `Usuario` (dueño).
  - `ManyToOne` con `Paseador`.
  - `OneToOne` con `Pago`.
- `Pago`: monto, fecha, método y referencia.
- `EstadoReserva`: `PENDIENTE`, `CONFIRMADA`, `CANCELADA`, `COMPLETADA`.

## 5) Endpoints actuales (backend)
- Auth:
  - `POST /api/auth/signin` ? login (JWT).
  - `POST /api/auth/signup` ? registro.
- Paseadores:
  - `GET /api/paseadores` ? lista de paseadores.
  - `GET /api/paseadores/me` ? ver perfil del paseador autenticado.
  - `PUT /api/paseadores/me` ? actualizar perfil del paseador autenticado.
- Reservas:
  - `GET /api/reservas` ? reservas del usuario autenticado.
  - `POST /api/reservas` ? crear reserva.
  - `POST /api/reservas/pagar` ? pago simulado.
  - `PATCH /api/reservas/{id}/estado?estado=...` ? actualizar estado (dueño o paseador).

## 6) Módulos del frontend
- `core/`:
  - `auth.service`: login/registro, token, estado usuario.
  - `auth.guard`: protección de rutas.
  - `paseador.guard`: restringe acceso a paseadores.
  - `jwt.interceptor`: agrega JWT a requests.
- `features/`:
  - `auth/`: login y registro (standalone components).
  - `paseadores/`: listado y creación de reservas.
  - `paseadores/profile-editor`: edición de perfil del paseador.
  - `reservas/`: listado y pago simulado.
  - `home/`: landing.
- `shared/`:
  - `navbar`: navegación y sesión.

## 7) Configuración actual
- API backend corre en puerto `8080`.
- Frontend pensado para `http://localhost:4200`.
- DB MySQL configurada en `localhost:3307`, schema `pettime`.
- CORS habilitado para `http://localhost:4200`.

## 8) Qué falta por desarrollar / gaps detectados
(Con base en lo que se observa en el repo)

### Funcionalidad
- Finalización/cancelación de reservas: hay endpoint para cambiar estado, pero no hay UI que permita escoger/actualizar el estado.
- Perfil de paseador: hay endpoints y UI básica, faltan campos como disponibilidad/horarios.
- Historial de pagos y detalle de transacciones.
- Gestión de roles/permisos finos (más allá de “autenticado/no autenticado”).

### Seguridad y robustez
- Manejo de errores y validaciones más estrictas (p. ej., reserva en fecha inválida, paseador inexistente).
- Validación de ownership en pago (ahora se comenta como TODO).
- Configuración de secretos (JWT) por variables de entorno.
- No se observan tests automatizados de API o frontend.

### Operación y DX
- No hay scripts/documentación de setup local.
- No se observan entornos Angular (`environment.ts`) para URLs dinámicas.
- No hay migraciones de BD (Flyway/Liquibase) ni semillas.

## 9) Mapa rápido de dependencias entre módulos
```
Frontend
  AuthService ? /api/auth/*
  PaseadoresService ? /api/paseadores
  PaseadoresService.getMiPerfil/updatePerfil ? /api/paseadores/me
  ReservasService ? /api/reservas, /api/reservas/pagar
  jwtInterceptor ? adjunta JWT a cada request

Backend
  AuthController ? UsuarioRepository, PaseadorRepository, JwtUtils
  PaseadorController ? PaseadorRepository
  ReservaController ? ReservaRepository, UsuarioRepository, PaseadorRepository, PagoService
  PagoService ? ReservaRepository, PagoRepository
```

## 10) Notas rápidas
- El registro de paseador crea un `Paseador` con defaults (precio, biografía y lat/lng mock si no vienen en el request).
- La lógica de pago está simulada (`MOCK_STRIPE`).
- El frontend asume que el backend devuelve `token` y un objeto de usuario en el login.
- En el frontend hay vista de mapa en modal con Leaflet para ubicar al paseador.

---
Fin del informe.






