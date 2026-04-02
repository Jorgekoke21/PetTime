# Checklist final de entrega - PetTime

## 1. Comprobaciones técnicas
- [ ] El backend arranca correctamente con `mvn spring-boot:run`
- [ ] La base de datos `pettime` existe y conecta bien
- [ ] El frontend arranca con `npm start`
- [ ] El registro funciona
- [ ] El login funciona
- [ ] El listado de paseadores carga correctamente
- [ ] Se puede crear una reserva
- [ ] El paseador puede confirmar o completar una reserva
- [ ] El perfil del paseador se puede editar
- [ ] El pago simulado funciona

## 2. Capturas que hay que preparar
- [ ] Home
- [ ] Login
- [ ] Registro
- [ ] Listado de paseadores
- [ ] Reserva creada
- [ ] Reservas gestionadas
- [ ] Edición del perfil del paseador
- [ ] Pruebas de API en Postman o Thunder Client

## 3. Documentación
- [ ] Revisar `informe.md`
- [ ] Revisar `ANEXOS.md`
- [ ] Revisar `backend/TESTING.md`
- [ ] Añadir citas dentro del texto final
- [ ] Formatear la bibliografía con el estilo que pida el centro
- [ ] Mover capturas al apartado de anexos
- [ ] Revisar ortografía y formato final

## 4. Defensa
- [ ] Explicar el objetivo del proyecto en menos de 1 minuto
- [ ] Justificar Angular frente a React
- [ ] Justificar Spring Boot frente a Node
- [ ] Explicar JWT y BCrypt de forma simple
- [ ] Explicar arquitectura general
- [ ] Mostrar un flujo completo: registro/login -> reserva -> gestión
- [ ] Comentar mejoras futuras sin vender humo

## 5. Cierre del repositorio
- [ ] Revisar archivos modificados
- [ ] Hacer commit final
- [ ] Hacer push al repositorio
- [ ] Dejar una versión estable lista para enseñar

## 6. Qué decir si el tutor pregunta por limitaciones
- Es un MVP académico, no un producto final de producción.
- Tiene seguridad base correcta, pero faltan mejoras como refresh tokens o permisos más detallados.
- Tiene testing manual documentado, aunque no una batería automatizada completa.
- La arquitectura es suficientemente buena para el nivel de 2º de DAW y permite crecer.
