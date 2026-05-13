import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {routing} from '@/i18n/routing';
import {localeConfig, type AppLocale} from '@/i18n/locales';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const current = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({locale: current, namespace: 'HomePage'});

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const currentLocale = locale as AppLocale;

  return (
    <html lang={locale} dir={localeConfig[currentLocale].dir}>
      <body style={{margin: 0, fontFamily: 'Arial, sans-serif'}}>
        <NextIntlClientProvider messages={messages}>
          <header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              background: '#ffffff',
              borderBottom: '1px solid #e5e7eb',
              padding: '0.75rem 1rem'
            }}
          >
            <div style={{width: '100%', maxWidth: '1024px', margin: '0 auto'}}>
              <LanguageSwitcher />
            </div>
          </header>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
