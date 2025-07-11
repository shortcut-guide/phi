import { useRouter } from 'next/router';
import DefaultLayout from '@/f/layouts/DefaultLayout';
import { messages } from '@/f/config/messageConfig';
type Props = {
  lang: string;
};
export default function NotFoundPage({ lang }: Props) {
  const router = useRouter();
  const t = (messages.notFoundPage as any)[lang] ?? {};
  return (
    <DefaultLayout lang={lang} title={t.title}>
      <section>
        <h1>{t.heading}</h1>
        <p className="size-20">{t.description}</p>
        <a className="button color-secondary" href="/">{t.back}</a>
      </section>
    </DefaultLayout>
  );
}
