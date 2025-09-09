// Файл: app/profile/users/page.js

import { requireAuth } from "@/src/lib/auth-server";
import { notFound } from "next/navigation";
import { getUsersAction } from "@/app/actions/users";
import UsersPage from "@/src/features/ProfilePage/UsersPage/UsersPage";

export const metadata = {
  title: "Správa používateľov | FastCredit Forum",
  description: "Správa a modifikácia používateľov na FastCredit Forum",
};

export default async function ProfileUsers({ searchParams }) {
  // Получаем авторизованного пользователя (redirect если нет авторизации)
  const user = await requireAuth();

  // Только админы могут видеть эту страницу
  if (user.role !== "admin") {
    notFound();
  }

  // Параметры фильтрации и пагинации из URL
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 20;
  const role = searchParams?.role || "";
  const isActive = searchParams?.isActive || "";
  const search = searchParams?.search || "";
  const sortBy = searchParams?.sortBy || "createdAt";

  // Загружаем пользователей с сервера через Server Action
  let usersData = { items: [], pagination: null };
  let error = null;

  try {
    console.log(`🔍 Loading users for admin ${user.id}:`, {
      page,
      limit,
      role,
      isActive,
      search,
      sortBy,
    });

    const result = await getUsersAction({
      page,
      limit,
      role,
      isActive,
      search,
      sortBy,
    });

    if (result.success) {
      usersData = result.data;
    } else {
      error = result.error;
      console.error("❌ Failed to load users:", result.error);
    }

    console.log(`✅ Users loaded:`, {
      itemsCount: usersData.items?.length || 0,
      pagination: usersData.pagination,
    });
  } catch (loadError) {
    console.error("❌ Server error loading users:", loadError);
    error = "Nepodarilo sa načítať používateľov. Skúste to znovu.";

    // Fallback структура при ошибке
    usersData = {
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
    <UsersPage
      user={user}
      initialUsers={usersData.items}
      initialPagination={usersData.pagination}
      initialFilters={{
        page,
        limit,
        role,
        isActive,
        search,
        sortBy,
      }}
      error={error}
    />
  );
}
