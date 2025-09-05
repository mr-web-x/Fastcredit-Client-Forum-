// Файл: app/questions/page.js

import { questionsService, categoriesService } from "@/src/services/server";
import QuestionsListPage from "@/src/components/QuestionsListPage/QuestionsListPage";

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

  // Upravíme sortBy podľa frontendových hodnôt
  let backendSortBy = sortBy;
  if (sortBy === "popular") {
    backendSortBy = "likes";
  } else if (sortBy === "answers") {
    backendSortBy = "answersCount";
  }

  // Připravíme parametre pre API
  const apiParams = {
    page,
    limit,
    sortBy: backendSortBy,
    sortOrder,
  };

  // Pridáme filtere len ak sú nastavené
  if (category) apiParams.category = category;
  if (status) apiParams.status = status;
  if (priority) apiParams.priority = priority;

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
    }
  }

  // Načítame dáta zo servera
  let questionsData = { items: [], pagination: null };
  let categories = [];
  let error = null;

  try {
    // Paralelne načítame otázky a kategórie
    const [questionsResult, categoriesResult] = await Promise.allSettled([
      questionsService.getLatest(apiParams),
      categoriesService.getAll(true), // s štatistikami
    ]);

    if (questionsResult.status === "fulfilled") {
      questionsData = questionsResult.value;
    } else {
      console.error("Failed to load questions:", questionsResult.reason);
      error = "Nepodarilo sa načítať otázky";
    }

    if (categoriesResult.status === "fulfilled") {
      categories = categoriesResult.value;
    } else {
      console.error("Failed to load categories:", categoriesResult.reason);
      // Kategórie nie sú kritické, môžeme pokračovať bez nich
    }
  } catch (err) {
    console.error("Error loading page data:", err);
    error = "Chyba pri načítaní dát";
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

  // Aktuálne filtre pre frontend
  const currentFilters = {
    category,
    status,
    period,
    sortBy,
    sortOrder,
  };

  return (
    <QuestionsListPage
      questions={questionsData.items}
      pagination={questionsData.pagination}
      filterOptions={filterOptions}
      currentFilters={currentFilters}
      error={error}
    />
  );
}
