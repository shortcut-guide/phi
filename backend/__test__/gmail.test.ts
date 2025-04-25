// test/gmail.test.ts
import { fetchVerificationCode } from '../src/utils/fetchVerificationCode';

(async () => {
  try {
    const code = await fetchVerificationCode();
    console.log('✅ 認証コード取得成功:', code);
  } catch (err) {
    console.error('❌ 認証コード取得失敗:', err);
  }
})();