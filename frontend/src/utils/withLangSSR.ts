// src/utils/withLangSSR.ts
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { detectLang } from "@/f/utils/langs";
import { messages } from "@/f/config/messageConfig";

// コア: ページごとの追加データ取得ロジックを渡せる形
export function withLangMessagesSSR(pageKey: string) {
  return async (ctx: GetServerSidePropsContext) => {
    const { params, req } = ctx;
    const lang = detectLang(
      typeof params?.lang === "string" ? params.lang : undefined,
      req.headers["accept-language"]
    );
    const t = (messages as any)[pageKey]?.[lang] ?? {};
    return { props: { lang, t } };
  };
}