import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const PersonalSettingsPage = ({ lang }: Props) => {
  const t = (messages.personalSettingsPage as any)[lang] ?? {};

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{t.title}</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">{t.account}</h2>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">{t.personal}</h2>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">{t.security}</h2>
      </section>
    </div>
  );
};

export default PersonalSettingsPage;
