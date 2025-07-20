import Head from "next/head";
import { useRouter } from 'next/router';
import { messages } from "@/f/config/messageConfig";
import DefaultLayout from "@/f/layouts/DefaultLayout";
import LoginBtn from "@/f/components/LoginBtn";

const Settings = ({lang}:{lang:string}) =>{
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  const t = (messages.settings as any)[lang] ?? {};

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <DefaultLayout lang={lang} title={t.title}>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-100">
            <h1 className="text-2xl font-bold mb-2 text-left">{t.heading}</h1>
            <p className="text-1xl text-gray-600 mb-8 text-left">{t.description}</p>
            <p className="text-1xl text-gray-600 mb-8 text-left">{t.about}</p>
            <div className="flex flex-col items-center gap-4">
              <LoginBtn lang={lang} />
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default Settings;