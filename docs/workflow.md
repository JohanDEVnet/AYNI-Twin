# Flujo de trabajo de AYNI Twin

Este documento define cómo se construirá AYNI Twin para la hackathon. Cada fase debe quedar revisada y verificable antes de avanzar a la siguiente.

## Principios de trabajo

1. Construir primero el recorrido central: detectar, comprender, simular, intervenir y medir.
2. Trabajar una fase a la vez.
3. Revisar visualmente cada pantalla antes de conectar infraestructura.
4. Mantener el producto demostrable al terminar cada fase importante.
5. No agregar funciones opcionales antes de completar el MVP.
6. Registrar decisiones, comandos y evidencia del agente desde el inicio.

## Fase 1 — Dirección del producto y diseño

Estado: en definición.

Entregables:

- Dirección visual única.
- Paleta, tipografía, espaciado y componentes base.
- Arquitectura de información de las cinco pantallas.
- Wireframe del recorrido principal.
- Reglas de accesibilidad y diseño responsive.

Criterio para avanzar:

- La interfaz tiene identidad propia y no parece una plantilla administrativa genérica.
- El recorrido completo puede explicarse en menos de tres minutos.
- La dirección visual ha sido aprobada antes de escribir la interfaz final.

## Fase 2 — Base técnica y datos sintéticos

Entregables:

- Next.js con App Router y TypeScript.
- Sistema visual implementado como tokens reutilizables.
- Navegación y layout responsive.
- Treinta estudiantes sintéticos.
- Modelo de riesgo determinista con pruebas.

Criterio para avanzar:

- Lint, typecheck, pruebas y build terminan correctamente.
- La distribución de riesgo coincide con el plan maestro.

## Fase 3 — Recorrido demostrable local

Entregables:

- Impact Dashboard.
- Student Twin.
- Future Lab con controles interactivos.
- Comparación de tres escenarios.
- Intervention Plan con respuesta local de respaldo.
- Impact Proof.

Criterio para avanzar:

- El recorrido de Ana puede demostrarse de principio a fin sin AWS.
- La experiencia funciona en escritorio y móvil.

## Fase 4 — Backend e integración AWS

Entregables:

- API Gateway y Lambda.
- DynamoDB.
- Amazon Bedrock con salida estructurada y fallback.
- CloudWatch.
- Infraestructura reproducible.

Criterio para avanzar:

- El frontend consume la API desplegada.
- Los errores se manejan sin romper la demostración.
- No existen secretos ni datos personales en el repositorio o los logs.

## Fase 5 — Despliegue y evidencia

Entregables:

- Aplicación pública en AWS.
- Modo demo accesible.
- Evidencia del agente conectado a AWS.
- Diagrama de arquitectura.
- README y documentación de IA responsable.

Criterio para avanzar:

- La URL funciona desde una ventana privada.
- CloudWatch recibe logs.
- El recorrido principal puede completarse sin asistencia técnica.

## Fase 6 — Presentación y entrega

Entregables:

- Video de aproximadamente 2 minutos y 30 segundos.
- Publicación en Builder Center.
- Capturas finales.
- Revisión de requisitos y envío.

Criterio de cierre:

- Todos los criterios de aceptación del plan maestro están verificados.

## Regla de control

Al cerrar cada fase se registrará:

- Qué se completó.
- Qué se verificó.
- Qué decisiones tomó Johan.
- Qué queda pendiente.
- Si existe algún riesgo para la fecha de entrega.

