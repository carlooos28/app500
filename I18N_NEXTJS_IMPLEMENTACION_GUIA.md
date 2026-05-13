# Cómo implementar lo solicitado (i18n en Next.js) de forma práctica

## 1) Traer el repositorio correcto al entorno

Actualmente este repo no contiene la app Next.js. Para poder implementar i18n real, primero debes trabajar sobre el código de `DevMGcode/WC` en la rama `fit`.

```bash
git clone --branch fit https://github.com/DevMGcode/WC.git wc-fit
cd wc-fit
```

## 2) Verificar rápidamente que sí es una app Next.js

```bash
ls -la
cat package.json
```

Debes confirmar al menos:
- `package.json`
- scripts de build/lint
- estructura `app/` (App Router) o `pages/` (Pages Router)

## 3) Instalar `next-intl`

```bash
npm install next-intl
```

## 4) Definir configuración centralizada de idiomas

Crea `src/i18n/locales.ts` (o `i18n/locales.ts` si no existe `src`):

```ts
export const locales = ['es', 'en', 'fr', 'de', 'pt', 'ru', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeMeta: Record<Locale, {label: string; dir: 'ltr' | 'rtl'}> = {
  es: {label: 'Español', dir: 'ltr'},
  en: {label: 'English', dir: 'ltr'},
  fr: {label: 'Français', dir: 'ltr'},
  de: {label: 'Deutsch', dir: 'ltr'},
  pt: {label: 'Português', dir: 'ltr'},
  ru: {label: 'Русский', dir: 'ltr'},
  ar: {label: 'العربية', dir: 'rtl'}
};
```

## 5) Configurar routing con `next-intl`

`src/i18n/routing.ts`:

```ts
import {defineRouting} from 'next-intl/routing';
import {defaultLocale, locales} from './locales';

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale
});
```

`src/i18n/navigation.ts`:

```ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
```

`src/i18n/request.ts`:

```ts
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

## 6) Middleware de locales

`middleware.ts` (en raíz del proyecto):

```ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};
```

## 7) Estructura App Router recomendada

Si usa App Router, mover páginas a `app/[locale]/...` y envolver con provider:

`src/app/[locale]/layout.tsx`:

```tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {localeMeta} from '@/i18n/locales';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} dir={localeMeta[locale].dir}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## 8) Archivos de traducción

Crear:
- `src/messages/es.json`
- `src/messages/en.json`
- `src/messages/fr.json`
- `src/messages/de.json`
- `src/messages/pt.json`
- `src/messages/ru.json`
- `src/messages/ar.json`

Usa keys estables, por ejemplo:

```json
{
  "HomePage": {
    "title": "...",
    "description": "...",
    "cta": "..."
  }
}
```

## 9) Extraer textos hardcodeados

En páginas/componentes principales, reemplaza texto literal por `useTranslations`:

```tsx
import {useTranslations} from 'next-intl';

const t = useTranslations('HomePage');
return <h1>{t('title')}</h1>;
```

## 10) LanguageSwitcher manteniendo ruta actual

`src/components/LanguageSwitcher.tsx`:

```tsx
'use client';

import {ChangeEvent} from 'react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {locales, localeMeta, type Locale} from '@/i18n/locales';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    router.replace(pathname, {locale: nextLocale});
  };

  return (
    <label>
      <span className="sr-only">Language</span>
      <select aria-label="Language" value={locale} onChange={onChange}>
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeMeta[l].label}
          </option>
        ))}
      </select>
    </label>
  );
}
```

## 11) SEO y metadata

- `lang` y `dir` salen del locale actual desde `layout`.
- Si ya tienes metadata, usa traducciones por locale para title/description.
- Evita duplicaciones manuales de rutas; deja que el middleware/routing lo gestione.

## 12) Validación final

Ejecuta:

```bash
npm run lint
npm run build
npm run test   # solo si existe
npm run typecheck  # solo si existe
```

Si algún script no existe, revisa `package.json` y agréguelo solo si el proyecto lo requiere realmente.
