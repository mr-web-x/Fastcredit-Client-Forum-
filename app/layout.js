// Файл: app/layout.js - МАКСИМАЛЬНОЕ SEO ДЛЯ ФОРУМА

import "./globals.css";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer/Footer";
import { Montserrat } from "next/font/google";
import { getServerUser } from "@/src/lib/auth-server";
// import { getForumBaseStructuredData } from "@/src/lib/seo/structured-data";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Arial",
    "sans-serif",
  ],
});

export const metadata = {
  metadataBase: new URL("https://fastcredit.sk"),
  title: {
    template: "%s | FastCredit Forum - Finančné poradenstvo na Slovensku",
    default:
      "FastCredit Forum - Bezplatné finančné poradenstvo od expertov na Slovensku | Pôžičky, Banky, Poistenie",
    absolute: "FastCredit Forum - Finančné poradenstvo na Slovensku",
  },
  description:
    "Získajte profesionálne finančné poradenstvo ZDARMA od overených expertov na FastCredit fóre. ✅ Spýtajte sa na pôžičky, banky, poistenie, investície ✅ Odpovede do 24h ✅ Slovensko",

  // МАКСИМАЛЬНЫЕ KEYWORDS ДЛЯ СЛОВАКИИ
  keywords: [
    // Основные термины форума
    "fastcredit forum slovensko",
    "finančné poradenstvo slovensko zdarma",

    // Эксперты и консультации
    "finančný expert online slovensko",
    "finančný poradca zdarma",

    // Финансовые продукты
    "mikropôžičky slovensko ",
    "rýchle pôžičky online slovensko",

    // Банки Словакии
    "365.bank slovensko",
    "slsp slovensko",

    // Страхование
    "poistenie slovensko ",
    "životné poistenie slovensko",

    // Инвестиции
    "investície slovensko začiatočník",
    "sporenie slovensko ",

    // Города Словакии
    "finančné poradenstvo bratislava",
    "finančné poradenstvo košice",

    // Регионы
    "finančné poradenstvo bratislavský kraj",
    "finančné poradenstvo košický kraj",

    // Long-tail keywords
    "ako získať pôžičku na slovensku",
    "najlepšie úvery slovensko",

    // Проблемы и решения
    "nemám na hypotéku slovensko",
    "odmietnutá pôžička čo robiť",

    // Техническая оптимизация
    "finančné fórum slovensko",
    "finančné otázky forum sk",
  ].join(", "),

  // Авторы и организация
  authors: [
    { name: "FastCredit.sk", url: "https://fastcredit.sk" },
    { name: "Finančný expert", url: "https://fastcredit.sk/forum/" },
    { name: "Právny poradca", url: "https://fastcredit.sk/forum/" },
  ],
  creator: "FastCredit.sk - Finančné poradenstvo",
  publisher: "FastCredit.sk",
  applicationName: "FastCredit Forum",
  generator: "Next.js 15",
  referrer: "origin-when-cross-origin",

  // Определение форматов
  formatDetection: {
    email: true,
    address: true,
    telephone: false,
    date: true,
    url: true,
  },

  // Максимальная настройка роботов
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    notranslate: false,
    indexifembedded: true,
    nositelinkssearchbox: false,
    unavailable_after: "31 Dec 2030 23:59:59 GMT",
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      crawlDelay: 0,
    },
    bingBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },

  // Максимальный OpenGraph
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://fastcredit.sk/forum/",
    siteName: "FastCredit Forum - Finančné poradenstvo na Slovensku",
    title:
      "FastCredit Forum - Bezplatné finančné poradenstvo od expertov na Slovensku",
    description:
      "Získajte profesionálne finančné poradenstvo ZDARMA od overených expertov. ✅ Pôžičky, banky, poistenie, investície ✅ Odpovede do 24h ✅ Slovensko",
    images: [
      {
        url: "https://fastcredit.sk/forum/og.jpg",
        width: 1200,
        height: 630,
        alt: "FastCredit Forum - Finančné poradenstvo na Slovensku",
        type: "image/jpeg",
      },
      {
        url: "https://fastcredit.sk/forum/og-square.jpg",
        width: 1200,
        height: 1200,
        alt: "FastCredit Forum",
        type: "image/jpeg",
      },
      {
        url: "https://fastcredit.sk/forum/og-vertical.jpg",
        width: 600,
        height: 900,
        alt: "FastCredit Forum - Mobilná verzia",
        type: "image/jpeg",
      },
    ],
    determiner: "the",
    ttl: 604800,
    emails: ["admin@fastcredit.sk"],
    faxNumbers: [],
    streetAddress: "Bratislava, Slovenská republika",
    locality: "Bratislava",
    region: "Bratislavský kraj",
    postalCode: "831 52",
    countryName: "Slovakia",
  },

  // Максимальные Twitter Cards
  twitter: {
    card: "summary_large_image",
    site: "@Fastcreditsk",
    creator: "@Fastcreditsk",
    title: "FastCredit Forum - Finančné poradenstvo na Slovensku",
    description:
      "Bezplatné finančné poradenstvo od expertov na Slovensku ✅ Pôžičky, banky, poistenie ✅ Odpovede do 24h",
    images: {
      url: "https://fastcredit.sk/forum/og.jpg",
      alt: "FastCredit Forum - Finančné poradenstvo",
      width: 1200,
      height: 630,
    },
  },

  // Иконки и манифест
  icons: {
    icon: [
      // Основные favicon
      {
        url: "/forum/favicon.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon",
      },
      { url: "/forum/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/forum/favicon-32x32.png", sizes: "32x32", type: "image/png" },

      // Android Chrome иконки
      {
        url: "/forum/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/forum/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/forum/favicon.ico",
    apple: [
      // Apple Touch Icon (основная)
      {
        url: "/forum/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      // SVG логотип
      {
        rel: "icon",
        url: "/forum/logo.svg",
        type: "image/svg+xml",
      },
      // Для Safari pinned tab
      {
        rel: "mask-icon",
        url: "/forum/logo.svg",
        color: "#049ca1",
      },
    ],
  },

  // Манифест
  manifest: "/forum/site.webmanifest",

  // Максимальные дополнительные мета-теги
  other: {
    // Цвета темы
    "theme-color": "#049ca1",

    // PWA настройки
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "FastCredit Forum",
    "application-name": "FastCredit Forum",

    // Geo tagging для Словакии - МАКСИМУМ
    "geo.region": "SK",
    "geo.country": "Slovakia",
    "geo.placename": "Slovakia",
    "geo.position": "48.669026;19.699024",
    ICBM: "48.669026, 19.699024",

    // Языковые настройки
    language: "sk",
    "content-language": "sk-SK",
    locale: "sk_SK",
    lang: "sk",
    target: "Slovakia",
    coverage: "Slovakia",
    topic: "Financial services, loans, banking, insurance, investments",
    summary: "Ask financial questions and get free expert answers in Slovakia",
    classification: "Financial Services",
    category: "Financial Advisory",
    owner: "FastCredit.sk",
    url: "https://fastcredit.sk/forum/",

    // Schema.org hints
    "schema.org": "https://schema.org/QAPage",
    itemType: "https://schema.org/QAPage",

    // Максимум для всех возможных ботов
    bingbot: "index,follow",
    googlebot: "index,follow",
  },

  // Bookmarks и favorites
  bookmarks: ["https://fastcredit.sk/forum/"],
  category: "Financial Services",
};

// Компонент для максимальных prefetch и preload
function MaxSEOPrefetches() {
  return (
    <>
      {/* DNS Prefetching для всех внешних ресурсов */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//fastcredit.sk" />
      <link
        rel="dns-prefetch"
        href={process.env.NEXT_PUBLIC_API_URL || "//localhost:3001"}
      />

      {/* Preconnect для критически важных ресурсов */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://fastcredit.sk" />
      <link
        rel="preconnect"
        href={process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}
      />

      {/* Preload критически важных ресурсов */}
      <link
        rel="preload"
        href="/forum/logo.svg"
        as="image"
        type="image/svg+xml"
      />
      <link rel="preload" href="/forum/og.jpg" as="image" type="image/jpeg" />
      <link
        rel="preload"
        href="/forum/favicon-32x32.png"
        as="image"
        type="image/png"
      />
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
        as="style"
      />
    </>
  );
}

export default async function RootLayout({ children }) {
  const user = await getServerUser();

  return (
    <html
      lang="sk"
      className={montserrat.variable}
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <head>
        {/* Дополнительные мета теги в head */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
        <meta httpEquiv="Expires" content="Wed, 31 Dec 2025 23:59:59 GMT" />

        {/* Rich Snippets микроразметка */}
        <meta itemProp="name" content="FastCredit Forum" />
        <meta
          itemProp="description"
          content="Bezplatné finančné poradenstvo od expertov na Slovensku"
        />
        <meta itemProp="image" content="https://fastcredit.sk/forum/og.jpg" />

        <link
          rel="sitemap"
          type="application/xml"
          href="https://fastcredit.sk/sitemap.xml"
        />
        {/* Максимальные prefetches */}
        <MaxSEOPrefetches />
        {/* <Script
          id="forum-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getForumBaseStructuredData()),
          }}
        /> */}
      </head>

      <body itemScope itemType="https://schema.org/WebPage">
        {/* Основная структура */}
        <div itemScope itemType="https://schema.org/WebSite">
          <meta itemProp="url" content="https://fastcredit.sk/forum/" />
          <meta itemProp="name" content="FastCredit Forum" />

          <Header user={user} />

          <main
            id="main-content"
            role="main"
            itemType="https://schema.org/QAPage"
          >
            {children}
          </main>

          <Footer />
        </div>
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
