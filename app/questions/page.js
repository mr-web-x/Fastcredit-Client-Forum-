// Файл: app/questions/page.js

import { questionsService, categoriesService } from "@/src/services/server";
import QuestionsListPage from "@/src/features/QuestionsListPage/QuestionsListPage";

export const metadata = {
  title: "Všetky otázky | FastCredit Forum",
  description:
    "Prehliadajte všetky otázky na FastCredit fóre. Nájdite odpovede na finančné otázky od expertov.",
  keywords:
    "otázky, finančné poradenstvo, FastCredit, fórum, experti, pôžičky, banky",
};

export default async function QuestionsPage({ searchParams }) {
  // Čítame search parametre pre filtrovanie a pagináciu
  const params = await searchParams;

  const page = parseInt(params.page) || 1;
  const limit = 20; // Podľa ТЗ - 20 otázok na stránku
  const category = params.category || "";
  const status = params.status || "";
  const period = params.period || "";
  const priority = params.priority || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "-1";

  // Отладочная информация
  console.log("🔍 Filter params:", {
    category,
    status,
    period,
    priority,
    sortBy,
  });

  // Исправляем маппинг статусов для backend
  let backendStatus = status;
  if (status === "unanswered") {
    // Backend может ожидать другое значение
    backendStatus = "pending"; // или "open", или просто "unanswered"
  } else if (status === "answered") {
    backendStatus = "answered";
  } else if (status === "closed") {
    backendStatus = "closed";
  }

  // Улучшаем маппинг sortBy для backend
  let backendSortBy = sortBy;
  let backendSortOrder = sortOrder;

  switch (sortBy) {
    case "popular":
      backendSortBy = "likes";
      backendSortOrder = "-1"; // По убыванию лайков
      break;
    case "answers":
      backendSortBy = "answersCount";
      backendSortOrder = "-1"; // По убыванию количества ответов
      break;
    case "createdAt":
    default:
      backendSortBy = "createdAt";
      backendSortOrder = "-1"; // Новые сверху
      break;
  }

  // Pripravíme parametre pre API
  const apiParams = {
    page,
    limit,
    sortBy: backendSortBy,
    sortOrder: backendSortOrder,
  };

  // Pridáme filtere len ak sú nastavené
  if (category) {
    apiParams.category = category;
    console.log("📂 Category filter:", category);
  }

  if (backendStatus) {
    apiParams.status = backendStatus;
    console.log("📊 Status filter:", backendStatus, "(original:", status, ")");
  }

  if (priority) {
    apiParams.priority = priority;
    console.log("⚡ Priority filter:", priority);
  }

  // Pre period filter - prepočítame na dátumy
  if (period) {
    const now = new Date();
    let fromDate;

    switch (period) {
      case "day":
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "week":
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        fromDate = null;
    }

    if (fromDate) {
      apiParams.fromDate = fromDate.toISOString();
      console.log("📅 Period filter:", period, "->", fromDate.toISOString());
    }
  }

  console.log("🚀 Final API params:", apiParams);

  // Načítame dáta zo servera
  let questionsData = { items: [], pagination: null };
  let categories = [];
  let error = null;

  try {
    // Paralelne načítame otázky a kategórie s timeout
    const TIMEOUT = 10000; // 10 секунд

    const questionsPromise = Promise.race([
      questionsService.getLatest(apiParams),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API timeout - questions")), TIMEOUT)
      ),
    ]);

    const categoriesPromise = Promise.race([
      categoriesService.getAll(true), // s štatistikami
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
      console.log(
        "✅ Questions loaded:",
        questionsData.items?.length || 0,
        "items"
      );

      // Проверяем структуру данных
      if (!questionsData.items) {
        console.warn("⚠️ No items in questionsData:", questionsData);
        questionsData = { items: [], pagination: null };
      }
    } else {
      console.error("❌ Failed to load questions:", questionsResult.reason);

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
      console.log("✅ Categories loaded:", categories?.length || 0, "items");

      // Проверяем структуру категорий
      if (!Array.isArray(categories)) {
        console.warn("⚠️ Categories is not array:", categories);
        categories = [];
      }
    } else {
      console.error("❌ Failed to load categories:", categoriesResult.reason);
      // Категории не критичны, можем продолжать без них
      categories = [];
    }
  } catch (err) {
    console.error("💥 Unexpected error loading page data:", err);
    error = "Neočakávaná chyba pri načítaní dát. Obnovte stránku.";
  }

  // Pripravíme filter options pre frontend
  const filterOptions = {
    categories: categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
      count: cat.questionsCount || 0,
    })),
    statuses: [
      { value: "", label: "Všetky", count: null },
      { value: "unanswered", label: "Bez odpovedí", count: null },
      { value: "answered", label: "Zodpovedané", count: null },
      { value: "closed", label: "Uzavreté", count: null },
    ],
    periods: [
      { value: "", label: "Všetky" },
      { value: "day", label: "Za deň" },
      { value: "week", label: "Za týždeň" },
      { value: "month", label: "Za mesiac" },
    ],
    sortOptions: [
      { value: "createdAt", label: "Najnovšie" },
      { value: "popular", label: "Najpopulárnejšie" },
      { value: "answers", label: "Najviac odpovedí" },
    ],
  };

  // Aktuálne filtre pre frontend (используем оригинальные значения)
  const currentFilters = {
    category,
    status, // Оригинальное значение, не backend
    period,
    sortBy,
    sortOrder,
  };

  // Отладочная информация перед рендером
  console.log("📊 Final state:", {
    questionsCount: questionsData.items?.length || 0,
    pagination: questionsData.pagination,
    categoriesCount: categories.length,
    currentFilters,
    hasError: !!error,
  });

  return (
    <QuestionsListPage
      questions={questionsData.items || []}
      pagination={questionsData.pagination}
      filterOptions={filterOptions}
      currentFilters={currentFilters}
      error={error}
    />
  );
}
