import { useState, useEffect } from "react";
import { messages } from "@/f/config/messageConfig";

const lang = "__MSG_LANG__";
const t = ((messages.profileForm as any)[lang]) ?? {};

const apiUrl = import.meta.env.PUBLIC_API_BASE_URL;
export default function ProfileForm() {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  
  useEffect(() => {
    (async () => {
      let data = [];

      try {
        const res = await fetch(`${apiUrl}/api/profile`);
        if (!res.ok) {
          throw new Error(`APIエラー: ${res.status}\n`);
        }
        data = await res.json();
      } catch (err) {
        console.error("🔥 API fetch 失敗:", err);
      }

      setNickname(data.nickname ?? "");
      setBio(data.bio ?? "");
    })();
  }, []);

  async function updateProfile() {
    try {
      const res = await fetch(`${apiUrl}/api/profile`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, bio })
      });
      if (!res.ok) {
        throw new Error(`APIエラー: ${res.status}\n`);
      }
      alert(t.updated); 
    } catch (err) {
      console.error("🔥 API fetch 失敗:", err);
    }
  }

  return (
    <div>
      <label htmlFor="nickname">{t.nickname}</label>
      <input
        id="nickname"
        value={nickname}
        onInput={e => setNickname((e.target as HTMLInputElement).value)}
        class="input"
      />

      <label htmlFor="bio">{t.bio}</label>
      <textarea
        id="bio"
        value={bio}
        onInput={e => setBio((e.target as HTMLTextAreaElement).value)}
        class="textarea"
      />

      <button onClick={updateProfile} class="btn-red">{t.updateButton}</button>
    </div>
  );
}