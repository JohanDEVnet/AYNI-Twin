# IA responsable en AYNI Twin

AYNI Twin es una herramienta de priorización y apoyo docente. No es un sistema de diagnóstico, disciplina, admisión ni calificación automática.

## Alcance del demo

- Los 30 nombres y todos los registros son sintéticos.
- El riesgo es una señal transparente calculada con asistencia, evolución del promedio y actividades pendientes.
- Amazon Bedrock solo redacta un borrador de intervención a partir de un escenario ya revisado por el docente.
- La aprobación humana es obligatoria antes de presentar evidencia de impacto.

## Controles implementados

| Riesgo | Control del MVP |
| --- | --- |
| Automatización excesiva | Etiqueta de borrador y aprobación docente explícita |
| Respuesta inválida del modelo | Validación de estructura y fallback determinista |
| Lenguaje dañino o determinista | Prompt restrictivo, aviso visible y revisión humana |
| Exposición en logs | No se registran cuerpos, perfiles completos ni prompts |
| Caída del proveedor | Datos y plan local de respaldo |
| Confusión entre estimación y hecho | Impact Proof separa riesgo inicial, estimado y observado |

## Límites conocidos

La fórmula no ha sido validada con datos reales ni auditada para equidad. Los pesos sirven para demostrar el flujo y no deben utilizarse para tomar decisiones sobre estudiantes. Antes de un piloto real se requiere evaluación con educadores, estudiantes y familias; análisis de sesgos; explicación accesible; mecanismo de apelación; y revisión legal de privacidad y protección de menores.

## Regla de producto

La IA propone; el docente comprende, modifica, aprueba y responde por la intervención. Ningún resultado se presenta como destino inevitable del estudiante.
