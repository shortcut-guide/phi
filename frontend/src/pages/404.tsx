import { useRouter } from 'next/router';
import DefaultLayout from '@/f/layouts/DefaultLayout';
import { messages } from '@/f/config/messageConfig';

export default function NotFoundPage() {
  const router = useRouter();
  const lang = router.asPath.split('/')[1] || 'ja';
  const t = (messages.notFoundPage as any)[lang] ?? (messages.notFoundPage as any)['ja'] ?? {};
  return (
    <DefaultLayout lang={lang} title={t.title}>
      <section>
        <h1>{t.heading}</h1>
        <p className="size-20">{t.description}</p>
        <a className="button color-secondary" href={`/${lang}`}>{t.back}</a>
      </section>
    </DefaultLayout>
  );
}