// Файл: app/profile/my-questions/page.js

import { requireAuth } from "@/src/lib/auth-server";
import { questionsService } from "@/src/services/server";
import MyQuestionsPage from "@/src/features/ProfilePage/MyQuestionsPage/MyQuestionsPage";

export const metadata = {
  title: "Moje otázky | FastCredit Forum",
  description: "Zobrazte a spravujte svoje otázky na FastCredit Forum",
};

export default async function ProfileMyQuestions({ searchParams }) {
  // Получаем авторизованного пользователя (redirect если нет авторизации)
  const user = await requireAuth();

  // Параметры пагинации и фильтрации из URL
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const status = searchParams?.status || "";

  // Загружаем вопросы пользователя с сервера
  let questionsData = { items: [], pagination: null };
  let error = null;

  try {
    console.log(`🔍 Loading questions for user ${user.id}:`, {
      page,
      limit,
      status,
    });

    const result = await questionsService.getUserQuestions(user.id, {
      page,
      limit,
      status,
    });

    // Проверяем структуру ответа
    if (result && typeof result === "object") {
      // Если есть структура { data: [], pagination: {} }
      questionsData = {
        items: Array.isArray(result.data) ? result.data : [],
        pagination: result.pagination || {
          page,
          total: Math.ceil((result.total || 0) / limit),
          totalItems: result.total || 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    console.log(`✅ Questions loaded:`, {
      itemsCount: questionsData.items?.length || 0,
      pagination: questionsData.pagination,
    });
  } catch (loadError) {
    console.error("❌ Failed to load user questions:", loadError);
    error = "Nepodarilo sa načítať vaše otázky. Skúste to znovu.";

    // Fallback структура при ошибке
    questionsData = {
      items: [],
      pagination: {
        page: 1,
        total: 0,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  // Передаем все данные в клиентский компонент
  return (
    <MyQuestionsPage
      user={user}
      initialQuestions={questionsData.items}
      initialPagination={questionsData.pagination}
      initialFilters={{
        page,
        limit,
        status,
      }}
      error={error}
    />
  );
}
