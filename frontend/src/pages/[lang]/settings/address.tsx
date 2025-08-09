import type { GetServerSideProps } from "next";
import AddressList from "@/f/components/AddressList";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
  profile: any[];
};

const AddressSettingsPage = ({ lang, profile }: Props) => {
  const t = (messages.addressSettingsPage as any)[lang] ?? {};

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{t.title}</h1>
      {Array.isArray(profile) && profile.length > 0 ? (
        <AddressList addresses={profile} lang={lang} t={t} />
      ) : (
        <p>登録されていません。</p>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = typeof context.params?.lang === "string" ? context.params.lang : "ja";
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  let profile: any[] = [];

  try {
    const res = await fetch(`${apiUrl}/api/profile`);
    if (!res.ok) {
      throw new Error(`APIエラー: ${res.status}`);
    }
    profile = await res.json();
  } catch (err) {
    console.error("🔥 API fetch 失敗:", err);
  }

  return {
    props: {
      lang,
      profile,
    },
  };
};

export default AddressSettingsPage;
