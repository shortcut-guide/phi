import React from "react";
import type { ReactNode } from "react";
import DefaultLayout from '@/f/layouts/DefaultLayout';
import Home from '@/f/components/home';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";

// SSR: ログ＆安全props返却
export const getServerSideProps = withLangMessagesSSR("index");

type Props = {
  lang: string;
  t?: any;
}

const Index = ({ lang, t }: Props) => (
  <DefaultLayout lang={lang} title={typeof t?.title === "string" ? t.title : ""}>
    <Home lang={lang} />
  </DefaultLayout>
);

export default Index;