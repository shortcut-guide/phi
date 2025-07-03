// frontend/src/components/FaqSection.tsx
import React, { useEffect, useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FaqSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    fetch("/api/faq") // CORS許可必要なら注意
      .then(res => res.json())
      .then(setFaqs);
  }, []);

  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  return (
    <section className="space-y-4">
      {faqs.map(faq => (
        <div key={faq.id} className="border p-4 rounded">
          <button onClick={() => toggle(faq.id)} className="text-left w-full font-semibold text-lg">
            {faq.question}
          </button>
          {openId === faq.id && <p className="mt-2 text-gray-700">{faq.answer}</p>}
        </div>
      ))}
    </section>
  );
};

export default FaqSection;
