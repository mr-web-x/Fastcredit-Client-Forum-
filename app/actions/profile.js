// Файл: app/actions/profile.js

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getServerUser } from "@/src/lib/auth-server";

/**
 * Server Action для обновления личных данных пользователя
 */
export async function updateMyDataAction(prevState, formData) {
  try {
    // Проверяем авторизацию
    const currentUser = await getServerUser();
    if (!currentUser) {
      redirect(`/forum/login`);
    }

    // Получаем данные из формы
    const action = formData.get("action")?.toString();

    if (action !== "update_profile") {
      return {
        success: false,
        error: "Neplatná akcia",
        fieldErrors: null,
      };
    }

    const firstName = formData.get("firstName")?.toString().trim();
    const lastName = formData.get("lastName")?.toString().trim();
    const username = formData.get("username")?.toString().trim();
    const bio = formData.get("bio")?.toString().trim();

    // Серверная валидация
    const fieldErrors = {};

    if (!firstName || firstName.length === 0) {
      fieldErrors.firstName = "Meno je povinné";
    } else if (firstName.length > 50) {
      fieldErrors.firstName = "Meno môže mať maximálne 50 znakov";
    }

    if (!lastName || lastName.length === 0) {
      fieldErrors.lastName = "Priezvisko je povinné";
    } else if (lastName.length > 50) {
      fieldErrors.lastName = "Priezvisko môže mať maximálne 50 znakov";
    }

    if (!username || username.length === 0) {
      fieldErrors.username = "Používateľské meno je povinné";
    } else if (username.length < 3) {
      fieldErrors.username = "Používateľské meno musí mať aspoň 3 znaky";
    } else if (username.length > 30) {
      fieldErrors.username = "Používateľské meno môže mať maximálne 30 znakov";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      fieldErrors.username =
        "Používateľské meno môže obsahovať len písmená, číslice a podčiarkovník";
    }

    if (bio && bio.length > 500) {
      fieldErrors.bio = "Popis môže mať maximálne 500 znakov";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: null,
        fieldErrors,
      };
    }

    // API запрос
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    const cookieStore = cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      redirect(`/forum/login`);
    }

    const response = await fetch(`${backendUrl}/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        bio: bio || "",
      }),
    });

    // Безопасный парсинг JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("[updateMyDataAction] JSON parse error:", jsonError);
      return {
        success: false,
        error: "Neplatná odpoveď zo servera",
        fieldErrors: null,
      };
    }

    // Обработка ошибок от API
    if (!response.ok || !data.success) {
      if (response.status === 409) {
        return {
          success: false,
          error: null,
          fieldErrors: {
            username: "Toto používateľské meno už existuje",
          },
        };
      }

      if (response.status === 401) {
        redirect(`/forum/login`);
      }

      if (response.status === 403) {
        return {
          success: false,
          error: "Nemáte oprávnenie na túto akciu",
          fieldErrors: null,
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: "Príliš veľa pokusov. Skúste neskôr.",
          fieldErrors: null,
        };
      }

      if (data.fieldErrors) {
        return {
          success: false,
          error: null,
          fieldErrors: data.fieldErrors,
        };
      }

      return {
        success: false,
        error: data.message || "Nepodarilo sa aktualizovať profil",
        fieldErrors: null,
      };
    }

    // Успех! Обновляем кеш
    try {
      revalidatePath("/forum/profile");
      revalidatePath("/forum/profile/my-data");
      revalidatePath("/forum", "layout");
    } catch (revalidateError) {
      console.warn("[updateMyDataAction] Revalidate error:", revalidateError);
    }

    return {
      success: true,
      error: null,
      message: "Profil bol úspešne aktualizovaný",
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[updateMyDataAction] Error:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Problém s pripojením k serveru. Skúste to znovu.",
        fieldErrors: null,
      };
    }

    return {
      success: false,
      error: "Neočakávaná chyba servera. Skúste to znovu.",
      fieldErrors: null,
    };
  }
}
