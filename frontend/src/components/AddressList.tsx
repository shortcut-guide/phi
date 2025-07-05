import React from "react";
import type { Profile } from '@/f/types/profile';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
  addresses: Profile[];
};

const AddressList: React.FC<Props> = ({ lang, addresses }) => {
  const t = (messages.addressList as any)[lang] ?? {};

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{t.title}</h1>
        <a href="/settings/address/edit" className="text-blue-500">{t.edit}</a>
      </div>

      <ul className="space-y-4">
        {addresses.map((addr: Profile) => (
          <li className="p-4 border rounded" key={addr.id ?? addr.name}>
            <p className="font-bold">{addr.name}（{addr.kana}）</p>
            <p>{addr.zip}</p>
            <p>{addr.address}</p>
            {addr.is_default && <p className="text-blue-600 mt-1">● {t.selected}</p>}
          </li>
        ))}
      </ul>

      {addresses.length < 3 && (
        <div className="mt-6">
          <a href="/settings/address/new" className="text-blue-600 underline">
            + {t.registerNew}
          </a>
        </div>
      )}
    </>
  );
};

export default AddressList;
