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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta property="og:title" content={typeof t.title === "string" ? t.title : ""} />
      <meta property="og:description" content={typeof t.description === "string" ? t.description : ""} />
      <title>{title && typeof t.title === "string" ? `${title} | ${t.title}` : title || (typeof t.title === "string" ? t.title : "")}</title>
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