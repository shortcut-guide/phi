import { useState, useEffect } from "preact/hooks";

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
    alert("更新しました");
  }

  return (
    <div>
      <label htmlFor="nickname">ニックネーム</label>
      <input
        id="nickname"
        value={nickname}
        onInput={e => setNickname((e.target as HTMLInputElement).value)}
        class="input"
      />

      <label htmlFor="bio">自己紹介文</label>
      <textarea
        id="bio"
        value={bio}
        onInput={e => setBio((e.target as HTMLTextAreaElement).value)}
        class="textarea"
      />

      <button onClick={updateProfile} class="btn-red">更新する</button>
    </div>
  );
}