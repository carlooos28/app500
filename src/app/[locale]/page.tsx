import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main style={{padding: '2rem 1rem', maxWidth: '1024px', margin: '0 auto'}}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button type="button">{t('cta')}</button>
    </main>
  );
}
