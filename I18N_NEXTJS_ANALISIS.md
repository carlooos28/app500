# Análisis técnico y bloqueo para implementación i18n

## Resultado del análisis inicial

Se revisó el contenido actual del repositorio local (`/workspace/app500`) y **no corresponde a una aplicación Next.js**.

Estructura encontrada:
- `index.html`
- `123.html`
- `estilos.css`
- archivos vacíos (`index11.html`, `index33.html`, `backend`)

No se encontraron:
- `package.json`
- `next.config.*`
- `src/app` o `pages`
- TypeScript (`tsconfig.json`)
- dependencias de `next-intl` o cualquier setup i18n de Next.js

## Impacto

Con el estado actual del repositorio no es posible implementar de forma real:
- rutas localizadas `/es`, `/en`, `/fr`, `/de`, `/pt`, `/ru`, `/ar`
- middleware de Next.js
- `next-intl`
- `LanguageSwitcher` integrado con enrutado de Next
- validaciones `npm run lint/build/test/typecheck`

Porque la base de ejecución de Next.js no existe en este repo.

## Recomendación para desbloquear

1. Proveer el código real de la app Next.js en este repositorio, o
2. Compartir acceso al repositorio correcto y su rama objetivo, o
3. Autorizar la importación del proyecto indicado (`https://github.com/DevMGcode/WC/tree/fit`) dentro de este entorno de trabajo.

## Plan exacto apenas esté la app Next.js

1. Detectar App Router vs Pages Router.
2. Reutilizar i18n existente o integrar `next-intl` (preferencia).
3. Crear configuración centralizada de locales (incluyendo `dir`).
4. Implementar middleware + routing localizado con `defaultLocale = "es"`.
5. Agregar `messages/{es,en,fr,de,pt,ru,ar}.json`.
6. Extraer textos hardcodeados visibles principales.
7. Implementar `LanguageSwitcher` accesible manteniendo ruta actual.
8. Asegurar `lang` y `dir` correctos (`ar` = `rtl`).
9. Ejecutar y corregir: `npm run lint`, `npm run build`, `npm run test` (si existe), `npm run typecheck` (si existe).
