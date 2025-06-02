import { useState, useEffect } from "preact/hooks";
import { messages } from "@/f/config/messageConfig";
import { getLang } from "@/f/utils/lang";
const lang = getLang();
const t = messages.profileForm[lang];

export default function ProfileForm() {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setNickname(data.nickname ?? "");
      setBio(data.bio ?? "");
    })();
  }, []);

  async function updateProfile() {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, bio })
    });
    alert(t.updated);
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