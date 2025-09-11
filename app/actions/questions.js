// Файл: app/actions/questions.js

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerUser } from "@/src/lib/auth-server";
import { basePath } from "@/src/constants/config";
import { questionsService } from "@/src/services/server";

/**
 * Server Action для создания вопроса
 */
export async function createQuestionAction(prevState, formData) {
  try {
    // Проверяем авторизацию
    const currentUser = await getServerUser();
    if (!currentUser) {
      redirect(`${basePath}/login`);
    }

    // Получаем данные из FormData
    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const category = formData.get("category")?.toString().trim();
    const priority = formData.get("priority")?.toString().trim() || "normal";

    // Валидация на сервере
    const fieldErrors = {};

    if (!title) {
      fieldErrors.title = "Názov otázky je povinný";
    } else if (title.length < 10) {
      fieldErrors.title = "Názov musí mať aspoň 10 znakov";
    } else if (title.length > 200) {
      fieldErrors.title = "Názov môže mať maximálne 200 znakov";
    }

    if (!content) {
      fieldErrors.content = "Popis otázky je povinný";
    } else if (content.length < 50) {
      fieldErrors.content = "Popis musí mať aspoň 50 znakov";
    } else if (content.length > 5000) {
      fieldErrors.content = "Popis môže mať maximálne 5000 znakov";
    }

    if (!category) {
      fieldErrors.category = "Kategória je povinná";
    } else if (!["expert", "lawyer"].includes(category)) {
      fieldErrors.category = "Neplatná kategória";
    }

    if (!["normal", "high", "urgent"].includes(priority)) {
      fieldErrors.priority = "Neplatná priorita";
    }

    // Ak sú chyby validácie, vraciame ich
    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: null,
        message: null,
        fieldErrors,
        questionSlug: null,
      };
    }

    // Volanie backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    // Čítame JWT token z cookie na serveri
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      redirect(`${basePath}/login`);
    }

    const response = await fetch(`${backendUrl}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `fc_jwt=${jwtCookie.value}`,
      },
      body: JSON.stringify({
        title,
        content,
        category,
        priority,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      // Ak backend vrátil špecifické chyby polí
      if (data.fieldErrors) {
        return {
          success: false,
          error: null,
          message: null,
          fieldErrors: data.fieldErrors,
          questionSlug: null,
        };
      }

      // Všeobecná chyba
      const errorMessage = data.message || "Nepodarilo sa vytvoriť otázku";

      if (response.status === 401) {
        redirect(`${basePath}/login`);
      }

      if (response.status === 429) {
        return {
          success: false,
          error:
            "Príliš veľa otázok. Počkajte chvíľu pred vytvorením ďalšej otázky.",
          message: null,
          fieldErrors: null,
          questionSlug: null,
        };
      }

      return {
        success: false,
        error: errorMessage,
        message: null,
        fieldErrors: null,
        questionSlug: null,
      };
    }

    // Úspešné vytvorenie otázky
    const createdQuestion = data.data;
    const questionSlug = createdQuestion.slug || createdQuestion._id;

    // Revalidate relevantné paths
    try {
      revalidatePath("/forum");
      revalidatePath("/forum/questions");
      revalidatePath("/forum/profile");
      revalidatePath(`/forum/questions/${questionSlug}`);

      // Revalidate kategóriu ak je známa
      if (category) {
        revalidatePath(`/forum/categories/${category}`);
      }
    } catch (revalidateError) {
      console.warn("[createQuestionAction] Revalidate error:", revalidateError);
      // Neprerušujeme proces kvôli chybe revalidate
    }

    return {
      success: true,
      error: null,
      message: "Otázka bola úspešne vytvorená!",
      fieldErrors: null,
      questionSlug: questionSlug,
    };
  } catch (error) {
    console.error("[createQuestionAction] Error:", error);

    // Network alebo server chyba
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
      fieldErrors: null,
      questionSlug: null,
    };
  }
}

/**
 * Server Action pre zmazanie otázky
 */
export async function deleteQuestionAction(questionId) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      redirect(`${basePath}/login`);
    }

    if (!questionId) {
      throw new Error("ID otázky je povinné");
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    const response = await fetch(`${backendUrl}/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        Cookie: `fc_jwt=${jwtCookie.value}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Nepodarilo sa zmazať otázku");
    }

    // Revalidate paths
    revalidatePath("/forum");
    revalidatePath("/forum/questions");
    revalidatePath("/forum/profile");

    return { success: true };
  } catch (error) {
    console.error("[deleteQuestionAction] Error:", error);
    throw error;
  }
}

/**
 * Server Action для получения вопросов пользователя
 */
export async function getUserQuestionsAction(filters = {}) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return {
        success: false,
        error: "Unauthorized",
        data: null,
      };
    }

    // Получаем параметры фильтрации
    const { page = 1, limit = 10, status = "" } = filters;

    // API вызов
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      return {
        success: false,
        error: "No authentication token",
        data: null,
      };
    }

    // Формируем URL с параметрами
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) params.set("status", status);

    const response = await fetch(
      `${backendUrl}/questions/user/${currentUser.id}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Cookie: `fc_jwt=${jwtCookie.value}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.message || "Failed to load questions",
        data: null,
      };
    }

    const result = await response.json();

    // Обработка структуры ответа: { success: true, data: { data: [...], pagination: {...} } }
    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.message || "Failed to load questions",
        data: null,
      };
    }

    const questionsData = {
      items: result.data.data || [],
      pagination: {
        page: result.data.pagination.current,
        totalPages: result.data.pagination.total,
        totalItems: result.data.pagination.totalItems,
        hasNext: result.data.pagination.hasNext,
        hasPrev: result.data.pagination.hasPrev,
      },
    };

    return {
      success: true,
      error: null,
      data: questionsData,
    };
  } catch (error) {
    console.error("[getUserQuestionsAction] Error:", error);
    return {
      success: false,
      error: "Server error. Please try again.",
      data: null,
    };
  }
}

/**
 * Получение новых вопросов для экспертов/правников/админов
 */
export async function getNewQuestionsAction(params = {}) {
  try {
    const user = await getServerUser();
    if (!user) {
      return {
        success: false,
        error: "Neprihlásený používateľ",
        data: null,
      };
    }

    // Проверка прав доступа
    if (!["expert", "lawyer", "admin", "moderator"].includes(user.role)) {
      return {
        success: false,
        error: "Nemáte oprávnenie na zobrazenie nových otázok",
        data: null,
      };
    }

    const {
      page = 1,
      limit = 10,
      priority = "",
      sortBy = "createdAt",
      sortOrder = "-1",
    } = params;

    console.log(`🔍 Loading new questions for ${user.role} ${user.id}:`, {
      page,
      limit,
      priority,
      sortBy,
      sortOrder,
    });

    // Определяем фильтрацию по роли
    let category = "";
    if (user.role === "expert") {
      category = "expert";
    } else if (user.role === "lawyer") {
      category = "lawyer";
    }
    // admin и moderator видят все вопросы

    const result = await questionsService.getPending({
      page,
      limit,
      priority,
      category,
      sortBy,
      sortOrder,
    });

    // Проверяем структуру ответа
    const responseData = {
      items: Array.isArray(result.data) ? result.data : result.questions || [],
      pagination: result.pagination || {
        page,
        totalPages: Math.ceil((result.total || 0) / limit),
        totalItems: result.total || 0,
        hasNext: false,
        hasPrev: false,
      },
    };

    console.log(`✅ New questions loaded:`, {
      userRole: user.role,
      category: category || "all",
      itemsCount: responseData.items?.length || 0,
      pagination: responseData.pagination,
    });

    return {
      success: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    console.error("❌ Failed to load new questions:", error);
    return {
      success: false,
      error: "Nepodarilo sa načítať nové otázky. Skúste to znovu.",
      data: null,
    };
  }
}
