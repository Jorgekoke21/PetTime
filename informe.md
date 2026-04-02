# Informe del proyecto PetTime

Fecha: 2026-04-02

## Índice
1. Introducción y objetivos
2. Estado del arte y diferenciación
3. Requisitos y alcance del MVP
4. Arquitectura del sistema
5. Justificación de decisiones técnicas
6. Diseño UML
7. Implementación
8. Testing
9. Seguridad
10. Despliegue, contenedorización y escalabilidad
11. Estado actual del proyecto y trabajo pendiente
12. Conclusiones
13. Bibliografía
14. Anexos

## 1. Introducción y objetivos
PetTime es una aplicación web orientada a conectar dueños de mascotas con paseadores profesionales. El objetivo del proyecto es resolver un problema cotidiano con una solución full stack moderna, separando claramente frontend, backend y persistencia. El sistema actual implementa autenticación, consulta de paseadores, edición del perfil del paseador, creación de reservas y un pago simulado para validar el flujo principal de negocio.

A nivel académico, el proyecto permite demostrar competencias propias de DAW: diseño de APIs REST, consumo desde SPA, seguridad básica con JWT, persistencia relacional, validación, despliegue básico y documentación técnica.

## 2. Estado del arte y diferenciación
El mercado de servicios para mascotas ya dispone de soluciones que conectan usuarios con cuidadores o paseadores. Sin embargo, muchas plataformas generalistas priorizan el volumen de servicios y la intermediación comercial frente a la simplicidad técnica y la especialización de un MVP académico. PetTime se diferencia por centrarse exclusivamente en el caso de uso de paseo y reserva, con una arquitectura relativamente sencilla, mantenible y comprensible para un entorno universitario.

Frente a un marketplace genérico, PetTime introduce:
- separación clara entre dueño y paseador;
- flujo de autenticación y reserva simple;
- edición del perfil del paseador con ubicación;
- base suficiente para extender pagos, disponibilidad y reputación;
- una implementación modular que facilita evolución futura.

Desde el punto de vista tecnológico, el proyecto no busca competir con plataformas productivas consolidadas, sino demostrar una solución coherente, segura a nivel base y extensible.

## 3. Requisitos y alcance del MVP
### Requisitos funcionales implementados
- Registro de usuarios.
- Inicio de sesión con JWT.
- Diferenciación básica de roles: dueño, paseador y admin.
- Listado de paseadores.
- Visualización de ubicación del paseador en mapa.
- Creación de reservas.
- Consulta de reservas del usuario autenticado.
- Actualización del estado de la reserva.
- Edición del perfil del paseador.
- Pago simulado.

### Requisitos no funcionales principales
- Arquitectura cliente-servidor desacoplada.
- Interfaz SPA responsive.
- Persistencia en MySQL.
- API REST stateless.
- Seguridad básica con BCrypt + JWT.

### Alcance real del MVP
El producto actual cubre el flujo base de registro, autenticación, exploración de paseadores y reserva. No pretende ser una plataforma lista para producción, sino un MVP funcional sobre el que justificar decisiones técnicas y proponer mejoras razonables.

## 4. Arquitectura del sistema
PetTime se apoya en una arquitectura de tres capas lógicas: presentación, lógica de negocio y persistencia. Esta organización es adecuada para un proyecto de 2º de DAW porque separa claramente la interfaz, el procesamiento de las reglas de negocio y el acceso a base de datos.

### 4.1 Arquitectura general
```text
┌─────────────────────────────┐
│ Frontend Angular 17         │
│ - componentes standalone    │
│ - guards                    │
│ - interceptor JWT           │
└──────────────┬──────────────┘
               │ HTTP/JSON
               ▼
┌─────────────────────────────┐
│ Backend Spring Boot 3       │
│ - controllers REST          │
│ - servicios                 │
│ - seguridad JWT             │
│ - JPA/Hibernate             │
└──────────────┬──────────────┘
               │ JDBC/JPA
               ▼
┌─────────────────────────────┐
│ MySQL                       │
│ - usuarios                  │
│ - paseadores                │
│ - reservas                  │
│ - pagos                     │
└─────────────────────────────┘
```

### 4.2 Arquitectura backend
- `controller/`: expone la API REST.
- `service/`: encapsula lógica de negocio, como el pago simulado.
- `repository/`: acceso a datos mediante Spring Data JPA.
- `model/entity/`: entidades persistentes y relaciones.
- `security/`: configuración de seguridad, filtro JWT y carga de usuarios.

### 4.3 Arquitectura frontend
- `core/`: autenticación, guards e interceptor.
- `features/auth/`: login y registro.
- `features/paseadores/`: búsqueda, reserva y edición del perfil del paseador.
- `features/reservas/`: visualización y actualización del estado de las reservas.
- `shared/`: barra de navegación y elementos compartidos.

### 4.4 Arquitectura por capas
- **Capa de presentación:** Angular muestra la interfaz y recoge la interacción del usuario.
- **Capa de negocio:** Spring Boot procesa peticiones, aplica reglas y protege la API.
- **Capa de datos:** MySQL almacena usuarios, paseadores, reservas y pagos.

## 5. Justificación de decisiones técnicas
### 5.1 Angular frente a React
Se eligió Angular porque proporciona una estructura de proyecto más guiada y homogénea, útil en un contexto académico y de equipo. Angular integra routing, formularios, cliente HTTP, inyección de dependencias y herramientas de build de forma oficial, reduciendo la necesidad de ensamblar librerías externas. React ofrece más flexibilidad, pero también exige decidir más piezas arquitectónicas desde el inicio.

### 5.2 Spring Boot frente a Node.js
Spring Boot se eligió por su madurez en APIs empresariales, integración con seguridad, validación, persistencia JPA y facilidad para estructurar capas. En un proyecto DAW, además, permite justificar patrones ampliamente usados en el sector profesional. Node.js habría facilitado un stack unificado en JavaScript, pero Spring Boot ofrece una base muy sólida en seguridad, persistencia y escalabilidad backend.

### 5.3 MySQL como base de datos
MySQL es una elección razonable por ser relacional, conocida, ampliamente documentada y adecuada para un modelo con usuarios, roles, reservas y pagos. El dominio del problema encaja bien con relaciones claras y consistencia transaccional.

### 5.4 JWT y BCrypt
El uso de JWT permite desacoplar frontend y backend manteniendo autenticación stateless. BCrypt protege las contraseñas almacenadas mediante hashing robusto. Son decisiones correctas para un MVP moderno. No obstante, para una versión más madura haría falta añadir refresh tokens, revocación, expiración más gestionada y control fino por permisos.

## 6. Diseño UML
### 6.1 Diagrama de clases
```text
┌────────────────────┐
│ Usuario            │
├────────────────────┤
│ id                 │
│ nombre             │
│ email              │
│ password           │
│ rol                │
└─────────┬──────────┘
          │ hereda
          ▼
┌────────────────────┐
│ Paseador           │
├────────────────────┤
│ biografia          │
│ precioPorHora      │
│ latitud            │
│ longitud           │
│ calificacion       │
└────────────────────┘

┌────────────────────┐        ┌────────────────────┐
│ Reserva            │1      1│ Pago               │
├────────────────────┤────────├────────────────────┤
│ id                 │        │ id                 │
│ fechaHoraReserva   │        │ monto              │
│ estado             │        │ metodoPago         │
└───────┬──────┬─────┘        │ referencia         │
        │      │              │ fechaPago          │
        │      │              └────────────────────┘
        │      │
        │      └──────────────► Paseador
        └─────────────────────► Usuario (dueño)
```

### 6.2 Diagrama de secuencia: login
```text
Usuario -> Frontend: introduce credenciales
Frontend -> AuthController: POST /api/auth/signin
AuthController -> AuthenticationManager: autenticar
AuthenticationManager -> UserDetailsService: cargar usuario
AuthController -> JwtUtils: generar token
AuthController --> Frontend: JWT + datos usuario
Frontend -> LocalStorage: guardar token
Frontend -> Navegación: acceso a rutas protegidas
```

### 6.3 Diagrama de secuencia: reserva
```text
Dueño -> Frontend: selecciona paseador y fecha
Frontend -> ReservaController: POST /api/reservas
ReservaController -> UsuarioRepository: obtener dueño autenticado
ReservaController -> PaseadorRepository: obtener paseador
ReservaController -> ReservaRepository: guardar reserva
ReservaController --> Frontend: confirmación
Frontend --> Dueño: reserva creada
```

### 6.4 Diagrama entidad-relación simplificado
```text
USUARIO
- id
- nombre
- email
- password
- rol

PASEADOR
- id
- biografia
- precioPorHora
- latitud
- longitud
- calificacion

RESERVA
- id
- fechaHoraReserva
- estado
- usuario_id
- paseador_id
- pago_id

PAGO
- id
- monto
- metodoPago
- referenciaTransaccion
- fechaPago
```

## 7. Implementación
### 7.1 Backend
El backend está desarrollado con Spring Boot 3.2.3 y Java 21. Expone endpoints REST para autenticación, paseadores y reservas. La persistencia se realiza con JPA/Hibernate sobre MySQL. La seguridad se basa en un filtro JWT que valida el token y establece el usuario autenticado en el contexto de Spring Security.

Endpoints implementados:
- `POST /api/auth/signin`
- `POST /api/auth/signup`
- `GET /api/paseadores`
- `GET /api/paseadores/me`
- `PUT /api/paseadores/me`
- `GET /api/reservas`
- `POST /api/reservas`
- `POST /api/reservas/pagar`
- `PATCH /api/reservas/{id}/estado`

Ejemplos de uso:

**Registro**
```json
{
  "nombre": "Xabi",
  "email": "xabi@test.com",
  "password": "123456",
  "rol": []
}
```

**Login**
```json
{
  "email": "xabi@test.com",
  "password": "123456"
}
```

**Crear reserva**
```json
{
  "paseadorId": 2,
  "fechaHora": "2026-05-10T18:00:00"
}
```

### 7.2 Frontend
El frontend usa Angular 17 con componentes standalone. La app protege rutas mediante `authGuard` y `paseadorGuard`, y añade el token JWT automáticamente con un interceptor. La interfaz actual cubre home, login, registro, listado de paseadores, edición del perfil del paseador y consulta de reservas.

### 7.3 Estado actual revisado
Tras revisar el repositorio se observa que:
- el frontend compila correctamente con `ng build`;
- el backend no se ha podido validar en esta máquina porque Java no está instalado;
- se han reforzado validaciones sencillas en reservas, pagos y edición de perfil;
- se ha añadido un manejador global de errores para devolver mensajes más claros;
- el proyecto está funcional a nivel de estructura, pero todavía tiene carencias propias de un MVP.

## 8. Testing
Este apartado debe aparecer de forma explícita en la memoria, ya que el tutor lo pide y además es una carencia clara del proyecto actual.

### 8.1 Testing de API
Casos de prueba recomendados y documentables:
- registro correcto de usuario;
- intento de registro con email duplicado;
- login correcto;
- login con contraseña inválida;
- acceso sin token a rutas protegidas;
- creación de reserva con token válido;
- intento de crear reserva con paseador inexistente;
- actualización de estado por un usuario sin relación con la reserva;
- consulta de reservas del dueño y del paseador.

Estas pruebas pueden ejecutarse con Postman, Bruno o colecciones HTTP y documentarse mediante capturas o tablas de resultados.

### 8.2 Testing de casos de uso
Casos de uso funcionales:
1. Un dueño se registra.
2. Inicia sesión.
3. Consulta el listado de paseadores.
4. Selecciona fecha y crea una reserva.
5. El paseador visualiza la reserva.
6. El paseador la confirma.
7. El dueño consulta el estado actualizado.

### 8.3 Estado real del testing
Actualmente no se observan tests automatizados de backend ni frontend en el repositorio. Esto no invalida el MVP, pero sí debe figurar con honestidad en la memoria como línea clara de mejora.

Como apoyo al TFG, se ha preparado además un documento de testing manual (`backend/TESTING.md`) con casos de prueba de API y casos de uso funcionales fáciles de defender en una exposición de 2º de DAW.

## 9. Seguridad
### 9.1 Medidas de seguridad implementadas
- Contraseñas cifradas con BCrypt.
- Autenticación basada en JWT.
- API stateless.
- Rutas protegidas mediante Spring Security.
- Separación básica por rol.

### 9.1.1 Flujo de autenticación JWT
1. El usuario se registra o inicia sesión desde Angular.
2. El backend valida las credenciales con Spring Security.
3. Si son correctas, genera un token JWT.
4. El frontend guarda ese token en `localStorage`.
5. El interceptor JWT añade `Authorization: Bearer <token>` a las peticiones protegidas.
6. El backend valida el token en cada petición antes de permitir el acceso.

### 9.2 Análisis OWASP básico
Comparando el sistema con riesgos OWASP habituales, se detecta:
- **Control de acceso**: existe autenticación, pero faltan permisos más finos y validación estricta de ownership en ciertas operaciones.
- **Criptografía**: BCrypt es correcto para contraseñas, pero el secreto JWT no debería estar hardcodeado en `application.properties`.
- **Inyecciones**: JPA reduce riesgo de SQL Injection al trabajar con repositorios, aunque sigue siendo importante validar entradas.
- **Diseño inseguro**: el pago es simulado y no existe gestión real de transacciones ni antifraude.
- **Configuración insegura**: CORS está limitado a localhost, lo cual está bien para desarrollo, pero faltan perfiles por entorno.
- **Componentes vulnerables**: el frontend reporta dependencias con vulnerabilidades al instalar paquetes; esto debe mencionarse y mitigarse con actualizaciones controladas.
- **Fallos de identificación/autenticación**: no hay refresh tokens, revocación ni políticas avanzadas de expiración.
- **Logging y monitorización**: no hay trazabilidad orientada a auditoría ni alertas.

### 9.3 Mejoras propuestas
- mover secretos y credenciales a variables de entorno;
- introducir refresh tokens y expiración controlada;
- limitar operaciones por rol con más granularidad;
- validar ownership en pagos y reservas;
- añadir validaciones de negocio más estrictas;
- desactivar logs de seguridad verbosos en producción;
- incorporar rate limiting y auditoría.

## 10. Despliegue, contenedorización y escalabilidad
### 10.1 Despliegue actual
El repositorio incluye Dockerfile para el backend, pero no una solución completa de despliegue del sistema. Actualmente el flujo pensado es local:
- backend en Spring Boot;
- frontend en Angular con `ng serve`;
- MySQL en entorno local.

### 10.2 Despliegue documentado propuesto
Para un despliegue reproducible, la memoria debe explicar un escenario con:
- frontend compilado y servido por Nginx o similar;
- backend empaquetado como imagen Docker;
- base de datos MySQL gestionada aparte;
- variables de entorno para credenciales y secreto JWT;
- reverse proxy para exponer frontend y backend bajo dominio HTTPS.

### 10.3 Qué faltaría para producción
- pipeline de CI/CD;
- dockerización completa del frontend;
- `docker-compose` o equivalente para desarrollo/entorno integrado;
- perfiles de configuración por entorno;
- HTTPS real;
- copias de seguridad de base de datos;
- observabilidad (logs, métricas, health checks);
- escalado horizontal del backend detrás de proxy;
- almacenamiento externo y servicio gestionado de base de datos.

### 10.4 Escalabilidad
La arquitectura permite escalar razonablemente bien porque frontend y backend están desacoplados. Para crecer en producción sería necesario:
- desplegar varias instancias del backend;
- externalizar sesiones y secretos, aunque JWT ya reduce dependencia de sesión de servidor;
- usar una base de datos más robusta o replicada;
- incorporar caché si el volumen de lecturas aumentase;
- servir el frontend como estático mediante CDN o Nginx.

## 11. Estado actual del proyecto y trabajo pendiente
### 11.1 Fortalezas
- stack coherente y moderno;
- flujo principal funcional;
- separación clara entre frontend y backend;
- buena base para defender decisiones técnicas;
- seguridad básica razonable para un MVP.

### 11.2 Carencias reales detectadas
- interfaz visual correcta pero todavía poco pulida;
- ausencia de tests automatizados;
- secreto JWT en configuración;
- carencia de refresh tokens y permisos finos;
- documentación de despliegue incompleta;
- falta de bibliografía y citas integradas en el texto;
- capturas mezcladas en el cuerpo principal en vez de anexos.

## 12. Conclusiones
PetTime es un MVP académico consistente, con una base técnica defendible y alineada con los objetivos de un TFG de DAW. La combinación Angular + Spring Boot + MySQL está bien justificada, y la implementación ya demuestra autenticación, autorización básica, persistencia y un flujo funcional de reserva. Para cerrar el proyecto con solvencia, el mayor trabajo no está solo en programar más, sino en reforzar testing, memoria, seguridad aplicada y presentación formal.

## 13. Bibliografía
La bibliografía debe reformatearse en estilo uniforme (APA, IEEE o el que pida el centro). Ejemplos de fuentes a citar en el texto y desarrollar en la bibliografía final:
- Angular. (2024). *Angular documentation*. https://angular.dev/
- Spring. (2024). *Spring Boot Reference Documentation*. https://docs.spring.io/spring-boot/
- OWASP Foundation. (2024). *OWASP Top 10*. https://owasp.org/www-project-top-ten/
- Oracle. (2024). *Java Documentation*. https://docs.oracle.com/
- MySQL. (2024). *MySQL 8.0 Reference Manual*. https://dev.mysql.com/doc/
- Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*.

## 14. Anexos
En anexos deberían moverse:
- capturas de pantallas de la aplicación;
- evidencias de pruebas manuales;
- resultados de Postman;
- configuraciones auxiliares;
- fragmentos secundarios que no aportan valor al cuerpo principal.

Como apoyo adicional, se ha preparado un documento `ANEXOS.md` con diagramas simplificados, pruebas manuales recomendadas y una propuesta clara de materiales para anexar en la memoria final.

---
Fin del informe.
