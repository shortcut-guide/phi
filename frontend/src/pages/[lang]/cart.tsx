import Head from "next/head";
import DefaultLayout from '@/f/layouts/DefaultLayout';
import Cart from "@/f/components/cart/index";
import { messages } from "@/f/config/messageConfig";
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";

// SSR: ログ＆安全props返却
export const getServerSideProps = withLangMessagesSSR("index");

type Props = {
  lang: string;
};

const CartPage = ({ lang }: Props) => {
  const t = (messages.cartPage as any)[lang] ?? {};
  return (
    <DefaultLayout lang={lang} title={t.title}>
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      <Cart lang={lang} />
    </DefaultLayout>
  );
};

export default CartPage;