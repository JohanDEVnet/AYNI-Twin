# Evidencia del agente de programación

Este registro documenta cómo el agente participa en la construcción y el posterior despliegue de AYNI Twin. No debe incluir credenciales, tokens ni identificadores sensibles.

## 19 de septiembre de 2026 — Inicio del proyecto

### Trabajo realizado por el agente

- Leyó el plan maestro y lo convirtió en un flujo por fases.
- Definió con Johan una dirección visual clara y no genérica.
- Creó un wireframe navegable de las cinco etapas.
- Inicializó Next.js, TypeScript y Tailwind CSS.
- Implementó un sistema visual sin tema oscuro ni iconografía típica de IA.
- Implementó el motor de riesgo determinista y explicable.
- Creó treinta estudiantes sintéticos.
- Añadió pruebas para la fórmula, los límites y la distribución de riesgo.
- Implementó Student Twin con factores explicables y una trayectoria reciente.
- Implementó Future Lab con cinco controles y tres escenarios comparables.
- Verificó el recálculo interactivo, el diseño móvil y la ausencia de errores de consola.
- Integró el logotipo, el símbolo de aplicación y las ilustraciones proporcionadas en `public/img`.
- Implementó un plan editable con aprobación humana y fallback local de Bedrock.
- Implementó Impact Proof y verificó el bloqueo previo a la aprobación.

### Decisiones revisadas por Johan

- Construir el proyecto mediante fases verificables.
- Utilizar una interfaz completamente clara.
- Evitar negro puro, degradados genéricos e iconografía típica de IA.
- Dar a AYNI Twin una identidad basada en trayectorias y reciprocidad andina.

### Evidencia visual pendiente

- Captura del repositorio abierto en el agente.
- Captura del primer dashboard ejecutándose localmente.
- Capturas de Dashboard, Student Twin, Future Lab, Plan de intervención e Impact Proof.
- Conexión segura a AWS, infraestructura, despliegue y logs.

### Seguridad

- Todos los estudiantes son ficticios.
- No se han creado ni almacenado credenciales.
- Todavía no se conectó ningún servicio de AWS.
# Evidencia de trabajo del agente

## 20 de septiembre de 2026 · Fase 4

- Se verificó en el navegador que las ilustraciones del docente y de estudiantes están expuestas con texto alternativo.
- El build de Next.js confirmó la ruta estática `/icon.png` para el favicon.
- Se creó infraestructura como código en `infrastructure/template.yaml`.
- Se implementaron API, persistencia, integración Bedrock, fallback y semilla sintética.
- Se conectó el frontend a una API opcional conservando el modo demo local.
- Se ejecutaron 15 pruebas, typecheck, lint y validación de sintaxis JavaScript sin errores.
- Se diseñó y revisó visualmente un loader claro y futurista basado en trayectorias, con estado accesible y reducción de movimiento.
- Se añadió una transición de análisis de 1.5 segundos al pasar entre módulos, con mensajes propios de cada fase.
- Impact Proof se rediseñó como una lectura completa de evidencia: resumen, curva estimado/observado, anillo de cumplimiento, barras comparativas, atribución orientativa e hitos.
- La transición y la nueva pantalla de Impacto se recorrieron en el navegador después de aprobar el plan sintético.
- Se implementó y revisó el encabezado institucional, el selector de periodo, el estado de datos y el panel de actividad.
- La búsqueda fue verificada con una consulta sin coincidencias y recuperación mediante “Limpiar filtros”.
- Los filtros conservan su estado al navegar entre módulos.
- AWS CLI 2.36.49 y AWS SAM CLI 1.164.0 quedaron instalados.
- `sam validate --lint` confirmó que la plantilla es válida.
- `sam build` construyó correctamente el artefacto Lambda para `nodejs22.x`/ARM64.
- No existe aún un perfil AWS local; no se simuló un despliegue inexistente.
- Se conectó el recorrido completo del frontend con las rutas de escenario, generación de plan y aprobación de intervención.
- Cada escritura conserva un fallback local explícito; la interfaz distingue entre Bedrock, AWS y respaldo local.
- Se verificó en navegador la transición de análisis, la generación local, la aprobación y el desbloqueo de Impact Proof.
- Se preparó un README de entrega y un runbook reproducible para desplegar, sembrar, verificar y capturar evidencia sin publicar identificadores sensibles.
- Se creó un entorno local aislado e ignorado por Git para no depender de la instalación global incompleta.
- AWS CLI 1.46.1 confirmó que no existen credenciales configuradas en la sesión actual.
- AWS SAM CLI 1.166.2 volvió a aprobar `sam validate --lint` y completó `sam build` con artefactos en `infrastructure/.aws-sam/build`.
- No se ejecutó `sam deploy`: crear recursos requiere primero autenticar la cuenta y confirmar región y presupuesto.
- Se creó un diagrama visual propio de la arquitectura AWS, sin iconografía genérica de IA.
- Se prepararon el guion cronometrado del video y el texto en inglés para AWS Builder Center, manteniendo los enlaces públicos como pendientes verificables.
- Se completaron los indicadores obligatorios de planes activos y tiempo recuperado sin aumentar innecesariamente la densidad visual.
- Se añadió y revisó en navegador un panel de privacidad y uso responsable con cierre por Escape y devolución de foco.
