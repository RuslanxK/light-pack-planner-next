// // pages/_document.js
// import { Html, Head, Main, NextScript } from 'next/document';

// export default function Document() {
//   return (
//     <Html>
//       <Head>
//         <script
//           id="google-translate-script"
//           src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//           async
//         ></script>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               function googleTranslateElementInit() {
//                 new google.translate.TranslateElement({
//                   pageLanguage: 'en',
//                   autoDisplay: false,
//                   includedLanguages: 'en,es,fr,de,zh,ja,no,ru,ar,bn,pt,zh-CN',
//                   layout: google.translate.TranslateElement.InlineLayout.SIMPLE
//                 }, 'google_translate_element');

//                 const lang = document.cookie.split('; ').find(row => row.startsWith('googleTrans'))?.split('=')[1] || '/en/en';
//                 setTimeout(() => {
//                   const select = document.querySelector('.goog-te-combo');
//                   if (select) {
//                     select.value = lang.split('/')[2];
//                     select.dispatchEvent(new Event('change'));
//                   }
//                 }, 500);
//               }
//             `
//           }}
//         ></script>
//       </Head>
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   );
// }
