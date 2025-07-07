// src/utils/withLangSSR.ts
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { detectLang } from "@/f/utils/langs";

// コア: ページごとの追加データ取得ロジックを渡せる形
export function withLangMessagesSSR(pageKey: string) {
  return async (ctx: GetServerSidePropsContext) => {
    try {
      const { params, req } = ctx;
      const lang = detectLang(
        typeof params?.lang === "string" ? params.lang : undefined,
        req.headers["accept-language"]
      );

      // 必須チェックなど
      if (!lang) throw new Error("lang not detected");

      return { props: { lang } };
    } catch (e) {
      console.error("SSR error:", e);
      return { notFound: true };
    }
  };
  
}