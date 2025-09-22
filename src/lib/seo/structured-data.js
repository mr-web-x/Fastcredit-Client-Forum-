// src/lib/seo/structured-data.js

/**
 * Базовые структурированные данные для ФОРУМА FastCredit
 */
export function getForumBaseStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://fastcredit.sk/forum/#website",
        url: "https://fastcredit.sk/forum/",
        name: "FastCredit Forum",
        description:
          "Bezplatné finančné poradenstvo od expertov na Slovensku. Zadajte otázku a získajte odpoveď zdarma.",
        inLanguage: "sk-SK",
        isPartOf: {
          "@type": "WebSite",
          url: "https://fastcredit.sk/",
          name: "FastCredit.sk",
        },
        publisher: { "@id": "https://fastcredit.sk/forum/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://fastcredit.sk/forum/questions?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://fastcredit.sk/forum/#organization",
        name: "FastCredit Forum",
        url: "https://fastcredit.sk/forum/",
        logo: {
          "@type": "ImageObject",
          url: "https://fastcredit.sk/forum/logo.svg",
          width: 87,
          height: 58,
        },
        description:
          "Online platforma pre bezplatné finančné poradenstvo na Slovensku",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bratislava",
          addressCountry: "SK",
          addressRegion: "Bratislavský kraj",
        },
        areaServed: {
          "@type": "Country",
          name: "Slovakia",
          alternateName: "Slovenská republika",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Slovak", "sk"],
          url: "https://fastcredit.sk/forum/",
          areaServed: "SK",
        },
        knowsAbout: [
          "Finančné poradenstvo",
          "Pôžičky",
          "Úvery",
          "Banky",
          "Poistenie",
          "Investície",
          "Osobné financie",
        ],
      },
    ],
  };
}

/**
 * Структурированные данные для главной страницы форума /forum/
 */
export function getForumHomepageStructuredData(latestQuestions = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "QAPage",
        "@id": "https://fastcredit.sk/forum/#qapage",
        url: "https://fastcredit.sk/forum/",
        name: "FastCredit Forum - Bezplatné finančné poradenstvo",
        description:
          "Zadajte finančnú otázku a získajte odpoveď od experta zdarma. Pôžičky, banky, poistenie, investície.",
        inLanguage: "sk-SK",
        datePublished: "2024-01-01T00:00:00+01:00",
        dateModified: new Date().toISOString(),
        about: [
          {
            "@type": "Thing",
            name: "Pôžičky a úvery",
            description:
              "Otázky o mikropôžičkách, spotrebiteľských úveroch, hypotékach",
          },
          {
            "@type": "Thing",
            name: "Bankové služby",
            description:
              "Otázky o bankových účtoch, platobných kartách, bankovních službách",
          },
          {
            "@type": "Thing",
            name: "Poistenie",
            description: "Otázky o životnom, majetkovom a zdravotnom poistení",
          },
          {
            "@type": "Thing",
            name: "Investície",
            description: "Otázky o investovaní, sporení a finančnom plánovaní",
          },
        ],
        audience: {
          "@type": "Audience",
          audienceType: "Consumers seeking free financial advice in Slovakia",
          geographicArea: {
            "@type": "Country",
            name: "Slovakia",
          },
        },
        provider: { "@id": "https://fastcredit.sk/forum/#organization" },
      },
      {
        "@type": "Service",
        "@id": "https://fastcredit.sk/forum/#service",
        name: "Bezplatné finančné poradenstvo",
        description:
          "Zadajte otázku a získajte odpoveď od finančného experta úplne zadarmo",
        provider: { "@id": "https://fastcredit.sk/forum/#organization" },
        serviceType: "Free Financial Advisory Service",
        category: "Financial Consultation",
        areaServed: {
          "@type": "Country",
          name: "Slovakia",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          description: "Bezplatné finančné poradenstvo online",
          availability: "https://schema.org/InStock",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Typy finančného poradenstva",
          itemListElement: [
            {
              "@type": "Service",
              name: "Poradenstvo k pôžičkám",
              description: "Pomoc pri výbere pôžičky, porovnanie podmienok",
            },
            {
              "@type": "Service",
              name: "Bankové poradenstvo",
              description: "Rady k bankovým produktom a službám",
            },
            {
              "@type": "Service",
              name: "Poistné poradenstvo",
              description: "Pomoc pri výbere vhodného poistenia",
            },
          ],
        },
      },
      // Ak máme najnovšie otázky
      ...(latestQuestions.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": "https://fastcredit.sk/forum/#latestquestions",
              name: "Najnovšie finančné otázky",
              description: "Posledné otázky od používateľov",
              numberOfItems: latestQuestions.length,
              itemListElement: latestQuestions
                .slice(0, 5)
                .map((question, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Question",
                    name: question.title,
                    url: `https://fastcredit.sk/forum/questions/${
                      question.slug || question._id
                    }`,
                    dateCreated: question.createdAt,
                    author: {
                      "@type": "Person",
                      name:
                        `${question.author?.firstName} ${question.author?.lastName}` ||
                        "Používateľ",
                    },
                    answerCount: question.answersCount || 0,
                  },
                })),
            },
          ]
        : []),
    ],
  };
}

/**
 * FAQ для форума
 */
export function getForumFAQStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://fastcredit.sk/forum/#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Ako môžem zadať finančnú otázku?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Registrujte sa zadarmo a kliknite na 'Zadať otázku'. Opíšte svoj finančný problém a expert vám odpovie do 24 hodín.",
        },
      },
      {
        "@type": "Question",
        name: "Je poradenstvo naozaj zadarmo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Áno, všetko finančné poradenstvo na našom fóre je úplne bezplatné. Experti poskytujú rady zadarmo.",
        },
      },
      {
        "@type": "Question",
        name: "Kto mi bude odpovedať na otázky?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Odpovedajú certifikovaní finanční experti a právni poradcovia s praktickými skúsenosťami.",
        },
      },
      {
        "@type": "Question",
        name: "Ako rýchlo dostanem odpoveď?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Experti odpovedajú zvyčajne do 24 hodín. Na urgentné otázky môžete dostať odpoveď aj skôr.",
        },
      },
    ],
  };
}

/**
 * Структурированные данные для /forum/questions
 */
export function getQuestionsListStructuredData({
  questions = [],
  category = "",
  search = "",
  page = 1,
}) {
  const baseUrl = "https://fastcredit.sk/forum/questions";
  let pageTitle = `Všetky finančné otázky | Web, stránka ${page}`;
  let pageDescription = "Prehliadajte finančné otázky a odpovede od expertov";

  if (category === "expert") {
    pageTitle = "Finančné otázky pre expertov";
    pageDescription = "Otázky o pôžičkách, úveroch a finančných službách";
  } else if (category === "lawyer") {
    pageTitle = "Právne finančné otázky";
    pageDescription = "Právne otázky týkajúce sa financií a zmlúv";
  }

  if (search) {
    pageTitle = `Vyhľadávanie: "${search}"`;
    pageDescription = `Finančné otázky obsahujúce "${search}"`;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}#page`,
        url: baseUrl,
        name: pageTitle,
        description: pageDescription,
        inLanguage: "sk-SK",
        isPartOf: { "@id": "https://fastcredit.sk/forum/#website" },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Forum",
              item: "https://fastcredit.sk/forum/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Otázky",
              item: baseUrl,
            },
          ],
        },
      },
      ...(questions.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${baseUrl}#questionslist`,
              name: pageTitle,
              numberOfItems: questions.length,
              itemListElement: questions.map((question, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Question",
                  name: question.title,
                  text: question.content?.substring(0, 200) + "...",
                  url: `https://fastcredit.sk/forum/questions/${
                    question.slug || question._id
                  }`,
                  dateCreated: question.createdAt,
                  author: {
                    "@type": "Person",
                    name:
                      `${question.author?.firstName} ${question.author?.lastName}` ||
                      "Používateľ",
                  },
                  answerCount: question.answersCount || 0,
                },
              })),
            },
          ]
        : []),
    ],
  };
}

/**
 * Структурированные данные для /forum/questions/[slug]
 */
export function getQuestionDetailStructuredData(question, answers = []) {
  if (!question) return null;

  const questionUrl = `https://fastcredit.sk/forum/questions/${
    question.slug || question._id
  }`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "QAPage",
        "@id": `${questionUrl}#qapage`,
        url: questionUrl,
        name: question.title,
        description: question.content?.substring(0, 300) + "...",
        inLanguage: "sk-SK",
        isPartOf: { "@id": "https://fastcredit.sk/forum/#website" },
        datePublished: question.createdAt,
        dateModified: question.updatedAt || question.createdAt,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Forum",
              item: "https://fastcredit.sk/forum/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Otázky",
              item: "https://fastcredit.sk/forum/questions",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: question.title,
              item: questionUrl,
            },
          ],
        },
        mainEntity: {
          "@type": "Question",
          "@id": `${questionUrl}#question`,
          name: question.title,
          text: question.content,
          dateCreated: question.createdAt,
          author: {
            "@type": "Person",
            name:
              `${question.author?.firstName} ${question.author?.lastName}` ||
              "Používateľ",
          },
          answerCount: answers.length,
          // Лучший ответ (принятый)
          ...(answers.some((a) => a.isAccepted && a.isApproved) && {
            acceptedAnswer: {
              "@type": "Answer",
              "@id": `${questionUrl}#accepted-answer`,
              text: answers.find((a) => a.isAccepted && a.isApproved)?.content,
              dateCreated: answers.find((a) => a.isAccepted && a.isApproved)
                ?.createdAt,
              author: {
                "@type": "Person",
                name: "Expert",
                jobTitle: "Finančný expert",
              },
            },
          }),
          // Другие ответы
          ...(answers.filter((a) => !a.isAccepted && a.isApproved).length >
            0 && {
            suggestedAnswer: answers
              .filter((a) => !a.isAccepted && a.isApproved)
              .slice(0, 3)
              .map((answer) => ({
                "@type": "Answer",
                "@id": `${questionUrl}#answer-${answer._id}`,
                text: answer.content?.substring(0, 500) + "...",
                dateCreated: answer.createdAt,
                author: {
                  "@type": "Person",
                  name: "Expert",
                  jobTitle: "Finančný expert",
                },
              })),
          }),
        },
      },
    ],
  };
}

/**
 * Структурированные данные для /forum/login
 */
export function getLoginPageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://fastcredit.sk/forum/login#webpage",
    url: "https://fastcredit.sk/forum/login",
    name: "Prihlásenie do FastCredit Forum",
    description:
      "Prihláste sa do svojho účtu a získajte prístup k bezplatnému finančnému poradenstvu",
    inLanguage: "sk-SK",
    isPartOf: { "@id": "https://fastcredit.sk/forum/#website" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Forum",
          item: "https://fastcredit.sk/forum/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Prihlásenie",
          item: "https://fastcredit.sk/forum/login",
        },
      ],
    },
  };
}

/**
 * Структурированные данные для /forum/register
 */
export function getRegisterPageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://fastcredit.sk/forum/register#webpage",
    url: "https://fastcredit.sk/forum/register",
    name: "Registrácia do FastCredit Forum",
    description:
      "Vytvorte si bezplatný účet a začnite sa pýtať finančných expertov",
    inLanguage: "sk-SK",
    isPartOf: { "@id": "https://fastcredit.sk/forum/#website" },
    about: {
      "@type": "Service",
      name: "Bezplatná registrácia",
      description:
        "Vytvorte si účet a získajte prístup k finančnému poradenstvu zadarmo",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Forum",
          item: "https://fastcredit.sk/forum/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Registrácia",
          item: "https://fastcredit.sk/forum/register",
        },
      ],
    },
  };
}
