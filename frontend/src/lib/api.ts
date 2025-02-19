/**
 * API データを取得する関数
 * @param endpoint API のエンドポイント
 * @returns JSON データ
 */
export async function fetchData(endpoint: string): Promise<any> {
    const response = await fetch(endpoint);
    return response.json();
}