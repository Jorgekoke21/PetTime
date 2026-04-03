# Como levantar PetTime (actualizado)

## Opcion recomendada: Docker (MySQL + Backend) + Frontend local

1. Desde la raiz del proyecto:
```powershell
cd C:\Users\Jorge\Desktop\PetTime\PetTime
docker compose up -d --build
```

2. Levantar frontend en otra terminal:
```powershell
cd C:\Users\Jorge\Desktop\PetTime\PetTime\frontend
npm install
npm start
```

3. URLs:
- Frontend: http://localhost:4200/
- Backend: http://localhost:8081/

Nota: si alguna ruta del backend responde `401`, es normal (rutas protegidas con JWT).

## Opcion sin Docker (todo local)

1. Asegura MySQL local y base de datos `pettime`.
2. En backend:
```powershell
cd C:\Users\Jorge\Desktop\PetTime\PetTime\backend
mvn spring-boot:run
```
3. En frontend (otra terminal):
```powershell
cd C:\Users\Jorge\Desktop\PetTime\PetTime\frontend
npm install
npm start
```

## Parar servicios

- Frontend: `Ctrl + C` en la terminal de Angular.
- Docker (backend + db):
```powershell
cd C:\Users\Jorge\Desktop\PetTime\PetTime
docker compose down
```
