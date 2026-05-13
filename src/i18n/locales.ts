export const locales = ['es', 'en', 'fr', 'de', 'pt', 'ru', 'ar'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'es';

export const localeConfig: Record<
  AppLocale,
  {label: string; dir: 'ltr' | 'rtl'; flag: string; displayName: string}
> = {
  es: {label: 'Español', displayName: 'Español', dir: 'ltr', flag: '🇪🇸'},
  en: {label: 'English', displayName: 'Inglés', dir: 'ltr', flag: '🇺🇸'},
  fr: {label: 'Français', displayName: 'Francés', dir: 'ltr', flag: '🇫🇷'},
  de: {label: 'Deutsch', displayName: 'Alemán', dir: 'ltr', flag: '🇩🇪'},
  pt: {label: 'Português', displayName: 'Portugués', dir: 'ltr', flag: '🇵🇹'},
  ru: {label: 'Русский', displayName: 'Ruso', dir: 'ltr', flag: '🇷🇺'},
  ar: {label: 'العربية', displayName: 'Árabe', dir: 'rtl', flag: '🇸🇦'}
};
