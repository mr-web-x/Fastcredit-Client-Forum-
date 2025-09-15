// Файл: app/profile/all-questions/page.js

import { requireAuth } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";
import { getAllQuestionsAction } from "@/app/actions/questions";
import AllQuestionsPage from "@/src/features/ProfilePage/AllQuestionsPage/AllQuestionsPage";

export const metadata = {
  title: "Všetky otázky | FastCredit Forum",
  description: "Zobrazte a spravujte všetky otázky na FastCredit Forum",
};

export default async function ProfileAllQuestions({ searchParams }) {
  // Получаем авторизованного пользователя (redirect если нет авторизации)
  const user = await requireAuth();

  // Проверка прав доступа - только эксперты, правники, админы и модераторы
  if (!["expert", "lawyer", "admin", "moderator"].includes(user.role)) {
    redirect("/forum/profile");
  }

  // Параметры фильтрации и пагинации из URL
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const sortBy = searchParams?.sortBy || "createdAt";
  const sortOrder = searchParams?.sortOrder || "desc";

  // Парсим новые фильтры из URL
  const hasApprovedAnswers =
    searchParams?.hasApprovedAnswers === "true"
      ? true
      : searchParams?.hasApprovedAnswers === "false"
      ? false
      : null;
  const hasPendingAnswers =
    searchParams?.hasPendingAnswers === "true"
      ? true
      : searchParams?.hasPendingAnswers === "false"
      ? false
      : null;

  // Загружаем все вопросы с сервера через Server Action
  let questionsData = { items: [], pagination: null };
  let error = null;

  try {
    console.log(`🔍 Loading all questions for ${user.role} ${user.id}:`, {
      page,
      limit,
      hasApprovedAnswers,
      hasPendingAnswers,
      sortBy,
      sortOrder,
    });

    const result = await getAllQuestionsAction({
      page,
      limit,
      hasApprovedAnswers,
      hasPendingAnswers,
      sortBy,
      sortOrder,
    });

    if (result.success) {
      questionsData = result.data;
    } else {
      error = result.error;
      console.error("❌ Failed to load all questions:", result.error);
    }

    console.log(`✅ All questions loaded:`, {
      userRole: user.role,
      itemsCount: questionsData.items?.length || 0,
      pagination: questionsData.pagination,
    });
  } catch (loadError) {
    console.error("❌ Server error loading all questions:", loadError);
    error = "Nepodarilo sa načítať otázky. Skúste to znovu.";

    // Fallback структура при ошибке
    questionsData = {
      items: [],
      pagination: {
        page: 1,
        totalPages: 0,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  // Передаем все данные в клиентский компонент
  return (
    <AllQuestionsPage
      user={user}
      initialQuestions={questionsData.items}
      initialPagination={questionsData.pagination}
      initialFilters={{
        page,
        limit,
        hasApprovedAnswers,
        hasPendingAnswers,
        sortBy,
        sortOrder,
      }}
      error={error}
    />
  );
}
