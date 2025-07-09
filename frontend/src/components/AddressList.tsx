import React from "react";
import type { Profile } from '@/f/types/profile';
import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";

type AddressListProps = {
  addresses: Profile[];
  lang: string;
  t: { [key: string]: string };
};

const AddressList: React.FC<AddressListProps> = ({ addresses, lang, t }) => {
  const url = getLangObj<typeof links.url>(links.url);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{t.title}</h1>
        <a href={url.address.edit} className="text-blue-500">{t.edit}</a>
      </div>

      <ul className="space-y-4">
        {addresses.map((addr: Profile) => (
          <li key={addr.id ?? addr.name} className="p-4 border rounded">
            <p className="font-bold">{addr.name}（{addr.kana}）</p>
            <p>{addr.zip}</p>
            <p>{addr.address}</p>
            {addr.is_default && <p className="text-blue-600 mt-1">● {t.selected}</p>}
          </li>
        ))}
      </ul>

      {addresses.length < 3 && (
        <div className="mt-6">
          <a href={url.address.new} className="text-blue-600 underline">
            + {t.registerNew}
          </a>
        </div>
      )}
    </>
  );
};

export default AddressList;