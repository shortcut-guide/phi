// import { GetServerSideProps } from "next";

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   // Accept-Languageで判定、またはデフォルト"ja"
//   const accept = ctx.req.headers["accept-language"];
//   let lang = "ja";
//   if (typeof accept === "string" && accept.toLowerCase().startsWith("en")) {
//     lang = "en";
//   }
//   return {
//     redirect: {
//       destination: `/${lang}`,
//       permanent: true,
//     },
//   };
// };

// export default function Index() {
//   return null;
// }