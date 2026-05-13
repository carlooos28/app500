'use client';

import {useLocale} from 'next-intl';
import {ChangeEvent} from 'react';
import {useSearchParams} from 'next/navigation';
import {usePathname, useRouter} from '@/i18n/navigation';
import {AppLocale, localeConfig, locales} from '@/i18n/locales';

export default function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as AppLocale;
    const queryString = searchParams.toString();
    const nextPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextPath, {locale: nextLocale});
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: '1rem'
      }}
    >
      <label style={{display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%', maxWidth: '260px'}}>
        <span style={{fontSize: '0.875rem', color: '#333'}}>Idioma</span>
        <select
          aria-label="Selector de idioma"
          value={locale}
          onChange={handleChange}
          style={{
            width: '100%',
            border: '1px solid #d0d5dd',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            backgroundColor: '#fff'
          }}
        >
          {locales.map((item) => (
            <option key={item} value={item}>
              {`${localeConfig[item].flag} ${localeConfig[item].displayName}`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
