import { useRef, useState, useEffect } from 'react';
import { usePathStateWithDirection } from '@/f/utils/usePathStateWithDirection';
import { PushLink } from '@/f/components/PushLink';
import { messages } from "@/f/config/messageConfig";
import { getLangObj } from "@/f/utils/getLangObj";
import { return } from '../../next.js/packages/next/src/server/config-shared';
type Props = {
  lang: string;
}

export const SlideNavigator = ({ lang }: Props) => {
  const t = getLangObj(messages.slideComponent, lang);
  const { transformStyle, transitionClass } = usePathStateWithDirection();
  const [showHelp, setShowHelp] = useState(false);

  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  const handleStart = (x: number) => {
    startX.current = x;
  };

  const handleMove = (x: number) => {
    endX.current = x;
  };

  const handleEnd = () => {
    if (
      startX.current !== null &&
      endX.current !== null &&
      startX.current - endX.current > 50
    ) {
      window.history.back();
    }
    startX.current = null;
    endX.current = null;
  };

  const handleBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const isPc = window.innerWidth >= 768;
    const alreadyShown = localStorage.getItem('slideHelpShown');

    if (isPc && !alreadyShown) {
      setShowHelp(true);
      localStorage.setItem('slideHelpShown', 'true');
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      <nav className="p-4 bg-white z-10 flex gap-4">
        <PushLink to="/page/2">{t.open}</PushLink>
      </nav>

      <div
        className={`absolute w-full h-full top-0 transition-transform duration-500 ${transitionClass}`}
        style={{ transform: transformStyle }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => {
          if (startX.current !== null) handleMove(e.clientX);
        }}
        onMouseUp={handleEnd}
      >
        <div className="w-full h-full bg-white relative">
          {showHelp && (
            <button
              onClick={handleBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 pl-4 text-gray-600 hover:text-black bg-transparent z-10"
              style={{ pointerEvents: 'auto' }}
            >{t.return}</button>
          )}
          <div className="p-8">{t.next}</div>
        </div>
      </div>
    </div>
  );
};
