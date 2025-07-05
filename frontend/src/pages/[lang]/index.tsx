import React from "react";
import type { ReactNode } from "react";
import DefaultLayout from '@/f/layouts/DefaultLayout';
import Index from '@/f/components/Index';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";
export const getServerSideProps = withLangMessagesSSR("index");

type Props = {
  lang: string;
  t?: any;
}

const Home = ({ lang, t }: Props) => (
  <DefaultLayout lang={lang} title={t.title}>
    <Index />
  </DefaultLayout>
);

export default Home;
