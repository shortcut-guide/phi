import { D1Database } from '@cloudflare/workers-types';
import { messages } from "@/b/config/messageConfig";
import { getLang } from "@/b/utils/lang";
import { getD1Client } from '@/b/utils/contextHolder';

const lang = getLang();
const t = messages.utilsD1?.[lang];

export const getD1Site = (): D1Database => {
  try {
    return getD1Client("SITE_DB");
  } catch {
    throw new Error(t.ErrorSITE_DB);
  }
};

export const getD1SearchLogs = (): D1Database => {
  try {
    return getD1Client("SEARCHLOGS_DB");
  } catch {
    throw new Error(t.ErrorSEARCHLOGS_DB);
  }
};

export const getD1UserProfile = (): D1Database => {
  try {
    return getD1Client("PROFILE_DB");
  } catch {
    throw new Error(t.ErrorPROFILE_DB);
  }
};

export const getD1Product = (): D1Database => {
  try {
    return getD1Client("PRODUCTS_DB");
  } catch {
    throw new Error(t.ErrorPRODUCTS_DB);
  }
};