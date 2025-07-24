// frontend/src/components/LoginBtnAmazon.tsx
import React, { useEffect, useState } from "react";
import { messages } from "@/f/config/messageConfig";

type AmazonLoginProps = {
  lang: string;
};

const AmazonLogin: React.FC<AmazonLoginProps> = ({ lang }) =>{
  return (
    <a
      href="/auth/amazon"
      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
    >
      {messages.login?.[lang]?.loginAmazon}
    </a>
  );
};

export default AmazonLogin;