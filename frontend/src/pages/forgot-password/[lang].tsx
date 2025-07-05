import { useState } from "react";
import { Icon } from 'astro-icon/components'; // React用で存在すればこのまま
import DefaultLayout from '@/f/layouts/DefaultLayout';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const ForgotPasswordPage = ({ lang }: Props) => {
  const t = ((messages.forgotPassword as any)[lang]) ?? {
    title: "",
    heading: "",
    description: "",
    email: "",
    send: "",
    back: "",
    alertComplete: "",
  };

  const [email, setEmail] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/auth/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    alert(data.message ?? t.alertComplete);
  };

  return (
    <DefaultLayout title={t.title}>
      <section className="bg-neutral-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon name="majesticons:lock-line" className="text-4xl text-secondary-500" />
            <h1 className="text-2xl font-bold">{t.heading}</h1>
            <p className="text-neutral-600 text-center">
              {t.description.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
          <form id="forgot-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
              <span className="font-semibold">{t.email}</span>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary-300"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="w-full bg-secondary-500 text-white font-semibold py-2 rounded hover:bg-secondary-600 transition"
            >
              {t.send}
            </button>
          </form>
          <div className="text-center">
            <a href="/login" className="text-secondary-500 hover:underline">{t.back}</a>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default ForgotPasswordPage;
