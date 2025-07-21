import React, { useEffect, useState } from "react";

type FaqContent = {
  title: string;
  content: any; // オブジェクト or 配列対応可
};

type FaqData = Record<string, FaqContent>; // lang単位の辞書

type Props = {
  lang: string;
};

const FaqSection: React.FC<Props> = ({ lang }) => {
  const [faqs, setFaqs] = useState<FaqContent[]>([]);

  useEffect(() => {
    fetch(`/api/faq?lang=${lang}`)
      .then(res => res.json())
      .then(json => {
        // json例: { ja: { return_policy: {...}, ... }, en: {...} }
        const faqObj = json[lang] ?? {};
        // titleとcontentのみ抽出（階層が深い場合は調整）
        const result: FaqContent[] = [];
        Object.values(faqObj).forEach((v: any) => {
          if (v.title && v.content) {
            // サブ項目も平坦化したい場合は再帰で展開
            if (typeof v.content === "object" && !Array.isArray(v.content)) {
              Object.values(v.content).forEach((sub: any) => {
                result.push({
                  title: sub.title || v.title,
                  content: Array.isArray(sub.content) ? sub.content : [sub.content],
                });
              });
            } else {
              result.push({
                title: v.title,
                content: Array.isArray(v.content) ? v.content : [v.content],
              });
            }
          }
        });
        setFaqs(result);
      });
  }, [lang]);

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toggle = (idx: number) => setOpenIdx(prev => (prev === idx ? null : idx));

  return (
    <section className="space-y-4">
      {faqs.map((faq, idx) => (
        <div key={idx} className="border p-4 rounded">
          <button onClick={() => toggle(idx)} className="text-left w-full font-semibold text-lg">
            {faq.title}
          </button>
          {openIdx === idx && (
            <div className="mt-2 text-gray-700 space-y-2">
              {faq.content.map((c: string, i: number) =>
                c.startsWith && c.startsWith("<a ")
                  ? <span key={i} dangerouslySetInnerHTML={{ __html: c }} />
                  : <p key={i}>{c}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default FaqSection;