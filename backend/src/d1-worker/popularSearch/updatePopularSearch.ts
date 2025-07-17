// backend/workers/updatePopularSearch.ts
export default {
  async scheduled(_: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    const apiUrl = 'https://phis.jp/api/popular-search';

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`API failed: ${res.status}`);

      const json = await res.json();
      if (!Array.isArray(json.keywords)) throw new Error('Invalid keywords');

      await env.POPULAR_KV.put('popularSearch.json', JSON.stringify(json.keywords));
      console.log('✅ 人気検索ワードをKVに保存完了');
    } catch (err) {
      console.error('❌ 保存失敗:', err);
    }
  },
};

interface Env {
  POPULAR_KV: KVNamespace;
}
