# Anexos del proyecto PetTime

## Anexo A. Diagrama de arquitectura
```text
┌─────────────────────────────────────────────┐
│                 Frontend                    │
│                 Angular 17                  │
│---------------------------------------------│
│ - Home                                      │
│ - Login / Registro                          │
│ - Listado de paseadores                     │
│ - Gestión de reservas                       │
│ - Perfil del paseador                       │
└──────────────────────┬──────────────────────┘
                       │ HTTP + JSON + JWT
                       ▼
┌─────────────────────────────────────────────┐
│                 Backend                     │
│              Spring Boot 3                  │
│---------------------------------------------│
│ - AuthController                            │
│ - PaseadorController                        │
│ - ReservaController                         │
│ - PagoService                               │
│ - WebSecurityConfig                         │
│ - JWT Filter                                │
└──────────────────────┬──────────────────────┘
                       │ JPA / Hibernate
                       ▼
┌─────────────────────────────────────────────┐
│               Base de datos                 │
│                  MySQL                      │
│---------------------------------------------│
│ - usuarios                                  │
│ - paseadores                                │
│ - reservas                                  │
│ - pagos                                     │
└─────────────────────────────────────────────┘
```

## Anexo B. Diagrama de clases simplificado
```text
Usuario
- id
- nombre
- email
- password
- rol
   ▲
   │ herencia
   │
Paseador
- biografia
- precioPorHora
- latitud
- longitud
- calificacion

Reserva
- id
- fechaHoraReserva
- estado
- dueno: Usuario
- paseador: Paseador
- pago: Pago

Pago
- id
- monto
- metodoPago
- referenciaTransaccion
- fechaPago
```

## Anexo C. Diagrama de secuencia: login
```text
Usuario -> Frontend: introduce email y contraseña
Frontend -> Backend: POST /api/auth/signin
Backend -> Security: valida credenciales
Backend -> JwtUtils: genera token JWT
Backend -> Frontend: devuelve token + datos de usuario
Frontend -> LocalStorage: guarda token
Frontend -> Usuario: acceso concedido
```

## Anexo D. Diagrama de secuencia: reserva
```text
Usuario -> Frontend: elige paseador y fecha
Frontend -> Backend: POST /api/reservas
Backend -> Base de datos: guarda reserva
Backend -> Frontend: devuelve confirmación
Frontend -> Usuario: muestra reserva creada
```

## Anexo E. Pruebas manuales recomendadas
- Registro correcto de un usuario dueño
- Registro correcto de un usuario paseador
- Login correcto
- Intento de login incorrecto
- Visualización de listado de paseadores
- Creación de reserva válida
- Cancelación de reserva por parte del dueño
- Confirmación de reserva por parte del paseador
- Edición del perfil del paseador
- Pago simulado de reserva

## Anexo F. Capturas a incluir en la memoria
Estas capturas deberían moverse a anexos y no al cuerpo principal:
- pantalla de inicio
- pantalla de login
- pantalla de registro
- listado de paseadores
- formulario de reserva
- pantalla de reservas
- pantalla de edición de perfil
- pruebas de API en Postman/Thunder Client

## Anexo G. Mejoras futuras
- refresh tokens
- roles y permisos más detallados
- disponibilidad horaria de paseadores
- historial de pagos completo
- despliegue completo con Docker Compose
- pruebas automatizadas
- panel de administración
