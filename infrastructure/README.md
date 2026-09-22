# Infraestructura AWS de AYNI Twin

Esta carpeta contiene un backend reproducible con AWS SAM:

- Amazon API Gateway HTTP API para ocho rutas del MVP.
- Una función AWS Lambda en Node.js 22.
- Una tabla Amazon DynamoDB con cifrado, recuperación continua y cobro por solicitud.
- Amazon Bedrock mediante `Converse`, con plan local de respaldo cuando el modelo no está disponible.
- Logs JSON en CloudWatch con retención de 14 días y sin registrar cuerpos de solicitudes.

## Despliegue

Requisitos locales: AWS CLI, AWS SAM CLI y una sesión autenticada.

```bash
cd infrastructure
sam build
sam validate --lint
sam deploy --guided
```

Durante `sam deploy --guided`, configura `AllowedOrigin` con el dominio real del frontend. El valor de salida `ApiUrl` se usa como `NEXT_PUBLIC_API_URL`.

Después del primer despliegue, carga los 30 perfiles sintéticos (el comando usa las credenciales AWS de tu sesión):

```bash
cd infrastructure/functions/api
npm install
$env:TABLE_NAME="nombre-devuelto-por-el-stack"
node seed.mjs
```

## Rutas

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/students` | Lista estudiantes sintéticos |
| GET | `/students/{id}` | Obtiene el Student Twin |
| POST | `/students/{id}/scenarios` | Guarda una simulación |
| GET | `/students/{id}/scenarios` | Lista simulaciones |
| POST | `/students/{id}/intervention-plan` | Genera un borrador con Bedrock o fallback |
| POST | `/interventions` | Inicia un plan aprobado |
| PATCH | `/interventions/{id}` | Registra el resultado observado |
| GET | `/impact` | Resume la evidencia de impacto |

## Protección de datos

El MVP usa exclusivamente nombres y registros sintéticos. La Lambda registra identificadores técnicos, ruta, estado y tipo de error; nunca registra el cuerpo completo ni el prompt. La respuesta de IA siempre se marca como borrador y requiere revisión humana.
