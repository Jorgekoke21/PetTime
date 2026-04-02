# Guía rápida para defender PetTime

## 1. Presentación corta del proyecto
PetTime es una aplicación web desarrollada como proyecto final de DAW para conectar dueños de mascotas con paseadores. Permite registrarse, iniciar sesión, consultar paseadores, crear reservas, gestionar su estado y editar el perfil del paseador.

## 2. Por qué elegimos este proyecto
Elegimos esta idea porque resuelve una necesidad real con un enfoque claro y nos permitía trabajar un proyecto completo con frontend, backend, base de datos, seguridad y documentación técnica.

## 3. Arquitectura en palabras simples
El frontend está hecho con Angular y se encarga de la parte visual. El backend está hecho con Spring Boot y expone la API REST. La información se guarda en MySQL. La comunicación entre frontend y backend se hace con peticiones HTTP y el acceso protegido usa JWT.

## 4. Justificación técnica resumida
### Angular
Lo elegimos porque ofrece una estructura bastante ordenada, routing, formularios y cliente HTTP integrados. Para un proyecto académico y en equipo nos parecía una opción más guiada.

### Spring Boot
Lo elegimos porque facilita construir APIs REST, aplicar seguridad y trabajar con base de datos mediante JPA. Además, es una tecnología muy usada y defendible en un TFG.

### MySQL
Es una base de datos relacional conocida, estable y suficiente para un modelo con usuarios, reservas y pagos.

## 5. Seguridad explicada fácil
- Las contraseñas no se guardan en texto plano, se cifran con BCrypt.
- Cuando el usuario inicia sesión, el backend genera un token JWT.
- Ese token se usa para acceder a las rutas protegidas.
- Así conseguimos una seguridad base adecuada para un MVP.

## 6. Qué funcionalidades enseñar en la demo
1. Registro de usuario
2. Inicio de sesión
3. Listado de paseadores
4. Reserva de un paseo
5. Gestión del estado de la reserva
6. Edición del perfil del paseador

## 7. Qué mejoras futuras comentar
- refresh tokens
- testing automatizado
- despliegue más completo
- panel de administración
- filtros de búsqueda y disponibilidad horaria

## 8. Cómo responder si preguntan por las limitaciones
Se puede decir claramente que el proyecto está planteado como un MVP académico. El flujo principal está implementado y bien estructurado, pero no pretende competir con una aplicación comercial terminada.

## 9. Mensaje final útil
Lo importante no es vender humo, sino demostrar que el proyecto funciona, que las decisiones técnicas tienen sentido y que sabemos explicar qué está hecho, qué falta y cómo se podría mejorar.
