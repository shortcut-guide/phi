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
  const t = (messages.messagesPage as any)[lang] ?? {};

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

export const getStaticPaths: GetStaticPaths = async () => {
  // messages.privacyPolicyの言語一覧からpathsを生成
  const langs = Object.keys(messages.privacyPolicy);
  return {
    paths: langs.map(lang => ({ params: { lang } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const lang = typeof params?.lang === "string" ? params.lang : "en";
  const t = (messages.privacyPolicy as any)[lang] ?? {};
  return {
    props: { t, lang },
  };
};

export default PrivacyPolicyPage;
