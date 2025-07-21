import React from "react";
import type { ReactNode } from "react";
import Settings from '@/f/components/Settings';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";

// SSR: ログ＆安全props返却
export const getServerSideProps = withLangMessagesSSR("settings");

type Props = {
  lang: string;
};

const SettingsPage = ({ lang }: Props) => {
  return <Settings lang={lang} />
};

export default SettingsPage;
