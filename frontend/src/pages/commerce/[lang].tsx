import DefaultLayout from '@/f/layouts/DefaultLayout';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const CommercePage = ({ lang }: Props) => {
  const t = ((messages.commercePage as any)[lang]) ?? {};
  const t_info = ((messages.commerceInfo as any)[lang]) ?? [];

  return (
    <DefaultLayout title={t.title}>
      <section className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center">{t.heading}</h1>
        <dl className="space-y-6">
          {Array.isArray(t_info) && t_info.map((item: any, idx: number) => (
            <div className="border-b pb-4" key={idx}>
              <dt className="text-lg font-semibold">{item.title}</dt>
              <dd className="mt-1 text-gray-700 whitespace-pre-line">{item.description}</dd>
            </div>
          ))}
        </dl>
      </section>
    </DefaultLayout>
  );
};

export default CommercePage;
