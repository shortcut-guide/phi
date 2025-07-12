import DefaultLayout from '@/f/layouts/DefaultLayout';
import { messages } from "@/f/config/messageConfig";

type TermsSection = {
  heading: string;
  content: string;
};

type Props = {
  lang: string;
};

const TermsPage = ({ lang }: Props) => {
  const t = (messages.terms as any)[lang] ?? {};

  return (
    <DefaultLayout lang={lang} title={t.title}>
      <main className="max-w-3xl mx-auto px-4 py-12 text-neutral-800">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>

        {((t.sections ?? []) as TermsSection[]).map((section, idx) => (
          <section className="mt-10 space-y-4" key={idx}>
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        <p className="text-sm text-neutral-500 mt-12">{t.lastUpdated}</p>
      </main>
    </DefaultLayout>
  );
};

export default TermsPage;
