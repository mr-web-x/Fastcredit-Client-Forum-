// Файл: app/actions/users.js

"use server";

import { revalidatePath } from "next/cache";
import { getServerUser } from "@/src/lib/auth-server";
import { usersService } from "@/src/services/server";

/**
 * Получение списка пользователей (только для админов)
 */
export async function getUsersAction(params = {}) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return {
        success: false,
        error: "Nemáte oprávnenie na túto akciu",
        data: null,
      };
    }

    const {
      page = 1,
      limit = 20,
      role = "",
      isActive = "",
      search = "",
      sortBy = "createdAt",
    } = params;

    console.log(`🔍 Loading users for admin ${user.id}:`, {
      page,
      limit,
      role,
      isActive,
      search,
      sortBy,
    });

    const result = await usersService.getAllUsers({
      page,
      limit,
      role,
      isActive,
      search,
      sortBy,
    });

    // Проверяем структуру ответа
    const responseData = {
      items: Array.isArray(result.data) ? result.data : result.users || [],
      pagination: result.pagination || {
        page,
        totalPages: Math.ceil((result.total || 0) / limit),
        totalItems: result.total || 0,
        hasNext: false,
        hasPrev: false,
      },
    };

    console.log(`✅ Users loaded:`, {
      itemsCount: responseData.items?.length || 0,
      pagination: responseData.pagination,
    });

    return {
      success: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    console.error("❌ Failed to load users:", error);
    return {
      success: false,
      error: "Nepodarilo sa načítať používateľov. Skúste to znovu.",
      data: null,
    };
  }
}

/**
 * Поиск пользователей (только для админов)
 */
export async function searchUsersAction(params = {}) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return {
        success: false,
        error: "Nemáte oprávnenie na túto akciu",
      };
    }

    const { q, page = 1, limit = 10 } = params;

    const result = await usersService.searchUsers({ q, page, limit });

    return {
      success: true,
      data: {
        items: result.data || [],
        pagination: result.pagination,
      },
    };
  } catch (error) {
    console.error("❌ Failed to search users:", error);
    return {
      success: false,
      error: "Nepodarilo sa vyhľadať používateľov",
    };
  }
}

/**
 * Смена роли пользователя (только для админов)
 */
export async function changeUserRoleAction(userId, role, reason = "") {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return {
        success: false,
        error: "Nemáte oprávnenie na túto akciu",
      };
    }

    // Валидация роли
    const validRoles = ["user", "expert", "lawyer", "admin"];
    if (!validRoles.includes(role)) {
      return {
        success: false,
        error: "Neplatná rola",
      };
    }

    // Нельзя себе менять роль
    if (user.id === userId || user._id === userId) {
      return {
        success: false,
        error: "Nemôžete zmeniť svoju vlastnú rolu",
      };
    }

    console.log(`🔄 Changing user role:`, {
      adminId: user.id,
      targetUserId: userId,
      role,
      reason,
    });

    await usersService.changeUserRole(userId, role, reason);

    console.log(`✅ User role changed successfully`);

    // Revalidate соответствующие пути
    revalidatePath("/profile/users");
    revalidatePath("/", "layout"); // Перезагрузить кэш пользователей

    return {
      success: true,
      message: `Rola používateľa bola úspešne zmenená na "${role}"`,
      error: null,
    };
  } catch (error) {
    console.error("❌ Failed to change user role:", error);

    if (error.message?.includes("not found")) {
      return {
        success: false,
        error: "Používateľ nebol nájdený",
      };
    }

    if (error.message?.includes("forbidden")) {
      return {
        success: false,
        error: "Nemáte oprávnenie zmeniť rolu tomuto používateľovi",
      };
    }

    return {
      success: false,
      error: "Nepodarilo sa zmeniť rolu používateľa",
    };
  }
}

/**
 * Заблокировать пользователя (только для админов)
 */
export async function banUserAction(userId, banData = {}) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return {
        success: false,
        error: "Nemáte oprávnenie na túto akciu",
      };
    }

    // Нельзя банить себя
    if (user.id === userId || user._id === userId) {
      return {
        success: false,
        error: "Nemôžete zablokovať seba",
      };
    }

    const {
      reason = "Porušenie pravidiel komunity",
      duration = 7,
      isPermanent = false,
    } = banData;

    console.log(`🚫 Banning user:`, {
      adminId: user.id,
      targetUserId: userId,
      reason,
      duration,
      isPermanent,
    });

    await usersService.banUser(userId, {
      reason,
      duration,
      isPermanent,
    });

    console.log(`✅ User banned successfully`);

    // Revalidate страницы
    revalidatePath("/profile/users");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: isPermanent
        ? "Používateľ bol trvale zablokovaný"
        : `Používateľ bol zablokovaný na ${duration} dní`,
      error: null,
    };
  } catch (error) {
    console.error("❌ Failed to ban user:", error);

    if (error.message?.includes("not found")) {
      return {
        success: false,
        error: "Používateľ nebol nájdený",
      };
    }

    return {
      success: false,
      error: "Nepodarilo sa zablokovať používateľa",
    };
  }
}

/**
 * Разблокировать пользователя (только для админов)
 */
export async function unbanUserAction(userId) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return {
        success: false,
        error: "Nemáte oprávnenie na túto akciu",
      };
    }

    console.log(`✅ Unbanning user:`, {
      adminId: user.id,
      targetUserId: userId,
    });

    await usersService.unbanUser(userId);

    console.log(`✅ User unbanned successfully`);

    // Revalidate страницы
    revalidatePath("/profile/users");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Používateľ bol úspešne odblokovaný",
      error: null,
    };
  } catch (error) {
    console.error("❌ Failed to unban user:", error);

    if (error.message?.includes("not found")) {
      return {
        success: false,
        error: "Používateľ nebol nájdený",
      };
    }

    return {
      success: false,
      error: "Nepodarilo sa odblokovať používateľa",
    };
  }
}
