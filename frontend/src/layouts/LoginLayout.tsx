import '@/f/assets/scss/globals.scss';
import Head from "next/head";
import { messages } from "@/f/config/messageConfig";
import { ReactNode } from "react";

type Props = {
  lang: string;
  title?: string;
  description?: string;
  children: ReactNode;
};

const LoginLayout = ({ lang, title = "", description = "", children }: Props) => {
  const t = (messages.loginLayout as any)[lang] ?? {};

  return (
    <html lang={lang} dir="ltr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

        {/* favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* google fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&display=swap"
          rel="stylesheet"
        />

        {/* open graph */}
        <meta property="og:title" content={t.subtitle} />
        <meta property="og:description" content={t.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dashboard.accessible-astro.dev" />
        <meta property="og:image" content="/social-preview-image.png" />

        {/* page title */}
        <title>{t.subtitle} - {title}</title>
      </Head>
      <body>
        <main id="main-content">
          {children}
        </main>
        <style jsx global>{`
          html body {
            background-color: var(--neutral-100);
          }
        `}</style>
      </body>
    </html>
  );
};

export default LoginLayout;
