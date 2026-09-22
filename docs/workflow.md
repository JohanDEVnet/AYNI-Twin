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

Estado: completada.

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

Estado: completada el 19 de septiembre de 2026.

Entregables:

- Next.js con App Router y TypeScript.
- Sistema visual implementado como tokens reutilizables.
- Navegación y layout responsive.
- Treinta estudiantes sintéticos.
- Modelo de riesgo determinista con pruebas.

Criterio para avanzar:

- Lint, typecheck, pruebas y build terminan correctamente.
- La distribución de riesgo coincide con el plan maestro.

Verificación realizada:

- Next.js 16, TypeScript y Tailwind CSS configurados.
- Sistema visual claro implementado.
- Dashboard responsive funcionando con 30 estudiantes sintéticos.
- Distribución confirmada: 14 casos bajos, 10 medios y 6 altos.
- Motor de riesgo cubierto por pruebas automatizadas.
- Lint, typecheck, pruebas y build de producción aprobados.
- Revisión visual aprobada en escritorio y 390 px sin desbordamiento horizontal.

## Fase 3 — Recorrido demostrable local

Estado: completada el 19 de septiembre de 2026.

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

Avance verificado el 19 de septiembre de 2026:

- Impact Dashboard conectado con Student Twin.
- Student Twin muestra factores, componentes y trayectoria reciente.
- Future Lab permite modificar cinco intervenciones.
- Comparación dinámica de tres escenarios implementada.
- Línea de futuros y valores accesibles actualizados en tiempo real.
- Simulación cubierta por pruebas automatizadas.
- Recorrido revisado en escritorio y 390 px sin desbordamiento horizontal.

- Intervention Plan implementado con fallback local, edición y aprobación docente.
- Impact Proof implementado con comparación entre estimación y resultado observado.
- El acceso a Impact Proof permanece bloqueado hasta aprobar el plan.
- Recorrido completo verificado de principio a fin.
- Logotipo, símbolo e ilustraciones de `public/img` integrados al sistema.
- Sesión limpia sin errores de consola y diseño móvil sin desbordamiento horizontal.

## Fase 4 — Backend e integración AWS

Estado: en progreso desde el 20 de septiembre de 2026.

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

Avance verificado el 20 de septiembre de 2026:

- Plantilla AWS SAM creada con API Gateway HTTP API, Lambda Node.js 22, DynamoDB y CloudWatch.
- Ocho rutas del MVP implementadas en una Lambda con validación de entradas.
- Integración Amazon Bedrock preparada con salida JSON validada y fallback determinista.
- Permisos IAM limitados a la tabla y al modelo configurados.
- Semilla reproducible para los mismos 30 perfiles sintéticos.
- Frontend preparado para consumir `NEXT_PUBLIC_API_URL` con respaldo local automático.
- Documentación de arquitectura e IA responsable agregada.
- Quince pruebas automatizadas aprobadas; lint, typecheck y build de Next.js aprobados.
- Las herramientas AWS quedaron disponibles en un entorno local aislado e ignorado por Git: AWS CLI 1.46.1 y AWS SAM CLI 1.166.2.
- Plantilla aprobada nuevamente por `sam validate --lint` y paquete Lambda construido por `sam build`.
- Loader inicial propio de AYNI integrado y revisado visualmente en el navegador.
- Transiciones de análisis contextual añadidas entre los cinco módulos del recorrido.
- Impact Proof ampliado con cuatro métricas, evolución temporal, cumplimiento del plan, indicadores antes/después, contribución por señal e hitos verificados.
- Encabezado institucional profesional con periodo académico, estado de sincronización y actividad reciente.
- Búsqueda por nombre/código, filtro persistente por grado y estado vacío recuperable.
- Desplegables nativos sustituidos por selectores propios, accesibles y coherentes con la identidad clara de AYNI.
- Densidad visual reducida: la actividad reciente usa una señal discreta y las confirmaciones se reservan para acciones importantes.
- Student Twin ampliado con vistas separadas de resumen, asignaturas y registro docente.
- Detalle por asignatura, tendencias breves, entregas pendientes y cronología de observaciones incorporados sin recargar la pantalla.
- Confirmaciones visuales para creación de escenario y aprobación del plan.
- Frontend conectado a creación de escenarios, generación de planes y registro de intervenciones mediante la API AWS.
- Procedencia del plan visible: Amazon Bedrock cuando responde y respaldo local cuando la API no está configurada.
- Runbook de despliegue y README de hackathon preparados sin atribuir un despliegue todavía inexistente.

Pendiente para cerrar la fase:

- Autenticar una cuenta AWS y elegir región.
- Confirmar el presupuesto permitido antes de crear recursos.
- Desplegar el stack y cargar la semilla.
- Configurar la URL real de la API en el frontend y verificar CloudWatch.

## Fase 5 — Despliegue y evidencia

Estado: preparada localmente; pendiente de autenticación y despliegue AWS.

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

Avance verificado el 20 de septiembre de 2026:

- README de hackathon y runbook de despliegue completados.
- Diagrama visual de arquitectura AWS creado y revisado en navegador.
- Guion cronometrado de 2 minutos y 30 segundos preparado.
- Texto en inglés para AWS Builder Center preparado con etiquetas obligatorias.
- Enlaces públicos conservados como pendientes para no registrar evidencia inexistente.

## Fase 6 — Presentación y entrega

Estado: preparación local en progreso; envío bloqueado hasta contar con URL pública.

Entregables:

- Video de aproximadamente 2 minutos y 30 segundos.
- Publicación en Builder Center.
- Capturas finales.
- Revisión de requisitos y envío.

Criterio de cierre:

- Todos los criterios de aceptación del plan maestro están verificados.

Avance verificado el 20 de septiembre de 2026:

- Dashboard completado con planes activos y tiempo estimado recuperado, agrupados sin saturar la interfaz.
- Panel accesible de privacidad y uso responsable incorporado dentro del producto.
- Navegación por teclado, cierre con Escape y devolución de foco verificados.
- Guion, arquitectura y texto de publicación listos para sustituir únicamente los enlaces finales.

## Regla de control

Al cerrar cada fase se registrará:

- Qué se completó.
- Qué se verificó.
- Qué decisiones tomó Johan.
- Qué queda pendiente.
- Si existe algún riesgo para la fecha de entrega.
