import { useRouter } from 'next/router';
import React from 'react';

interface PushLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

const PushLink: React.FC<PushLinkProps> = ({ to, children, ...props }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    // pushState でページ遷移（URLだけ変更＋スライド演出はpropsやContext経由で管理）
    router.push(to, undefined, { shallow: true });
    // 例: スライド演出用のcontextや状態を呼ぶ（カスタマイズ必要）
    // startSlideAnimation('next') など
  };

  return (
    <a href={to} onClick={handleClick} {...props}>{children}</a>
  );
};

export default PushLink;