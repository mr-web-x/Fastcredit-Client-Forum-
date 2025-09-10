// Файл: app/actions/comments.js
"use server";

import { revalidatePath } from "next/cache";
import { getServerUser } from "@/src/lib/auth-server";

/**
 * Server Action для создания комментария к вопросу
 */
export async function createCommentAction(questionId, commentData) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return {
        success: false,
        error: "Musíte sa prihlásiť pre pridanie komentára",
      };
    }

    if (!questionId) {
      throw new Error("ID otázky je povinné");
    }

    // Валидация данных комментария
    const { content, parentComment = null } = commentData;

    if (!content || content.trim().length < 5) {
      return {
        success: false,
        error: "Komentár musí mať aspoň 5 znakov",
      };
    }

    if (content.length > 1000) {
      return {
        success: false,
        error: "Komentár môže mať maximálne 1000 znakov",
      };
    }

    console.log(`💬 Creating comment:`, {
      questionId,
      userId: currentUser.id,
      parentComment,
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
      `${backendUrl}/questions/${questionId}/comments`,
      {
        method: "POST",
        headers: {
          Cookie: `fc_jwt=${jwtCookie.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          parentComment,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("❌ Failed to create comment:", data.message);

      // Специальная обработка для нарушения правил комментирования
      if (response.status === 403) {
        return {
          success: false,
          error: data.message || "Nemáte oprávnenie pre pridanie komentára",
        };
      }

      return {
        success: false,
        error: data.message || "Nepodarilo sa pridať komentár",
      };
    }

    console.log(`✅ Comment created successfully:`, data.data._id);

    // Revalidate только страницу с вопросом
    revalidatePath("/questions/[slug]", "page");

    return {
      success: true,
      data: data.data,
      message: "Komentár bol úspešne pridaný",
    };
  } catch (error) {
    console.error("❌ [createCommentAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera pri pridávaní komentára",
    };
  }
}

/**
 * Server Action для лайка комментария
 */
export async function likeCommentAction(commentId) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return {
        success: false,
        error: "Musíte sa prihlásiť pre hodnotenie komentára",
      };
    }

    if (!commentId) {
      throw new Error("ID komentára je povinné");
    }

    console.log(`👍 Liking comment:`, {
      commentId,
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

    const response = await fetch(`${backendUrl}/comments/${commentId}/like`, {
      method: "POST",
      headers: {
        Cookie: `fc_jwt=${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("❌ Failed to like comment:", data.message);
      return {
        success: false,
        error: data.message || "Nepodarilo sa označiť komentár",
      };
    }

    console.log(`✅ Comment liked successfully:`, data.data);

    // Revalidate только страницу с вопросом
    revalidatePath("/questions/[slug]", "page");

    return {
      success: true,
      data: {
        likes: data.data.likes,
        isLiked: data.data.isLiked,
      },
    };
  } catch (error) {
    console.error("❌ [likeCommentAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera pri hodnotení komentára",
    };
  }
}

/**
 * Server Action для удаления комментария
 */
export async function deleteCommentAction(commentId) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return {
        success: false,
        error: "Musíte sa prihlásiť pre zmazanie komentára",
      };
    }

    if (!commentId) {
      throw new Error("ID komentára je povinné");
    }

    console.log(`🗑️ Deleting comment:`, {
      commentId,
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

    const response = await fetch(`${backendUrl}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Cookie: `fc_jwt=${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("❌ Failed to delete comment:", data.message);
      return {
        success: false,
        error: data.message || "Nepodarilo sa zmazať komentár",
      };
    }

    console.log(`✅ Comment deleted successfully`);

    // Revalidate только страницу с вопросом
    revalidatePath("/questions/[slug]", "page");

    return {
      success: true,
      message: "Komentár bol úspešne zmazaný",
    };
  } catch (error) {
    console.error("❌ [deleteCommentAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera pri mazaní komentára",
    };
  }
}
