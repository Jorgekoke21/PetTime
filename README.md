# 🐾 PetTime

Aplicación web para conectar dueños de mascotas con paseadores profesionales.

**Stack:** Angular 17 + Spring Boot 3 + MySQL

---

## 📋 Requisitos

Antes de empezar, instala:

- **Node.js 18+** → [Descargar](https://nodejs.org/)
- **Java JDK 21** → [Descargar](https://adoptium.net/)
- **XAMPP** (MySQL) → [Descargar](https://www.apachefriends.org/)
- **Git** → [Descargar](https://git-scm.com/)

**IDEs recomendados:**
- Frontend: VS Code
- Backend: IntelliJ IDEA o Eclipse

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jorgekoke21/PetTime.git
cd PetTime
```

---

### 2. Configurar la Base de Datos

**Con XAMPP:**

1. Abre XAMPP Control Panel
2. **Start** en MySQL (puerto 3307)
3. Configura phpMyAdmin:
   - Abre: `C:\xampp\phpMyAdmin\config.inc.php`
   - Busca: `$cfg['Servers'][$i]['host'] = '127.0.0.1';`
   - Agrega debajo: `$cfg['Servers'][$i]['port'] = '3307';`
   - Guarda el archivo
4. Abre phpMyAdmin: `http://localhost/phpmyadmin`
5. Crea la base de datos: `pettime`

---

### 3. Backend (Spring Boot)

**Abrir en tu IDE:**
- IntelliJ: `File → Open → backend`
- Eclipse: `File → Import → Existing Maven Projects → backend`

**Verificar configuración:**

Abre: `backend/src/main/resources/application.properties`

Si usas XAMPP (puerto 3307), debe decir:
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/pettime?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

Si usas MySQL standalone (puerto 3306), cambia `3307` por `3306`.

**Ejecutar:**
- IntelliJ: Click derecho en `PetTimeApplication.java` → **Run**
- Eclipse: Click derecho en proyecto → **Run As** → **Spring Boot App**
- Terminal: `cd backend` → `mvn spring-boot:run`

✅ Backend corriendo en: `http://localhost:8080`

---

### 4. Frontend (Angular)

**Desde terminal:**
```bash
cd frontend
npm install
npm start
```

✅ Frontend corriendo en: `http://localhost:4200`

---

## ✅ Verificar que funciona

1. **Backend:** Ve a `http://localhost:8080` (verás error 401 o 404 = funciona ✅)
2. **Frontend:** Ve a `http://localhost:4200` (verás la app)
3. **Prueba:** Registra un usuario en `/register`

---

## 📁 Estructura
```
PetTime/
├── backend/          # Spring Boot (Java)
│   └── src/main/
│       ├── java/com/pettime/
│       │   ├── controller/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       └── resources/
│           └── application.properties
│
└── frontend/         # Angular
    └── src/app/
        ├── core/
        └── features/
            ├── auth/
            ├── home/
            ├── paseadores/
            └── reservas/
```

---

## 🔑 API Endpoints

### Sin autenticación:
- `POST /api/auth/signup` - Registrarse
- `POST /api/auth/signin` - Login

### Con autenticación:
- `GET /api/paseadores` - Listar paseadores
- `GET /api/paseadores/{id}` - Ver paseador
- `POST /api/reservas` - Crear reserva

---

## 🐛 Problemas Comunes

**"Cannot connect to database"**
- ✅ Verifica que MySQL esté corriendo
- ✅ Revisa el puerto (3307 XAMPP / 3306 MySQL standalone)
- ✅ Confirma que existe la base de datos `pettime`

**"Port 8080 already in use"**
- ✅ Cierra otros procesos en puerto 8080
- O cambia en `application.properties`: `server.port=8081`

**Error 401 en frontend**
- ✅ Verifica que el backend esté corriendo
- ✅ Revisa la consola del navegador (F12)

---

## 👥 Colaboración

**Para trabajar en una funcionalidad:**
```bash
# Crear rama
git checkout -b feature/nombre-funcionalidad

# Hacer cambios
git add .
git commit -m "Descripción"
git push origin feature/nombre-funcionalidad

# Crear Pull Request en GitHub
```

**Actualizar tu código:**
```bash
git checkout main
git pull origin main
```

---

## 📝 Roles

- **DUEÑO:** Busca paseadores, hace reservas (por defecto al registrarse)
- **PASEADOR:** Aparece en listado, recibe reservas (marca "Quiero ser Paseador" al registrarte)
- **ADMIN:** Gestión completa (crear manualmente en BD)

---

## 📧 Contacto

Cualquier duda, contacta al equipo de desarrollo.

---

**Proyecto académico - 2025**
