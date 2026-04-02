# Testing manual de PetTime

Este documento recoge pruebas simples y realistas, a nivel de 2º de DAW, para justificar el apartado de testing del proyecto.

## 1. Pruebas de API

### 1.1 Registro correcto
**Petición**
- Método: `POST`
- URL: `http://localhost:8080/api/auth/signup`

**Body JSON**
```json
{
  "nombre": "Xabi",
  "email": "xabi@test.com",
  "password": "123456",
  "rol": []
}
```

**Resultado esperado**
- Código `200 OK`
- Mensaje: `User registered successfully!`

### 1.2 Registro duplicado
**Resultado esperado**
- Código `400 Bad Request`
- Mensaje indicando que el email ya está en uso

### 1.3 Login correcto
**Petición**
- Método: `POST`
- URL: `http://localhost:8080/api/auth/signin`

**Body JSON**
```json
{
  "email": "xabi@test.com",
  "password": "123456"
}
```

**Resultado esperado**
- Código `200 OK`
- Respuesta con `token`, `id`, `username`, `email` y `roles`

### 1.4 Acceso sin token a reservas
**Petición**
- Método: `GET`
- URL: `http://localhost:8080/api/reservas`

**Resultado esperado**
- Código `401 Unauthorized`

### 1.5 Crear reserva válida
**Petición**
- Método: `POST`
- URL: `http://localhost:8080/api/reservas`
- Header: `Authorization: Bearer <token>`

**Body JSON**
```json
{
  "paseadorId": 2,
  "fechaHora": "2026-05-10T18:00:00"
}
```

**Resultado esperado**
- Código `200 OK`
- Mensaje: `Reserva creada correctamente`

### 1.6 Crear reserva en fecha pasada
**Resultado esperado**
- Código `400 Bad Request`
- Mensaje indicando que la fecha debe ser futura

### 1.7 Pagar una reserva propia
**Petición**
- Método: `POST`
- URL: `http://localhost:8080/api/reservas/pagar`
- Header: `Authorization: Bearer <token>`

**Body JSON**
```json
{
  "reservaId": 1,
  "metodoPago": "MOCK"
}
```

**Resultado esperado**
- Código `200 OK`
- Mensaje: `Pago procesado correctamente`

### 1.8 Pagar una reserva ajena
**Resultado esperado**
- Código `403 Forbidden`
- Mensaje indicando que no puede pagar una reserva que no es suya

## 2. Casos de uso funcionales

### Caso de uso 1: dueño reserva un paseo
1. El usuario se registra como dueño.
2. Inicia sesión.
3. Entra en el listado de paseadores.
4. Selecciona fecha y hora.
5. Crea una reserva.
6. Comprueba que aparece en `Mis Reservas`.

### Caso de uso 2: paseador gestiona una reserva
1. El usuario se registra como paseador.
2. Inicia sesión.
3. Consulta sus reservas.
4. Confirma una reserva pendiente.
5. Más tarde la marca como completada.

### Caso de uso 3: edición del perfil del paseador
1. El paseador inicia sesión.
2. Accede a `Mi Perfil`.
3. Cambia biografía, precio y ubicación.
4. Guarda cambios.
5. Comprueba que los nuevos datos aparecen en el listado.

## 3. Herramientas usadas
- Frontend en navegador
- Backend en Spring Boot
- Postman o Thunder Client para probar la API
- MySQL/XAMPP para persistencia

## 4. Conclusión
Estas pruebas permiten demostrar que el MVP cubre los flujos principales del proyecto y que la API responde correctamente en casos correctos y en algunos errores comunes.
