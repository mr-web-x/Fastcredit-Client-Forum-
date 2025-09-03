// Файл: app/layout.js

import "./globals.css";
import Header from "@/src/components/Header/Header";
import { Montserrat } from "next/font/google";
import { getServerUser } from "@/src/lib/auth-server";

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
  // Получаем пользователя на сервере через HttpOnly cookie
  const user = await getServerUser();

  return (
    <html lang="sk" className={montserrat.variable}>
      <head>
        {/* Структурированные данные для SEO */}
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

        {/* User-specific structured data если пользователь авторизован */}
        {user && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name:
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.username,
                identifier: user._id,
                memberOf: {
                  "@type": "Organization",
                  name: "FastCredit Forum",
                },
              }),
            }}
          />
        )}

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

        {/* Google Sign-In script */}
        {/* <script
          src="https://accounts.google.com/gsi/client?hl=sk"
          async
          defer
        ></script> */}

        {/* Preload критических ресурсов */}
        <link
          rel="preload"
          href="/forum/logo.svg"
          as="image"
          type="image/svg+xml"
        />

        {/* DNS prefetch для API */}
        <link
          rel="dns-prefetch"
          href={process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}
        />
      </head>

      <body>
        {/* Передаем пользователя в Header через props - Server Component данные */}
        <Header user={user} />

        {/* Main content area */}
        <main role="main">{children}</main>

        {/* Footer - пока простой, потом можем расширить */}
        <footer role="contentinfo">
          <div className="container">
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                borderTop: "1px solid #e5e5e5",
                color: "#666",
                fontSize: "14px",
              }}
            >
              <p>
                © {new Date().getFullYear()} FastCredit Forum. Všetky práva
                vyhradené.
              </p>
              {user && (
                <p style={{ marginTop: "8px", opacity: 0.7 }}>
                  Prihlásený ako: {user.firstName || user.username} ({user.role}
                  )
                </p>
              )}
            </div>
          </div>
        </footer>

        {/* Analytics и другие скрипты только в production */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                      
                      // Track user role если авторизован
                      ${
                        user
                          ? `gtag('set', { user_role: '${user.role}' });`
                          : ""
                      }
                    `,
                  }}
                />
              </>
            )}

            {/* Hotjar или другие analytics */}
            {process.env.NEXT_PUBLIC_HOTJAR_ID && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(h,o,t,j,a,r){
                      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                      h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                      a=o.getElementsByTagName('head')[0];
                      r=o.createElement('script');r.async=1;
                      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                      a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                  `,
                }}
              />
            )}
          </>
        )}

        {/* Development tools */}
        {process.env.NODE_ENV === "development" && (
          <div
            style={{
              position: "fixed",
              bottom: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              zIndex: 9999,
              fontFamily: "monospace",
            }}
          >
            {user ? `👤 ${user.username} (${user.role})` : "🚫 Guest"}
          </div>
        )}
      </body>
    </html>
  );
}
