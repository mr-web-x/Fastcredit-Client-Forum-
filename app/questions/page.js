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
  // Читаем search параметры для фильтрации и пагинации
  const params = await searchParams;

  const apiParams = {
    page: parseInt(params.page) || 1,
    limit: 20,
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

  console.log("🚀 Final API params:", apiParams);

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
