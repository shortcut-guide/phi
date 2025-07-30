// pages/_app.tsx

import '@/f/assets/styles/style.css';
import "@/f/assets/scss/chevron-right-button.scss";
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}