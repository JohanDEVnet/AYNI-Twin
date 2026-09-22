# Arquitectura actual de AYNI Twin

La versión pública es una exportación estática de Next.js alojada en AWS Amplify Hosting. La página y sus recursos se entregan como HTML, CSS, JavaScript e imágenes; las interacciones usan únicamente datos sintéticos y cálculos deterministas en el navegador.

```text
AWS Amplify Hosting (archivos de out/)
  └── Navegador
      ├── 30 perfiles sintéticos de src/data/
      ├── riesgo y escenarios de src/lib/
      ├── plan editable local
      └── seguimiento hipotético de Impact Proof
```

No hay autenticación, API activa, base de datos ni persistencia. Una recarga restablece las acciones de la sesión. No se debe introducir información real de estudiantes.

## Prototipo histórico no desplegado

`infrastructure/` y `src/lib/api.ts` conservan código de una exploración técnica anterior. No están conectados a la aplicación pública ni forman parte del despliegue estático. El [diagrama de arquitectura actual](../public/img/AYNI-AWS-Architecture.svg) muestra únicamente navegador, Amplify Hosting y aplicación estática.

Un uso institucional real requeriría una evaluación independiente de privacidad, seguridad, accesibilidad, validez y supervisión humana. Ese trabajo no forma parte de esta entrega.
