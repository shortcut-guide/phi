export const fetchWithTimeout = async (url: string, ms = 5000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (e: any) {
    clearTimeout(timeout);
    throw e;
  }
};