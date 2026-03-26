import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const clientizeUrl = process.env.CLIENTIZE_URL || 'https://app.clientize.test';

  return (
    <Html lang="pt-BR">
      <Head>
        <script src={`${clientizeUrl}/js/app-bridge.js`} defer />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
