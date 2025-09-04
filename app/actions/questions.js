// Файл: app/actions/questions.js

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerUser } from "@/src/lib/auth-server";
import { basePath } from "@/src/constants/config";

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
 * Server Action pre aktualizáciu otázky
 */
export async function updateQuestionAction(prevState, formData) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      redirect(`${basePath}/login`);
    }

    const questionId = formData.get("questionId")?.toString();
    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const category = formData.get("category")?.toString().trim();
    const priority = formData.get("priority")?.toString().trim();

    if (!questionId) {
      return {
        success: false,
        error: "ID otázky je povinné",
        message: null,
        fieldErrors: null,
      };
    }

    // Podobná validácia ako pri vytváraní
    const fieldErrors = {};

    if (!title || title.length < 10 || title.length > 200) {
      fieldErrors.title = "Názov musí mať 10-200 znakov";
    }

    if (!content || content.length < 50 || content.length > 5000) {
      fieldErrors.content = "Popis musí mať 50-5000 znakov";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: null,
        message: null,
        fieldErrors,
      };
    }

    // API volanie pre update
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    const response = await fetch(`${backendUrl}/questions/${questionId}`, {
      method: "PUT",
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
      return {
        success: false,
        error: data.message || "Nepodarilo sa aktualizovať otázku",
        message: null,
        fieldErrors: data.fieldErrors || null,
      };
    }

    // Revalidate paths
    revalidatePath("/forum/questions");
    revalidatePath(`/forum/questions/${questionId}`);
    revalidatePath("/forum/profile");

    return {
      success: true,
      error: null,
      message: "Otázka bola úspešne aktualizovaná!",
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[updateQuestionAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
      fieldErrors: null,
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
