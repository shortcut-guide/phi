import type { GetStaticPaths, GetStaticProps } from "next";
import DefaultLayout from '@/f/layouts/DefaultLayout';
import { messages } from "@/f/config/messageConfig";

type Section = {
  title: string;
  description: string;
};

type Props = {
  t: any;
  lang: string;
};

const PrivacyPolicyPage = ({ lang }: Props) => {
  const t = (messages.sale as any)[lang] ?? {};

  return (
    <DefaultLayout lang={lang} title={t.title}>
      <div>
        <h1 className="text-4xl font-bold">{t.heading}</h1>
        <p>{t.description}</p>
        {t.sections &&
          Object.entries(t.sections).map(([key, section]) => (
            <section key={key}>
              <h2 className="text-2xl font-semibold">{(section as Section).title}</h2>
              <p>{(section as Section).description}</p>
            </section>
          ))}
      </div>
    </DefaultLayout>
  );
};

export default PrivacyPolicyPage;
