import React from "react";
import type { ReactNode } from "react";
import DefaultLayout from '@/f/layouts/DefaultLayout';
import Home from '@/f/components/home';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";

// SSR: ログ＆安全props返却
export const getServerSideProps = withLangMessagesSSR("index", async (ctx) => {
  if (ctx.req) {
    console.log("SSR: index.tsx", ctx.req.url, ctx.params);
  }
  // ここでデータ取得やfetch失敗時も必ずprops返却
  try {
    // 必要ならデータ取得ロジックを挟む
    return { props: {} };
  } catch {
    return { props: {} };
  }
});

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