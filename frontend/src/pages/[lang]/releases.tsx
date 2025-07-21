import type { GetStaticPaths, GetStaticProps } from "next";
import DefaultLayout from '@/f/layouts/DefaultLayout';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const ReleasesPage = ({ lang }: Props) => (
  <DefaultLayout lang={lang} title="リリース">
    <div>リリースページ</div>
  </DefaultLayout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  // 必要な言語リストをmessagesやconfigから取得
  const langs = Object.keys(messages.releases);
  return {
    paths: langs.map(lang => ({ params: { lang } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const lang = typeof params?.lang === "string" ? params.lang : "ja";
  return {
    props: { lang },
  };
};

export default ReleasesPage;