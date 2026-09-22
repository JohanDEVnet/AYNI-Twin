# AYNI Twin

**Simulating Better Futures for Students**

AYNI Twin es una aplicación educativa de demostración para el hackathon AWS “Zero to Shipped”. Ayuda a explorar señales académicas, comparar escenarios y preparar un plan de apoyo para revisión docente. No diagnostica ni predice el futuro de un estudiante.

## Alcance de esta entrega

- Sitio estático construido con Next.js 16, React 19 y TypeScript.
- Treinta perfiles ficticios y datos completamente sintéticos.
- Cálculos deterministas y simulaciones ejecutados en el navegador.
- Planes y aprobaciones locales, sin persistencia ni inicio de sesión.
- Impacto mostrado como ejemplo simulado, no como resultado medido en estudiantes reales.
- Despliegue únicamente en AWS Amplify Hosting como contenido estático.

La carpeta `infrastructure/` permanece como trabajo técnico del repositorio, pero **no se despliega ni forma parte de esta aplicación publicada**. Esta entrega no utiliza Lambda, API Gateway, DynamoDB, Bedrock, bases de datos ni otros servicios de AWS.

## Recorrido

1. **Panorama:** identifica trayectorias que requieren atención mediante una estimación explicable.
2. **Student Twin:** presenta los factores y tendencias de cada perfil ficticio.
3. **Future Lab:** compara escenarios e intervenciones configurables.
4. **Plan de apoyo:** crea un borrador local para que un docente lo revise y apruebe.
5. **Impact Proof:** compara la estimación con un resultado también simulado.

La fórmula de riesgo de demostración es:

```text
riskScore = attendanceRisk × 0.40 + gradeRisk × 0.35 + assignmentRisk × 0.25
```

Los porcentajes son supuestos de diseño para explorar decisiones; no son probabilidades científicas ni diagnósticos.

## Desarrollo local

Requisitos: Node.js 20 o superior y npm.

```powershell
npm ci
npm run dev
```

Abre `http://localhost:3000`. No necesitas credenciales ni variables de entorno.

## Verificación y publicación

```powershell
npm run lint
npm run typecheck
npm test
npm run build
Test-Path .\out\index.html
```

El build debe crear `out/`. Publica exclusivamente esos archivos como sitio estático en Amplify. Consulta [el runbook de despliegue](docs/deployment-runbook.md) antes de activar opciones que puedan generar costos.

## Uso responsable

El rótulo **«Modo demostración · Datos sintéticos»** debe permanecer visible. No introduzcas datos reales de estudiantes: esta versión no incluye autenticación, controles institucionales ni almacenamiento seguro para ellos.
