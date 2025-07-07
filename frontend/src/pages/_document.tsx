import { Html, Head, Main, NextScript, DocumentContext } from "next/document";

function getLangFromCtx(ctx: DocumentContext) {
  if (ctx.locale) return ctx.locale; // 最優先
  // 以下はフォールバック
  const path = ctx.req?.url || "";
  const match = path.match(/^\/([a-zA-Z]{2})(\/|$)/);
  if (match) return match[1];
  return "ja";
}
export default function Document(props: any) {
  const lang = props.lang || "ja";
  return (
    <Html lang={lang}>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

        {/* favicon */}
        <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg" />

        {/* Flaticon CDN */}
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&display=swap" rel="stylesheet" />
        {/* open graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dashboard.accessible-astro.dev" />
        <meta property="og:image" content="/assets/img/social-preview-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx) => {
  const initialProps = await (await import('next/document')).default.getInitialProps(ctx);
  const lang = getLangFromCtx(ctx);
  console.log("lang", lang);
  return { ...initialProps, lang };
};