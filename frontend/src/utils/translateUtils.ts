// frontend/src/utils/translateUtils.ts

export async function translateName(
  text: string,
  from: string = 'ja',
  to: string = 'en'
): Promise<string> {
  try {
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.translatedText || text;
  } catch (e) {
    // エラー時は元のtext返却
    return text;
  }
}