import { getD1Site } from "@/b/utils/d1";
import { executeQuery } from "@/b/utils/executeQuery";
import { Site } from "@/b/types/site";

export async function getSites() {
  const db = getD1Site();
  return await executeQuery<Site>(db, "SELECT * FROM sites", [], true);
}

