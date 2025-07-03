// frontend/src/utils/navigation.ts

export const pushState = (url: string) => {
  if (window.location.pathname !== url) {
    window.history.pushState(null, '', url);
    // popstate は明示的に発火させない（戻るボタン等でのみ）
  }
};
