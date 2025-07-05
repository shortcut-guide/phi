import Head from "next/head";
import React, { ReactNode } from "react";
import '@/assets/scss/globals.scss';
import Navigation from '@/f/components/Navigation';
import GoogleTag from '@/f/components/googletag';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";
export const getServerSideProps = withLangMessagesSSR("DefaultLayout");

type Props = {
  lang: string;
  t?: any;
  title?: string;
  description?: string;
  children: ReactNode;
};

const DefaultLayout = ({ lang, t, title = "", description = "", children }: Props) => (
  <html lang={lang} dir="ltr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="description" content={description} />

        {/* favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />

        {/* google fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&display=swap" rel="stylesheet" />

        {/* open graph */}
        <meta property="og:title" content={t.subtitle} />
        <meta property="og:description" content={t.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dashboard.accessible-astro.dev" />
        <meta property="og:image" content="/assets/img/social-preview-image.png" />

        {/* page title */}
        <title>{title} - {t.subtitle}</title>
      </Head>
      <body>
        <header>
          <SkipLink />
        </header>
        <div className="admin-interface">
          <Navigation>
            <li className="menu-item">
              <a href="/">
                <Icon name="majesticons:home-line" />
                <span className="sr-only">Dashboard</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="/products/">
                <Icon name="majesticons:shopping-cart-line" />
                <span className="sr-only">Products</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="/users/">
                <Icon name="majesticons:users-line" />
                <span className="sr-only">Users</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="/messages/">
                <Icon name="majesticons:messages-line" />
                <span className="sr-only">Messages</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="/media/">
                <Icon name="majesticons:image-line" />
                <span className="sr-only">Media</span>
              </a>
            </li>
            <li className="menu-item">
              <div className="ui-controls flex items-center gap-2">
                <DarkMode />
                <span>Dark mode</span>
              </div>
            </li>
          </Navigation>
          <main id="main-content">{children}</main>
        </div>
        <GoogleTag />
        <style jsx global>{`
          .admin-interface {
            display: block;
          }
          @media (min-width: 768px) {
            .admin-interface {
              display: grid;
              grid-template-columns: 1fr auto;
            }
            .admin-interface main {
              margin-left: 60px;
              padding: 6rem;
            }
          }
          .admin-interface main {
            padding: 2rem;
          }
        `}</style>
        {/* 追加SCSSグローバルは通常globals.scss等で管理 */}
        {/* 必要なSCSS内容はSCSSファイル側に移動推奨 */}
      </body>
    </html>
);

export default DefaultLayout;
