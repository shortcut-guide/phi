import Head from "next/head";
import DefaultLayout from '@/f/layouts/DefaultLayout';
import FaqSection from "@/f/components/FaqSection";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const HelpPage = ({ lang }: Props) => {
  const t = (messages.help as any)[lang] ?? {};

  return (
    <DefaultLayout lang={lang} title={t.title}>
        <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
        <FaqSection lang={lang} />
    </DefaultLayout>
  );
};

export default HelpPage;
