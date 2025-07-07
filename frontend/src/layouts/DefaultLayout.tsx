import Head from "next/head";
import React from "react";
import type { ReactNode } from "react";
import MainNavigation from '@/f/components/Navigation';
import GoogleTag from '@/f/components/googletag';
import { withLangMessagesSSR } from "@/f/utils/withLangSSR";
import ErrorBoundary from "@/f/utils/ErrorBoundary";

export const getServerSideProps = withLangMessagesSSR("DefaultLayout");

type Props = {
  lang: string;
  t?: any;
  title?: string;
  description?: string;
  children: ReactNode;
};

const DefaultLayout = ({ lang, t = {}, title = "", description = "", children }: Props) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta name="description" content={description} />
      {/* favicon */}
      <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg" />
      <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />
      {/* google fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&display=swap" rel="stylesheet" />
      {/* open graph */}
      <meta property="og:title" content={typeof t.subtitle === "string" ? t.subtitle : ""} />
      <meta property="og:description" content={typeof t.description === "string" ? t.description : ""} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://dashboard.accessible-astro.dev" />
      <meta property="og:image" content="/assets/img/social-preview-image.png" />
      {/* page title */}
      <title>
        {typeof title === "string" ? title : ""}
        {typeof t.subtitle === "string" ? " - " + t.subtitle : ""}
      </title>
    </Head>
    <div className="admin-interface">
      <ErrorBoundary>
        <MainNavigation />
      </ErrorBoundary>
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
    {/* グローバルなSCSSは_app.tsxでimport管理 */}
  </>
);

export default DefaultLayout;