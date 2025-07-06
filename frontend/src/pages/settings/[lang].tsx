import DefaultLayout from '@/f/layouts/DefaultLayout';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const SettingsPage = ({ lang }: Props) => {
  const t = (messages.settings as any)[lang] ?? {};

  return (
    <DefaultLayout lang={lang} title={t.title}>
      <section>
        <h1>{t.heading}</h1>
        <br />
        <p className="size-20">{t.overview}</p>
      </section>
      <section className="margin-32">
        <div className="space-content">
          <div className="contents">
            <h2>{t.sectionTitle}</h2>
            <p>{t.sectionDescription}</p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default SettingsPage;
