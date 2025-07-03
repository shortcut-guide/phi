// frontend/src/components/PushLink.tsx
import { FC } from 'react';
import { pushState } from '../utils/navigation';

type PushLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export const PushLink: FC<PushLinkProps> = ({ to, children, className }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    pushState(to);
    // popstate を明示発火しないので、外部で監視する
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
