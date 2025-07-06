// src/utils/withLangSSR.ts
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { detectLang } from "@/f/utils/langs";
import { messages } from "@/f/config/messageConfig";

// コア: ページごとの追加データ取得ロジックを渡せる形
export function withLangMessagesSSR(pageKey: string) {
  return async (ctx: GetServerSidePropsContext) => {
    try {
      const { params, req } = ctx;
      const lang = detectLang(
        typeof params?.lang === "string" ? params.lang : undefined,
        req.headers["accept-language"]
      );
      const t = (messages as any)[pageKey]?.[lang] ?? {};

      // 必須チェックなど
      if (!lang) throw new Error("lang not detected");
      if (!t) throw new Error("messages not found");

      return { props: { lang, t } };
    } catch (e) {
      console.error("SSR error:", e);
      return { notFound: true };
    }
  };
  
}