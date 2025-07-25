import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { messages } from "@/f/config/messageConfig";
import DefaultLayout from "@/f/layouts/DefaultLayout";
import LoginBtn from "@/f/components/LoginBtn";
import { LoginBtnAmazon } from "@/f/components/amazon";

const Settings = ({ lang }: { lang: string }) => {
  const [paypalUser, setPaypalUser] = useState(null);
  const [amazonUser, setAmazonUser] = useState(null);
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  const t = (messages.settings as any)[lang] ?? {};

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // PayPal
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.user) setPaypalUser(data.user);
      });

    // Amazon（例：APIエンドポイントや実装に応じて適宜修正）
    fetch(`${API_URL}/api/auth/amazon/me`, { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.user) setAmazonUser(data.user);
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

            {/* PayPal ログイン済みなら情報表示 */}
            {paypalUser && (
              <div className="mb-4 text-left space-y-2 shadow-xl rounded-xl p-8 border border-gray-100">
                <h2>Paypal</h2>
                <div>
                  <span className="font-bold">メール:</span> {paypalUser.emails?.[0]?.value}
                </div>
                <div>
                  <span className="font-bold">ユーザー名:</span> {paypalUser.name}
                </div>
                <div>
                  <span className="font-bold">カード変更:</span>{" "}
                  <a
                    href={paypalUser.card_change_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    こちら
                  </a>
                </div>
                <div>
                  <span className="font-bold">PayPal住所変更:</span>{" "}
                  <a
                    href={paypalUser.address_change_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    こちら
                  </a>
                </div>
              </div>
            )}

            {/* Amazon ログイン済みなら情報表示（Amazon APIで取得した情報に応じて調整） */}
            {amazonUser && (
              <div className="mb-4 text-left space-y-2 shadow-xl rounded-xl p-8 border border-gray-100">
                <h2>Amazon</h2>
                <div>
                  <span className="font-bold">メール:</span> {amazonUser.email}
                </div>
                <div>
                  <span className="font-bold">ユーザー名:</span> {amazonUser.name}
                </div>
              </div>
            )}

            {/* 未ログインの場合のみログインボタンを表示 */}
            {(!paypalUser || !amazonUser) && (
              <>
                {!paypalUser && (
                  <div className="flex justify-center items-center mb-4 space-y-4 shadow-xl rounded-xl p-8 border border-gray-100">
                    <LoginBtn lang={lang} onLoginSuccess={setPaypalUser} />
                  </div>
                )}
                {!amazonUser && (
                  <div className="flex justify-center items-center mb-4 space-y-4 shadow-xl rounded-xl p-8 border border-gray-100">
                    <LoginBtnAmazon lang={lang} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default Settings;