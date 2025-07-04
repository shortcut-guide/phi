---
import AddressList from "@/f/components/AddressList.astro";
import { messages } from "@/f/config/messageConfig";

const lang = "__MSG_LANG__";
const t = ((messages.addressSettingsPage as any)[lang]) ?? {};

const apiUrl = import.meta.env.PUBLIC_API_BASE_URL;

let profile = [];

try {
  const res = await fetch(`${apiUrl}/api/profile`);
  if (!res.ok) {
    throw new Error(`APIエラー: ${res.status}\n`);
  }
  profile = await res.json();
} catch (err) {
  console.error("🔥 API fetch 失敗:", err);
}
---

{Array.isArray(profile) && profile.length > 0 ? (
  <AddressList profile={profile} lang={lang} />
) : (
  <p>登録されていません。</p>
)}
