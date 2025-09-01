import "./globals.css";
import Header from "@/src/components/Header/Header";
import { Montserrat } from "next/font/google";
import { getServerUser } from "@/src/lib/serverUtils";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "FastCredit Forum - Finančné poradenstvo a odpovede od expertov",
  description:
    "Získajte profesionálne finančné poradenstvo od expertov. Spýtajte sa na pôžičky, banky, poistenie a investície na FastCredit fóre.",
  keywords:
    "fastcredit, forum, finance, pôžičky, banky, poistenie, experti, poradenstvo",
  authors: [{ name: "FastCredit" }],
  creator: "FastCredit",
  publisher: "FastCredit",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://fastcredit.sk/forum",
    siteName: "FastCredit Forum",
    title: "FastCredit Forum - Finančné poradenstvo",
    description: "Profesionálne finančné poradenstvo a odpovede od expertov",
  },
  twitter: {
    card: "summary_large_image",
    site: "@fastcredit",
    creator: "@fastcredit",
  },
  alternates: {
    canonical: "https://fastcredit.sk/forum",
  },
};

export default async function RootLayout({ children }) {
  // Получаем пользователя на сервере
  const user = await getServerUser();

  return (
    <html lang="sk" className={montserrat.variable}>
      <head>
        {/* Добавляем структурированные данные для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "FastCredit Forum",
              url: "https://fastcredit.sk/forum",
              description: "Finančné poradenstvo a odpovede od expertov",
              publisher: {
                "@type": "Organization",
                name: "FastCredit",
                url: "https://fastcredit.sk",
              },
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://fastcredit.sk/forum/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Favicons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/forum/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/forum/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/forum/favicon-16x16.png"
        />
        <link rel="manifest" href="/forum/site.webmanifest" />

        {/* Preconnect для улучшения производительности */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        {/* Передаем пользователя в Header через props */}
        <Header user={user} />

        <main role="main">{children}</main>

        {/* Footer можем добавить позже */}
        <footer role="contentinfo">{/* Пока пустой, потом добавим */}</footer>

        {/* Google Analytics или другие скрипты можем добавить здесь */}
        {process.env.NODE_ENV === "production" && (
          <>{/* Placeholder для GA */}</>
        )}
      </body>
    </html>
  );
}
