import React from "react";
import { useState, useEffect } from "react";
import { messages } from "@/f/config/messageConfig";
import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";

type Props = {
  lang: string;
}
type Profile = {
  nickname?: string;
  bio?: string;
}

const ProfileForm = ({ lang }: Props) => {
  const url = getLangObj<typeof links.url>(links.url);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const t = ((messages.profileForm as any)[lang]) ?? {};
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  
  useEffect(() => {
    (async () => {
      let data: Profile = {};

      try {
        const res = await fetch(`${apiUrl}${url.api.profile}`);
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
      const res = await fetch(`${apiUrl}${url.api.profile}`,{
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
        className="input"
      />

      <label htmlFor="bio">{t.bio}</label>
      <textarea
        id="bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="textarea"
      />

      <button onClick={updateProfile} className="btn-red">{t.updateButton}</button>
    </div>
  );
};

export default ProfileForm;