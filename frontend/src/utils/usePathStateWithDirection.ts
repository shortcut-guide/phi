import { useEffect, useState, useRef } from 'react';

type Direction = 'in' | 'out';

export const usePathStateWithDirection = () => {
  const getPath = () => new URL(window.location.href).pathname;

  const [path, setPath] = useState(getPath);
  const [direction, setDirection] = useState<Direction>('in');
  const prevPathRef = useRef(path);

  // 表示対象ページ
  const activePath = '/page2';

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = getPath();
      const wasOpen = prevPathRef.current === activePath;
      const isOpen = nextPath === activePath;

      setDirection(isOpen ? 'in' : 'out');
      prevPathRef.current = nextPath;
      setPath(nextPath);
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // 初期化時も反映

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const transformStyle =
    path === activePath
      ? 'translateX(0)' // 表示中
      : 'translateX(100%)'; // 閉じた状態（右に戻す）

  const transitionClass =
    direction === 'in' ? 'slide-in' : 'slide-out';

  return {
    path,
    transformStyle,
    transitionClass,
  };
};
