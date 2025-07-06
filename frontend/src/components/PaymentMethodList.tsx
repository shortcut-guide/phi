import React from "react";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
  selectedMethod: string;
};

const PaymentMethodList = ({ lang, selectedMethod }:Props) => {
  const t = (messages.paymentMethodList as any)[lang] ?? {};
  const paymentOptions = [{
    id: "paypal",
    label: t.paypal,
    description: t.paypalDescription
  }];

  return (
    <section className="mb-6">
      <h2 className="font-bold">{t.postpayCredit}</h2>
      <ul className="mt-2 space-y-4">
        {paymentOptions.map(opt => (
          <li key={opt.id}>
            <label className="flex items-start gap-2">
              <input type="radio" name="payment" value={opt.id} checked={selectedMethod === opt.id} readOnly />
              <div>
                <p className="font-semibold">{opt.label}</p>
                <p className="text-sm whitespace-pre-line">{opt.description}</p>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PaymentMethodList;
