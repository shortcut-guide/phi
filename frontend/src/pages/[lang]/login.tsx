import DefaultLayout from '@/f/layouts/DefaultLayout';
import LoginBtn from '@/f/components/LoginBtn';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const LoginPage = ({ lang }: Props) => {
  const t = (messages.login as any)[lang] ?? {};

  return (
    <DefaultLayout lang={lang} title={t.title}>
      <LoginBtn />
    </DefaultLayout>
  );
};

export default LoginPage;
