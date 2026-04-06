[README.md](https://github.com/user-attachments/files/26519528/README.md)
# 🐾 PetTime

PetTime es una aplicación web desarrollada como proyecto académico para conectar dueños de mascotas con paseadores profesionales.

## Tecnologías usadas
- **Frontend:** Angular 17
- **Backend:** Spring Boot 3
- **Base de datos:** MySQL
- **Seguridad:** JWT + BCrypt

## Objetivo del proyecto
El objetivo de PetTime es ofrecer una plataforma sencilla donde un usuario pueda registrarse, iniciar sesión, consultar paseadores, crear reservas y gestionar el estado de esas reservas. Además, los paseadores pueden editar su perfil para mostrar mejor su servicio.

## Funcionalidades principales
- Registro e inicio de sesión
- Autenticación con JWT
- Diferenciación básica de roles
- Listado de paseadores
- Visualización de ubicación en mapa
- Creación y consulta de reservas
- Actualización del estado de las reservas
- Edición del perfil del paseador
- Pago simulado

## Estructura del proyecto
```text
PetTime/
├── backend/
│   ├── src/main/java/com/pettime/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/entity/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── src/main/resources/
│   ├── Dockerfile
│   └── TESTING.md
│
├── frontend/
│   ├── src/app/
│   │   ├── core/
│   │   ├── features/
│   │   └── shared/
│   └── package.json
│
├── informe.md
└── README.md
```

## Requisitos
Antes de arrancar el proyecto hace falta tener instalado:
- Node.js 18 o superior
- Java JDK 21
- MySQL o XAMPP
- Git

## Puesta en marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jorgekoke21/PetTime.git
cd PetTime
```

### 2. Configurar la base de datos
Crear una base de datos llamada `pettime`.

La configuración actual del backend espera MySQL en el puerto `3307`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/pettime?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

Si tu MySQL usa `3306`, tendrás que cambiar el puerto en `backend/src/main/resources/application.properties`.

### 3. Arrancar el backend
Desde la carpeta `backend`:
```bash
mvn spring-boot:run
```

Backend disponible en:
```text
http://localhost:8081
```

### 4. Arrancar el frontend
Desde la carpeta `frontend`:
```bash
npm install
npm start
```

Frontend disponible en:
```text
http://localhost:4200
```

## Usuarios y roles
- **Dueño:** busca paseadores y crea reservas
- **Paseador:** aparece en el listado y gestiona reservas
- **Admin:** rol reservado para gestión más avanzada

## Testing
Se ha preparado un documento con pruebas manuales de API y casos de uso en:
```text
backend/TESTING.md
```

## Seguridad aplicada
A nivel de MVP, el proyecto incluye:
- contraseñas cifradas con BCrypt
- autenticación basada en JWT
- rutas protegidas en backend
- control básico de acceso según rol








