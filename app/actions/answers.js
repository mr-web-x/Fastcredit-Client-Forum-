// Файл: app/actions/answers.js
"use server";

import { revalidatePath } from "next/cache";
import { getServerUser } from "@/src/lib/auth-server";

/**
 * Server Action для создания ответа на вопрос
 */
export async function createAnswerAction(questionId, answerData) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return {
        success: false,
        error: "Musíte sa prihlásiť pre pridanie odpovede",
      };
    }

    // Проверяем права - только эксперты, админы, модераторы
    const allowedRoles = ["expert", "lawyer", "admin", "moderator"];
    if (!allowedRoles.includes(currentUser.role)) {
      return {
        success: false,
        error: "Nemáte oprávnenie pre pridanie odpovede",
      };
    }

    if (!questionId) {
      throw new Error("ID otázky je povinné");
    }

    // Валидация данных ответа
    const { content } = answerData;
    if (!content || content.trim().length < 50) {
      return {
        success: false,
        error: "Odpoveď musí mať aspoň 50 znakov",
      };
    }

    if (content.length > 5000) {
      return {
        success: false,
        error: "Odpoveď môže mať maximálne 5000 znakov",
      };
    }

    console.log(`📝 Creating answer:`, {
      questionId,
      userId: currentUser.id,
      userRole: currentUser.role,
      contentLength: content.length,
    });

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      return {
        success: false,
        error: "No authentication token",
      };
    }

    const response = await fetch(
      `${backendUrl}/answers/question/${questionId}`,
      {
        method: "POST",
        headers: {
          Cookie: `fc_jwt=${jwtCookie.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("❌ Failed to create answer:", data.message);
      return {
        success: false,
        error: data.message || "Nepodarilo sa pridať odpoveď",
      };
    }

    console.log(`✅ Answer created successfully:`, data.data._id);

    // Revalidate страницы
    revalidatePath("/forum/questions/[slug]", "page");
    revalidatePath("/forum/profile/answers", "page");
    revalidatePath("/forum/profile/all-questions", "page");

    return {
      success: true,
      data: data.data,
      message: "Odpoveď bola úspešne pridaná",
    };
  } catch (error) {
    console.error("❌ [createAnswerAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera pri pridávaní odpovede",
    };
  }
}

/**
 * Server Action для редактирования ответа
 */
export async function updateAnswerAction(answerId, updateData) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return {
        success: false,
        error: "Musíte sa prihlásiť pre úpravu odpovede",
      };
    }

    if (!answerId) {
      throw new Error("ID odpovede je povinné");
    }

    // Валидация данных
    const { content } = updateData;
    if (!content || content.trim().length < 50) {
      return {
        success: false,
        error: "Odpoveď musí mať aspoň 50 znakov",
      };
    }

    if (content.length > 5000) {
      return {
        success: false,
        error: "Odpoveď môže mať maximálne 5000 znakov",
      };
    }

    console.log(`✏️ Updating answer:`, {
      answerId,
      userId: currentUser.id,
      contentLength: content.length,
    });

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      return {
        success: false,
        error: "No authentication token",
      };
    }

    const response = await fetch(`${backendUrl}/answers/${answerId}`, {
      method: "PUT",
      headers: {
        Cookie: `fc_jwt=${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("❌ Failed to update answer:", data.message);
      return {
        success: false,
        error: data.message || "Nepodarilo sa aktualizovať odpoveď",
      };
    }

    console.log(`✅ Answer updated successfully`);

    // Revalidate страницы
    revalidatePath("/forum/questions/[slug]", "page");
    revalidatePath("/forum/profile/answers", "page");

    return {
      success: true,
      data: data.data,
      message: "Odpoveď bola úspešne aktualizovaná",
    };
  } catch (error) {
    console.error("❌ [updateAnswerAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera pri aktualizácii odpovede",
    };
  }
}

/**
 * Server Action для модерации ответа админом
 */
export async function updateApprovedAnswerAction(
  answerId,
  isApproved,
  comment = ""
) {
  try {
    const currentUser = await getServerUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Musíte sa prihlásiť pre moderovanie odpovede",
      };
    }

    // Только админы могут модерировать
    if (currentUser.role !== "admin") {
      return {
        success: false,
        error: "Nemáte oprávnenie pre moderovanie odpovede",
      };
    }

    if (!answerId) {
      throw new Error("ID odpovede je povinné");
    }

    if (typeof isApproved !== "boolean") {
      return {
        success: false,
        error: "Neplatná akcia moderovania",
      };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      return {
        success: false,
        error: "No authentication token",
      };
    }

    const response = await fetch(`${backendUrl}/answers/${answerId}/moderate`, {
      method: "POST",
      headers: {
        Cookie: `fc_jwt=${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isApproved,
        comment: comment.trim() || "No comment",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("❌ Failed to moderate answer:", data.message);
      return {
        success: false,
        error: data.message || "Nepodarilo sa moderovať odpoveď",
      };
    }

    // Revalidate всех нужных страниц
    revalidatePath("/forum/questions/[slug]", "page");
    revalidatePath("/forum/profile/new-answers", "page");
    revalidatePath("/forum/profile/answers", "page");

    return {
      success: true,
      data: data.data,
      message: isApproved
        ? "Odpoveď bola úspešne schválená"
        : "Odpoveď bola zamietnutá",
    };
  } catch (error) {
    console.error("❌ [moderateAnswerAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera pri moderovaní odpovede",
    };
  }
}

/**
 * Server Action для удаления ответа
 */
export async function deleteAnswerAction(answerId) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return {
        success: false,
        error: "Musíte sa prihlásiť pre zmazanie odpovede",
      };
    }

    if (!answerId) {
      throw new Error("ID odpovede je povinné");
    }

    console.log(`🗑️ Deleting answer:`, {
      answerId,
      userId: currentUser.id,
    });

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      return {
        success: false,
        error: "No authentication token",
      };
    }

    const response = await fetch(`${backendUrl}/answers/${answerId}`, {
      method: "DELETE",
      headers: {
        Cookie: `fc_jwt=${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("❌ Failed to delete answer:", data.message);
      return {
        success: false,
        error: data.message || "Nepodarilo sa zmazať odpoveď",
      };
    }

    console.log(`✅ Answer deleted successfully`);

    // Revalidate страницы
    revalidatePath("/forum/questions/[slug]", "page");
    revalidatePath("/forum/profile/answers", "page");

    return {
      success: true,
      message: "Odpoveď bola úspešne zmazaná",
    };
  } catch (error) {
    console.error("❌ [deleteAnswerAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera pri mazaní odpovede",
    };
  }
}
