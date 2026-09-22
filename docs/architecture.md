# Arquitectura de AYNI Twin

## Recorrido del MVP

```text
Docente
   │
   ▼
Next.js en AWS Amplify Hosting
   │  HTTPS / JSON
   ▼
Amazon API Gateway (HTTP API)
   │
   ▼
AWS Lambda · Node.js 22
   ├── Amazon DynamoDB · perfiles, escenarios, planes e intervenciones
   ├── Amazon Bedrock · borrador estructurado del plan de apoyo
   └── Amazon CloudWatch · trazas técnicas y métricas
```

El frontend intenta leer la API configurada en `NEXT_PUBLIC_API_URL`. Si la API no está configurada, se demora más de cuatro segundos o devuelve un error, conserva el conjunto sintético local. Esta decisión evita que un fallo de red interrumpa la demostración.

## Modelo de almacenamiento

AYNI Twin usa una sola tabla DynamoDB para mantener pequeño el MVP:

| Entidad | PK | SK |
| --- | --- | --- |
| Estudiante | `STUDENT#{id}` | `PROFILE` |
| Escenario | `STUDENT#{id}` | `SCENARIO#{fecha}#{id}` |
| Plan | `STUDENT#{id}` | `PLAN#{fecha}#{id}` |
| Intervención | `INTERVENTION#{id}` | `DETAIL` |

La tabla usa cobro por solicitud, cifrado administrado por AWS y recuperación a un punto en el tiempo. El volumen del demo es intencionalmente pequeño; los `Scan` de estudiantes e impacto deben sustituirse por índices cuando el producto deje de ser un prototipo.

## Contrato con Bedrock

La Lambda envía únicamente los indicadores sintéticos necesarios y solicita JSON con un objetivo y entre tres y cinco acciones. La respuesta se valida antes de guardarse. Si el modelo falla, devuelve contenido no válido o no está habilitado en la región, se usa un plan determinista de respaldo.

Toda salida mantiene tres reglas:

1. Se presenta como borrador.
2. Requiere aprobación del docente.
3. No formula diagnósticos ni predicciones deterministas.

## Seguridad y operación

- CORS se limita al origen configurado durante el despliegue.
- La Lambda solo puede operar sobre la tabla del stack e invocar el modelo configurado.
- No hay claves ni secretos en el repositorio.
- Los logs son JSON y no incluyen cuerpos, perfiles completos ni prompts.
- API Gateway y Lambda conservan logs durante 14 días.
- DynamoDB mantiene los datos si el stack se elimina accidentalmente.

Antes de un uso real se deben añadir autenticación, autorización por institución, consentimiento, retención de datos, auditoría y cifrado con claves administradas por la organización.
