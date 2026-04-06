Como levantar PetTime 
Docker (MySQL + Backend) + Frontend
Desde la raiz del proyecto:
cd C:\Users\Jorge\Desktop\PetTime\PetTime
docker compose up -d --build
Levantar frontend en otra terminal:
cd C:\Users\Jorge\Desktop\PetTime\PetTime\frontend
npm install
npm start
URLs:
Frontend: http://localhost:4200/
Backend: http://localhost:8081/


Opcion sin Docker 
En backend:
cd C:\Users\Jorge\Desktop\PetTime\PetTime\backend
mvn spring-boot:run
En frontend (otra terminal):
cd C:\Users\Jorge\Desktop\PetTime\PetTime\frontend
npm install
npm start
