// Файл: app/profile/all-questions/page.js

import { requireAuth } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";
import { getNewQuestionsAction } from "@/app/actions/questions";
import AllQuestionsPage from "@/src/features/ProfilePage/AllQuestionsPage/AllQuestionsPage";

export const metadata = {
  title: "Nové otázky | FastCredit Forum",
  description: "Zobrazte nové otázky na FastCredit Forum",
};

export default async function ProfileNewQuestions({ searchParams }) {
  // Получаем авторизованного пользователя (redirect если нет авторизации)
  const user = await requireAuth();

  // Проверка прав доступа - только эксперты, правники, админы и модераторы
  if (!["expert", "lawyer", "admin", "moderator"].includes(user.role)) {
    redirect("/profile");
  }

  // Параметры фильтрации и пагинации из URL
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const priority = searchParams?.priority || "";

  // Загружаем новые вопросы с сервера через Server Action
  let questionsData = { items: [], pagination: null };
  let error = null;

  try {
    console.log(`🔍 Loading new questions for ${user.role} ${user.id}:`, {
      page,
      limit,
      priority,
    });

    const result = await getNewQuestionsAction({
      page,
      limit,
      priority,
    });

    if (result.success) {
      questionsData = result.data;
    } else {
      error = result.error;
      console.error("❌ Failed to load new questions:", result.error);
    }

    console.log(`✅ New questions loaded:`, {
      userRole: user.role,
      itemsCount: questionsData.items?.length || 0,
      pagination: questionsData.pagination,
    });
  } catch (loadError) {
    console.error("❌ Server error loading new questions:", loadError);
    error = "Nepodarilo sa načítať nové otázky. Skúste to znovu.";

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
        priority,
      }}
      error={error}
    />
  );
}
