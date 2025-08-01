import React from "react";
import type { ReactNode } from "react";
import Home from '@/f/components/home';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";

// SSR: ログ＆安全props返却
export const getServerSideProps = withLangMessagesSSR("index");

type Props = {
  lang: string;
}

const Index = ({ lang }: Props) => (
  <Home lang={lang} />
);

export default Index;