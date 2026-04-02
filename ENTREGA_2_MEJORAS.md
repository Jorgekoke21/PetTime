# Mejoras para la 2ª entrega de PetTime

## 1. Diagnóstico general
La arquitectura cliente-servidor del proyecto está bien orientada y la elección de Angular + Spring Boot + JWT es adecuada para el nivel de 2º de DAW. Aun así, la segunda entrega necesita más profundidad técnica y menos descripción superficial. También hay que corregir varios aspectos formales para que el documento parezca una memoria de proyecto y no un borrador de plantilla.

## 2. Tareas prioritarias
### 2.1 Eliminar textos de plantilla y revisar formato general
Hay que revisar todo el documento para quitar frases genéricas o restos de plantilla. La memoria debe tener un tono uniforme, académico y claro.

Qué conviene revisar:
- títulos que parezcan provisionales;
- frases demasiado genéricas;
- apartados repetidos;
- numeración del índice;
- estilo homogéneo en encabezados y listas;
- ortografía, tildes y formato de código.

## 3. Arquitectura por capas
PetTime sigue una arquitectura por capas sencilla y correcta.

### 3.1 Capa de presentación
Corresponde al frontend desarrollado con Angular. Aquí se encuentran las vistas, los formularios, la navegación y la interacción con el usuario.

Ejemplos en el proyecto:
- login
- registro
- listado de paseadores
- reservas
- perfil del paseador

### 3.2 Capa de lógica de negocio
Corresponde al backend en Spring Boot. Aquí se procesan las peticiones, se aplican reglas del negocio y se controla la seguridad.

Ejemplos en el proyecto:
- autenticación de usuarios
- creación de reservas
- cambio de estado de una reserva
- pago simulado
- edición de perfil

### 3.3 Capa de acceso a datos
Se implementa mediante JPA/Hibernate sobre MySQL. Esta capa se encarga de guardar y recuperar la información persistente.

Ejemplos en el proyecto:
- `UsuarioRepository`
- `PaseadorRepository`
- `ReservaRepository`
- `PagoRepository`

### 3.4 Diagrama de arquitectura por capas
```text
┌──────────────────────────────────────┐
│ Capa de presentación                 │
│ Angular 17                           │
│ - componentes                        │
│ - formularios                        │
│ - guards                             │
│ - interceptor JWT                    │
└────────────────┬─────────────────────┘
                 │ HTTP / JSON
                 ▼
┌──────────────────────────────────────┐
│ Capa de negocio                      │
│ Spring Boot 3                        │
│ - controllers                        │
│ - servicios                          │
│ - seguridad                          │
└────────────────┬─────────────────────┘
                 │ JPA / Hibernate
                 ▼
┌──────────────────────────────────────┐
│ Capa de datos                        │
│ MySQL                                │
│ - usuarios                           │
│ - paseadores                         │
│ - reservas                           │
│ - pagos                              │
└──────────────────────────────────────┘
```

## 4. Diagrama ER
El modelo de datos principal puede explicarse con un diagrama entidad-relación sencillo.

```text
USUARIO
- id (PK)
- nombre
- email
- password
- rol

PASEADOR
- id (PK y FK de usuario)
- biografia
- precio_por_hora
- latitud
- longitud
- calificacion

RESERVA
- id (PK)
- fecha_hora_reserva
- estado
- usuario_id (FK)
- paseador_id (FK)
- pago_id (FK)

PAGO
- id (PK)
- monto
- metodo_pago
- referencia_transaccion
- fecha_pago
```

Relaciones:
- un usuario puede tener muchas reservas como dueño;
- un paseador puede recibir muchas reservas;
- una reserva puede tener un pago asociado;
- un paseador hereda de usuario en el modelo orientado a objetos.

## 5. Endpoints REST documentados con ejemplos reales

### 5.1 Registro
**Endpoint**
```http
POST /api/auth/signup
```

**JSON de ejemplo**
```json
{
  "nombre": "Xabi",
  "email": "xabi@test.com",
  "password": "123456",
  "rol": []
}
```

**Respuesta esperada**
```json
"User registered successfully!"
```

### 5.2 Login
**Endpoint**
```http
POST /api/auth/signin
```

**JSON de ejemplo**
```json
{
  "email": "xabi@test.com",
  "password": "123456"
}
```

**Respuesta esperada**
```json
{
  "token": "jwt_aqui",
  "id": 1,
  "username": "Xabi",
  "email": "xabi@test.com",
  "roles": ["DUEÑO"]
}
```

### 5.3 Obtener paseadores
**Endpoint**
```http
GET /api/paseadores
```

**Respuesta de ejemplo**
```json
[
  {
    "id": 2,
    "nombre": "Laura",
    "email": "laura@test.com",
    "rol": "PASEADOR",
    "biografia": "Me encantan los perros y tengo experiencia en paseos.",
    "precioPorHora": 12.5,
    "latitud": 40.4167,
    "longitud": -3.7037,
    "calificacion": 5.0
  }
]
```

### 5.4 Crear reserva
**Endpoint**
```http
POST /api/reservas
```

**Cabecera**
```http
Authorization: Bearer <token>
```

**JSON de ejemplo**
```json
{
  "paseadorId": 2,
  "fechaHora": "2026-05-10T18:00:00"
}
```

**Respuesta esperada**
```json
"Reserva creada correctamente"
```

### 5.5 Pagar reserva
**Endpoint**
```http
POST /api/reservas/pagar
```

**Cabecera**
```http
Authorization: Bearer <token>
```

**JSON de ejemplo**
```json
{
  "reservaId": 1,
  "metodoPago": "MOCK"
}
```

**Respuesta esperada**
```json
"Pago procesado correctamente"
```

## 6. Flujo de autenticación JWT explicado paso a paso
El flujo de autenticación JWT es uno de los puntos más importantes del proyecto y debe explicarse con detalle en la memoria.

### Paso 1. Registro
El usuario crea una cuenta desde el frontend. Sus datos se envían al backend mediante `POST /api/auth/signup`. Antes de guardarse, la contraseña se cifra con BCrypt.

### Paso 2. Login
El usuario introduce email y contraseña en el formulario de inicio de sesión. El frontend envía estos datos al backend con `POST /api/auth/signin`.

### Paso 3. Validación de credenciales
Spring Security comprueba si el usuario existe y si la contraseña introducida coincide con la contraseña cifrada almacenada en base de datos.

### Paso 4. Generación del token
Si las credenciales son correctas, el backend genera un JWT. Ese token contiene la identidad del usuario y se devuelve al frontend junto con sus datos básicos.

### Paso 5. Almacenamiento del token
El frontend guarda el token en `localStorage`. También guarda la información del usuario para saber si está autenticado y qué rol tiene.

### Paso 6. Envío automático en cada petición
A partir de ese momento, el interceptor JWT de Angular añade automáticamente la cabecera:
```http
Authorization: Bearer <token>
```
a todas las peticiones protegidas.

### Paso 7. Validación en el backend
El filtro JWT del backend intercepta cada petición protegida, comprueba que el token sea válido y, si todo está correcto, permite el acceso al endpoint solicitado.

### Paso 8. Autorización según rol o contexto
Una vez autenticado el usuario, el backend decide si puede realizar la operación. Por ejemplo, un paseador puede completar una reserva, pero un dueño no debería marcarla como completada.

## 7. Qué mejorar en la memoria con estas tareas
Con estos cambios la segunda entrega ganaría:
- más profundidad técnica;
- mejor justificación del diseño;
- explicación más clara de backend y seguridad;
- mejor defensa oral;
- menos sensación de texto genérico.

