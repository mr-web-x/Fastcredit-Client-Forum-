// Файл: app/actions/auth.js

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { basePath } from "@/src/constants/config";
import {
  setAuthCookie,
  clearAuthCookie,
  getServerUser,
} from "@/src/lib/auth-server";

/**
 * Server Action для локального входа
 */

export async function loginAction(prevState, formData) {
  try {
    // Получаем данные из формы
    const login = formData.get("login")?.toString().trim();
    const password = formData.get("password")?.toString();

    // Валидация на сервере
    if (!login) {
      return {
        success: false,
        error: "Email alebo používateľské meno je povinné",
        message: null,
      };
    }
    if (!password) {
      return {
        success: false,
        error: "Heslo je povinné",
        message: null,
      };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Heslo musí mať aspoň 6 znakov",
        message: null,
      };
    }

    // Отправляем запрос на backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    const data = await response.json();

    // Обработка ошибок от backend
    if (!response.ok || !data.success) {
      const errorMessage = data.message || "Nepodarilo sa prihlásiť";

      // Специфичные ошибки
      if (response.status === 401) {
        return {
          success: false,
          error: "Nesprávne prihlasovacie údaje",
          message: null,
        };
      }
      if (response.status === 403) {
        return {
          success: false,
          error: "Váš účet nie je aktívny. Skontrolujte email.",
          message: null,
        };
      }
      if (response.status === 429) {
        return {
          success: false,
          error: "Príliš veľa pokusov. Skúste neskôr.",
          message: null,
        };
      }

      return {
        success: false,
        error: errorMessage,
        message: null,
      };
    }

    // Получаем токен и данные пользователя
    const { token: jwtToken, user } = data.data;

    if (!jwtToken) {
      return {
        success: false,
        error: "Chyba servera - token nebol prijatý",
        message: null,
      };
    }

    // Устанавливаем HttpOnly cookie
    await setAuthCookie(jwtToken);

    // ВАЖНО: revalidatePath должен работать в Server Actions
    try {
      revalidatePath("/forum");
      revalidatePath("/forum/profile");
      revalidatePath("/", "layout"); // Revalidate всего layout
    } catch (revalidateError) {
      console.warn("[loginAction] Revalidate error:", revalidateError);
      // Не прерываем процесс из-за ошибки revalidate
    }

    // Успешный вход - возвращаем success
    return {
      success: true,
      error: null,
      message: "Úspešne ste sa prihlásili",
      user: user,
    };
  } catch (error) {
    console.error("[loginAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
    };
  }
}

/**
 * Server Action для регистрации - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */
export async function registerAction(prevState, formData) {
  try {
    // Получаем данные из формы
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const firstName = formData.get("firstName")?.toString().trim();
    const lastName = formData.get("lastName")?.toString().trim();
    const username = formData.get("username")?.toString().trim();
    const agreeToTerms = formData.get("agreeToTerms") === "on";

    // Валидация на сервере
    const fieldErrors = {};

    if (!email) {
      fieldErrors.email = "Email je povinný";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      fieldErrors.email = "Neplatný formát emailu";
    }

    if (!password) {
      fieldErrors.password = "Heslo je povinné";
    } else if (password.length < 6) {
      fieldErrors.password = "Heslo musí mať aspoň 6 znakov";
    }

    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Potvrďte heslo";
    } else if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Heslá sa nezhodujú";
    }

    if (!firstName) {
      fieldErrors.firstName = "Meno je povinné";
    }

    if (!lastName) {
      fieldErrors.lastName = "Priezvisko je povinné";
    }

    if (!username) {
      fieldErrors.username = "Používateľské meno je povinné";
    } else if (username.length < 3) {
      fieldErrors.username = "Používateľské meno musí mať aspoň 3 znaky";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      fieldErrors.username =
        "Používateľské meno môže obsahovať len písmená, číslice a podčiarkovník";
    }

    if (!agreeToTerms) {
      fieldErrors.agreeToTerms = "Musíte súhlasiť s podmienkami použitia";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Opravte chyby vo formulári",
        message: null,
        fieldErrors,
      };
    }

    // Отправляем запрос на backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        username,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage = data.message || "Nepodarilo sa zaregistrovať";

      if (response.status === 409) {
        return {
          success: false,
          error:
            "Používateľ s týmto emailom alebo používateľským menom už existuje",
          message: null,
          fieldErrors: null,
        };
      }
      if (response.status === 429) {
        return {
          success: false,
          error: "Príliš veľa pokusov. Skúste neskôr.",
          message: null,
          fieldErrors: null,
        };
      }

      return {
        success: false,
        error: errorMessage,
        message: null,
        fieldErrors: null,
      };
    }

    // Регистрация успешна, переходим к верификации
    return {
      success: true,
      error: null,
      message: "Registrácia úspešná. Overte svoj email.",
      step: "verification",
      email: email,
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[registerAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
      fieldErrors: null,
    };
  }
}

/**
 * Server Action для отправки кода верификации - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */
export async function sendVerificationAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();

    if (!email) {
      return {
        success: false,
        error: "Email je povinný",
        message: null,
        fieldErrors: null,
      };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/send-verification-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || "Nepodarilo sa odoslať kód",
        message: null,
        fieldErrors: null,
      };
    }

    return {
      success: true,
      error: null,
      message: "Kód bol odoslaný na váš email",
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[sendVerificationAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
      fieldErrors: null,
    };
  }
}

/**
 * Server Action для верификации email - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */
export async function verifyEmailAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();
    const code = formData.get("code")?.toString().trim();

    const fieldErrors = {};

    if (!email) {
      fieldErrors.email = "Email je povinný";
    }
    if (!code) {
      fieldErrors.code = "Zadajte overovací kód";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Opravte chyby vo formulári",
        message: null,
        fieldErrors,
      };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        return {
          success: false,
          error: "Neplatný alebo expirovaný kód",
          message: null,
          fieldErrors: null,
        };
      }
      return {
        success: false,
        error: data.message || "Nepodarilo sa overiť email",
        message: null,
        fieldErrors: null,
      };
    }

    // Email верифицирован успешно
    try {
      revalidatePath("/forum");
      revalidatePath("/forum/profile");
      revalidatePath("/", "layout");
    } catch (revalidateError) {
      console.warn("[verifyEmailAction] Revalidate error:", revalidateError);
    }

    return {
      success: true,
      error: null,
      message: "Email bol úspešne overený",
      step: "success",
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[verifyEmailAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
      fieldErrors: null,
    };
  }
}

/**
 * Server Action для восстановления пароля - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */
export async function forgotPasswordAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();

    const fieldErrors = {};

    if (!email) {
      fieldErrors.email = "Email je povinný";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      fieldErrors.email = "Neplatný formát emailu";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Opravte chyby vo formulári",
        message: null,
        fieldErrors,
      };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/request-password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || "Nepodarilo sa odoslať kód na obnovenie hesla",
        message: null,
        fieldErrors: null,
      };
    }

    return {
      success: true,
      error: null,
      message: "Kód na obnovenie hesla bol odoslaný na váš email",
      step: "verification",
      email: email,
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[forgotPasswordAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
      fieldErrors: null,
    };
  }
}

/**
 * Server Action для проверки кода сброса пароля - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */
export async function verifyResetCodeAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();
    const code = formData.get("code")?.toString().trim();

    const fieldErrors = {};

    if (!email) {
      fieldErrors.email = "Email je povinný";
    }
    if (!code) {
      fieldErrors.code = "Zadajte overovací kód";
    } else if (code.length < 4) {
      fieldErrors.code = "Kód musí mať aspoň 4 znaky";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Opravte chyby vo formulári",
        message: null,
        fieldErrors,
      };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/verify-reset-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || "Neplatný alebo expirovaný kód",
        message: null,
        fieldErrors: null,
      };
    }

    return {
      success: true,
      error: null,
      message: "Kód je platný",
      step: "password",
      code: code,
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[verifyResetCodeAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
      fieldErrors: null,
    };
  }
}

/**
 * Server Action для сброса пароля - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */
export async function resetPasswordAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();
    const code = formData.get("code")?.toString().trim();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    const fieldErrors = {};

    if (!email) {
      fieldErrors.email = "Email je povinný";
    }
    if (!code) {
      fieldErrors.code = "Kód je povinný";
    }
    if (!newPassword) {
      fieldErrors.newPassword = "Nové heslo je povinné";
    } else if (newPassword.length < 6) {
      fieldErrors.newPassword = "Heslo musí mať aspoň 6 znakov";
    }
    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Potvrďte heslo";
    } else if (newPassword !== confirmPassword) {
      fieldErrors.confirmPassword = "Heslá sa nezhodujú";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Opravte chyby vo formulári",
        message: null,
        fieldErrors,
      };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        newPassword,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || "Nepodarilo sa obnoviť heslo",
        message: null,
        fieldErrors: null,
      };
    }

    // Revalidate paths после успешного сброса пароля
    try {
      revalidatePath("/forum");
      revalidatePath("/forum/profile");
      revalidatePath("/", "layout");
    } catch (revalidateError) {
      console.warn("[resetPasswordAction] Revalidate error:", revalidateError);
    }

    return {
      success: true,
      error: null,
      message: "Heslo bolo úspešne obnovené",
      step: "success",
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[resetPasswordAction] Error:", error);
    return {
      success: false,
      error: "Chyba servera. Skúste to znovu.",
      message: null,
      fieldErrors: null,
    };
  }
}
/**
 * Server Action для обновления профиля
 */
export async function updateProfileAction(prevState, formData) {
  try {
    // Проверяем авторизацию
    const currentUser = await getServerUser();
    if (!currentUser) {
      redirect(`${basePath}/login`);
    }

    const firstName = formData.get("firstName")?.toString().trim();
    const lastName = formData.get("lastName")?.toString().trim();
    const username = formData.get("username")?.toString().trim();
    const bio = formData.get("bio")?.toString().trim();

    // Валидация
    if (!firstName) {
      return { error: "Meno je povinné" };
    }
    if (!lastName) {
      return { error: "Priezvisko je povinné" };
    }
    if (!username) {
      return { error: "Používateľské meno je povinné" };
    }
    if (username.length < 3) {
      return { error: "Používateľské meno musí mať aspoň 3 znaky" };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getServerUser().token}`, // Need to get token
      },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        bio,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { error: data.message || "Nepodarilo sa aktualizovať profil" };
    }

    // Revalidate paths
    revalidatePath("/forum/profile");

    return {
      success: true,
      message: "Profil bol úspešne aktualizovaný",
    };
  } catch (error) {
    console.error("[updateProfileAction] Error:", error);
    return { error: "Chyba servera. Skúste to znovu." };
  }
}

/**
 * Server Action для logout
 */
export async function logoutAction() {
  try {
    // Очищаем cookie
    await clearAuthCookie();

    // Revalidate paths
    revalidatePath("/forum");

    // Redirect на главную
    redirect(`${basePath}/`);
  } catch (error) {
    console.error("[logoutAction] Error:", error);
    // В случае ошибки все равно пытаемся очистить cookie и редирект
    await clearAuthCookie();
    redirect(`${basePath}/`);
  }
}
