# Despliegue estático de AYNI Twin

AYNI Twin se publica únicamente como sitio estático en AWS Amplify Hosting. Usa 30 perfiles sintéticos y cálculos locales en el navegador. No requiere login, persistencia ni otros servicios de AWS. La carpeta `infrastructure/` no forma parte de este despliegue.

## 1. Verificar el proyecto localmente

Desde la raíz del repositorio:

```powershell
npm ci
npm run lint
npm run typecheck
npm test
npm run build
Test-Path .\out\index.html
```

El último comando debe devolver `True`. `next.config.ts` debe mantener `output: "export"` e `images.unoptimized: true`. El directorio `out/` contiene el sitio publicado; no subas `node_modules/`, `.next/` ni `infrastructure/` como artefactos del sitio.

## 2. Publicar solo los archivos estáticos

En Amplify, elige una aplicación estática sin Git y el método de carga manual. Comprime **el contenido de `out/`**, de modo que `index.html` quede en la raíz del ZIP; no comprimas la carpeta `out/` como un nivel adicional. No configures variables de entorno ni protección por contraseña para esta demostración pública.

Si prefieres continuar con la conexión Git ya iniciada, detente antes de `Save and deploy` y confirma que Amplify tratará el artefacto como sitio estático y usará `out/`, no `.next/` ni un runtime SSR. La detección automática de Next.js puede proponer una configuración distinta.

Amplify Hosting puede generar cargos por compilación, almacenamiento y transferencia según la cuenta, créditos y uso. Revisa la pantalla de precios y tus límites antes de publicar; no asumas coste cero.

## 3. Comprobar la URL pública

Abre la URL de Amplify en una ventana privada y verifica:

- Cargan la portada, las imágenes y el icono de la pestaña.
- Se muestra `Modo demostración · Datos sintéticos`.
- Puedes abrir un estudiante, simular un futuro, crear un plan local y recorrer Impact Proof.
- La aplicación no afirma estar conectada a servicios AWS ni presenta resultados simulados como mediciones reales.

El despliegue termina cuando el recorrido completo funciona desde la URL pública sin iniciar sesión.
