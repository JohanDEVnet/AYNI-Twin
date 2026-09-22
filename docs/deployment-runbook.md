# Runbook de despliegue y verificación

Este procedimiento evita publicar una demo parcialmente conectada y mantiene separadas las credenciales de los artefactos del proyecto.

## 1. Comprobaciones locales

Desde la raíz:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Desde `infrastructure/functions/api`:

```powershell
npm test
```

Desde `infrastructure`:

```powershell
sam validate --lint
sam build
```

## 2. Confirmar la sesión AWS

```powershell
aws sts get-caller-identity
aws configure get region
```

Antes de usar una captura públicamente, oculta el ID de cuenta y cualquier ARN identificable. No copies credenciales en archivos del repositorio.

Antes del primer despliegue también se debe confirmar la región, el modelo de Bedrock disponible y el presupuesto permitido para la demo.

## 3. Desplegar el backend

```powershell
cd infrastructure
sam deploy --guided
```

Valores recomendados:

- Stack: `ayni-twin-demo`
- Stage: `demo`
- Region: la región elegida para Bedrock
- AllowedOrigin: primero `http://localhost:3000`; después, el dominio público exacto
- BedrockModelId: un modelo habilitado en la región elegida

Conserva los outputs `ApiUrl`, `TableName` y `FunctionName`. Los nombres de recursos pueden aparecer en evidencia privada, pero deben ocultarse si revelan el ID de cuenta.

## 4. Cargar datos sintéticos

```powershell
cd infrastructure/functions/api
$env:TABLE_NAME="<TableName>"
node seed.mjs
```

La semilla solo contiene los treinta perfiles ficticios incluidos en el repositorio.

## 5. Conectar y verificar el frontend

Crea `.env.local` sin versionarlo:

```text
NEXT_PUBLIC_API_URL=<ApiUrl sin barra final>
```

Reinicia el frontend y comprueba:

- El encabezado indica `AWS sincronizado`.
- La lista contiene 30 estudiantes.
- Future Lab guarda un escenario.
- El plan informa `Borrador generado con Amazon Bedrock` o el fallback validado.
- Aprobar el plan registra una intervención y habilita Impact Proof.
- Un error temporal de red conserva el recorrido local.

## 6. Publicar el frontend

Conecta el repositorio a AWS Amplify Hosting, configura `NEXT_PUBLIC_API_URL` como variable del build y publica la rama de entrega. Después actualiza `AllowedOrigin` con el dominio exacto de Amplify y vuelve a desplegar el stack.

## 7. Evidencia obligatoria

Guarda en `screenshots/` versiones preparadas para publicación de:

1. Agente trabajando en el repositorio.
2. `aws sts get-caller-identity` con identificadores ocultos.
3. Resultado de `sam deploy`.
4. Recursos desplegados en AWS.
5. Logs recientes en CloudWatch.
6. Dashboard, Student Twin, Future Lab, Plan e Impact Proof.
7. URL pública abierta en una ventana privada.

Registra fecha, comando y resultado en `docs/agent-evidence.md`. Nunca incluyas secretos, cookies, tokens o credenciales.

## 8. Criterio de cierre

La fase termina únicamente cuando la URL pública funciona sin autenticación, el encabezado confirma AWS, CloudWatch recibe logs y el recorrido completo puede repetirse desde una ventana privada.
