// Файл: app/questions/page.js

import { questionsService, categoriesService } from "@/src/services/server";
import QuestionsListPage from "@/src/features/QuestionsListPage/QuestionsListPage";
import Script from "next/script";
import { getQuestionsListStructuredData } from "@/src/lib/seo/structured-data";

export const metadata = {
  title: "Všetky finančné otázky a odpovede | FastCredit Forum Slovensko",
  description:
    "Prehliadajte finančné otázky a expertné odpovede na FastCredit fóre. Nájdite riešenia pre pôžičky, banky, poistenie a investície. Odpovede na finančné otázky od dôveryhodných odborníkov na Slovensku.",

  // Специфичные keywords для главной
  keywords: [
    // Главные термины с высокой конверсией
    "bezplatné finančné poradenstvo slovensko ",
    "finančný expert online zdarma slovensko",
    "ask finančné otázky slovensko",
    "pôžičky rady expertov slovensko",

    // Проблемно-ориентированные запросы
    "neviem získať pôžičku slovensko pomoc",
    "aká banka je najlepšia slovensko",
    "ako investovať peniaze slovensko začiatočník",

    // Lokálne long-tail
    "finančný poradca bratislava zdarma online",
    "pôžičky košice expert rady",
    "banky prešov porovnanie",

    // Sezónne a aktuálne
    "daňové priznanie slovensko pomoc",
    "dph živnostník slovensko rady",
    "materská dovolenka financie slovensko",
  ].join(", "),

  // Максимальный OpenGraph
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://fastcredit.sk/forum/questions",
    siteName: "FastCredit Forum - Finančné poradenstvo na Slovensku",
    title: "Všetky finančné otázky a odpovede | FastCredit Forum Slovensko",
    description:
      "Prehliadajte finančné otázky a expertné odpovede na FastCredit fóre. Nájdite riešenia pre pôžičky, banky, poistenie a investície. Odpovede na finančné otázky od dôveryhodných odborníkov na Slovensku.",
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
    title: "Všetky finančné otázky a odpovede | FastCredit Forum Slovensko",
    description:
      "Prehliadajte finančné otázky a expertné odpovede na FastCredit fóre. Nájdite riešenia pre pôžičky, banky, poistenie a investície",
    images: {
      url: "https://fastcredit.sk/forum/og.jpg",
      alt: "FastCredit Forum - Finančné poradenstvo",
      width: 1200,
      height: 630,
    },
  },

  alternates: {
    canonical: "https://fastcredit.sk/forum/questions",
  },
};

export default async function QuestionsPage({ searchParams }) {
  // Читаем search параметры для фильтрации и пагинации
  const params = await searchParams;

  const apiParams = {
    page: parseInt(params.page) || 1,
    limit: 15,
    category: params.category || null,
    priority: params.priority || null,
    sortBy: params.sortBy || "createdAt",
    sortOrder: parseInt(params.sortOrder) || -1,
    search: params.search || null,
    status: "answered", // Всегда только вопросы с ответами
  };

  // Обработка period - конвертируем в fromDate
  if (params.period) {
    const now = new Date();
    let fromDate;

    switch (params.period) {
      case "day":
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "week":
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    if (fromDate) {
      apiParams.fromDate = fromDate.toISOString();
    }
  }

  // Убираем null значения
  Object.keys(apiParams).forEach((key) => {
    if (apiParams[key] === null) {
      delete apiParams[key];
    }
  });

  // Загружаем данные с сервера
  let questionsData = { items: [], pagination: null };
  let categories = [];
  let error = null;

  try {
    // Параллельно загружаем вопросы и категории с timeout
    const TIMEOUT = 10000; // 10 секунд

    const questionsPromise = Promise.race([
      questionsService.getLatest(apiParams),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API timeout - questions")), TIMEOUT)
      ),
    ]);

    const categoriesPromise = Promise.race([
      categoriesService.getAll(true), // с статистикой
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API timeout - categories")), TIMEOUT)
      ),
    ]);

    const [questionsResult, categoriesResult] = await Promise.allSettled([
      questionsPromise,
      categoriesPromise,
    ]);

    // Обработка результата вопросов
    if (questionsResult.status === "fulfilled") {
      questionsData = questionsResult.value;

      // Проверяем структуру данных
      if (!questionsData.items) {
        questionsData = { items: [], pagination: null };
      }
    } else {
      // Детальная обработка ошибок
      const errorMsg = questionsResult.reason?.message || "Unknown error";
      if (errorMsg.includes("timeout")) {
        error = "Načítavanie otázok trvá príliš dlho. Skúste to znovu.";
      } else if (errorMsg.includes("404")) {
        error = "API endpoint pre otázky nebol nájdený.";
      } else if (errorMsg.includes("500")) {
        error = "Chyba servera pri načítavaní otázok.";
      } else {
        error = "Nepodarilo sa načítať otázky. Skúste to znovu.";
      }
    }

    // Обработка результата категорий
    if (categoriesResult.status === "fulfilled") {
      categories = categoriesResult.value;

      // Проверяем структуру категорий
      if (!Array.isArray(categories)) {
        categories = [];
      }
    } else {
      // Категории не критичны, можем продолжать без них
      categories = [];
    }
  } catch (err) {
    error = "Neočakávaná chyba pri načítaní dát. Obnovte stránku.";
  }

  // Подготавливаем filter options для frontend (без статусов)
  const filterOptions = {
    categories: categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
      count: cat.questionsCount || 0,
    })),
    periods: [
      { value: "", label: "Všetky" },
      { value: "day", label: "Za deň" },
      { value: "week", label: "Za týždeň" },
      { value: "month", label: "Za mesiac" },
    ],
    sortOptions: [
      { value: "createdAt", label: "Najnovšie" },
      { value: "views", label: "Najviac zobrazení" },
      { value: "answersCount", label: "Najviac odpovedí" },
    ],
  };

  // Текущие фильтры для frontend (без статуса)
  const currentFilters = {
    category: params.category || "",
    period: params.period || "",
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || "-1",
  };

  return (
    <>
      <Script
        id="forum-questions-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getQuestionsListStructuredData(
              questionsData.items || [],
              params.category || "",
              params.search || null,
              parseInt(params.page) || 1
            )
          ),
        }}
      />
      <QuestionsListPage
        questions={questionsData.items || []}
        pagination={questionsData.pagination}
        filterOptions={filterOptions}
        currentFilters={currentFilters}
        error={error}
      />
      <Script
        src="https://calculator-widget.vercel.app/widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}
