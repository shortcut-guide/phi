import Head from "next/head";
import React, { useState,useEffect } from "react";
import { useRouter } from 'next/router';
import { messages } from "@/f/config/messageConfig";
import DefaultLayout from "@/f/layouts/DefaultLayout";
import LoginBtn from "@/f/components/LoginBtn";

const Settings = ({lang}:{lang:string}) =>{
  const [user, setUser] = useState(null);
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  const t = (messages.settings as any)[lang] ?? {};

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    // ログイン済みならCookie経由で自動取得
    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.user) setUser(data.user);
      });
  }, []);

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

            {/* ログイン済みなら情報表示 */}
            {user && (
              <div className="mb-4 text-left space-y-2">
                <div>
                  <span className="font-bold">{t.email}:</span> {user.email}
                </div>
                <div>
                  <span className="font-bold">{t.username}:</span> {user.name}
                </div>
                <div>
                  <a
                    href={user.card_change_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {t.cardchange}
                  </a>
                </div>
                <div>
                  <a
                    href={user.address_change_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {t.addresschange}
                  </a>
                </div>
              </div>
            )}

            {/* 未ログインならログインボタン */}
            {!user && (
              <div className="flex flex-col items-center gap-4">
                <LoginBtn lang={lang} onLoginSuccess={setUser} />
              </div>
            )}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default Settings;