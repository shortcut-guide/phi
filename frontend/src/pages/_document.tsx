import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Flaticon CDN */}
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />
        {/* Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&display=swap"
        />
        {/* ほかに必要なグローバルCSSもここでOK */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}