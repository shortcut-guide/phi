export const incrementSearchCount = (description: string): [string, number] => {
  const match = description.match(/検索回数[:：]\s*(\d+)回/);
  const count = match ? parseInt(match[1]) + 1 : 1;
  const newDesc = description.replace(/検索回数[:：]\s*\d+回/, `検索回数: ${count}回`)
    || `${description.trim()}\n検索回数: ${count}回`;
  return [newDesc, count];
};