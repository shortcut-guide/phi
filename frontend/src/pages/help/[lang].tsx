import Head from "next/head";
import FaqSection from "@/f/components/FaqSection";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const HelpPage = ({ lang }: Props) => {
  const t = (messages.login as any)[lang] ?? {};

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <html lang={lang} />
      </Head>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
        <FaqSection />
      </main>
    </>
  );
};

export default HelpPage;
