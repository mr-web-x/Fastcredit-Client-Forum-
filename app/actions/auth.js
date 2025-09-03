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
      return { error: "Email alebo používateľské meno je povinné" };
    }
    if (!password) {
      return { error: "Heslo je povinné" };
    }
    if (password.length < 6) {
      return { error: "Heslo musí mať aspoň 6 znakov" };
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
        return { error: "Nesprávne prihlasovacie údaje" };
      }
      if (response.status === 403) {
        return { error: "Váš účet nie je aktívny. Skontrolujte email." };
      }
      if (response.status === 429) {
        return { error: "Príliš veľa pokusov. Skúste neskôr." };
      }

      return { error: errorMessage };
    }

    // Получаем токен и данные пользователя
    const { token: jwtToken, user } = data.data;

    if (!jwtToken) {
      return { error: "Chyba servera - token nebol prijatý" };
    }

    // Устанавливаем HttpOnly cookie
    await setAuthCookie(jwtToken);

    // Revalidate paths для обновления Server Components
    revalidatePath("/forum");
    revalidatePath("/forum/profile");

    // Успешный вход - возвращаем success без редиректа (redirect в компоненте)
    return {
      success: true,
      user: user,
      message: "Úspešne ste sa prihlásili",
    };
  } catch (error) {
    console.error("[loginAction] Error:", error);
    return { error: "Chyba servera. Skúste to znovu." };
  }
}

/**
 * Server Action для регистрации
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
    const errors = {};

    if (!email) {
      errors.email = "Email je povinný";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Neplatný formát emailu";
    }

    if (!password) {
      errors.password = "Heslo je povinné";
    } else if (password.length < 6) {
      errors.password = "Heslo musí mať aspoň 6 znakov";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Potvrďte heslo";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Heslá sa nezhodujú";
    }

    if (!firstName) {
      errors.firstName = "Meno je povinné";
    }

    if (!lastName) {
      errors.lastName = "Priezvisko je povinné";
    }

    if (!username) {
      errors.username = "Používateľské meno je povinné";
    } else if (username.length < 3) {
      errors.username = "Používateľské meno musí mať aspoň 3 znaky";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username =
        "Používateľské meno môže obsahovať len písmená, číslice a podčiarkovník";
    }

    if (!agreeToTerms) {
      errors.agreeToTerms = "Musíte súhlasiť s podmienkami použitia";
    }

    if (Object.keys(errors).length > 0) {
      return { errors };
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
          error:
            "Používateľ s týmto emailom alebo používateľským menom už existuje",
        };
      }
      if (response.status === 429) {
        return { error: "Príliš veľa pokusov. Skúste neskôr." };
      }

      return { error: errorMessage };
    }

    // Регистрация успешна, переходим к верификации
    return {
      success: true,
      step: "verification",
      email: email,
      message: "Registrácia úspešná. Overte svoj email.",
    };
  } catch (error) {
    console.error("[registerAction] Error:", error);
    return { error: "Chyba servera. Skúste to znovu." };
  }
}

/**
 * Server Action для отправки кода верификации
 */
export async function sendVerificationAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();

    if (!email) {
      return { error: "Email je povinný" };
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
      return { error: data.message || "Nepodarilo sa odoslať kód" };
    }

    return {
      success: true,
      message: "Kód bol odoslaný na váš email",
    };
  } catch (error) {
    console.error("[sendVerificationAction] Error:", error);
    return { error: "Chyba servera. Skúste to znovu." };
  }
}

/**
 * Server Action для верификации email
 */
export async function verifyEmailAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();
    const code = formData.get("code")?.toString().trim();

    if (!email) {
      return { error: "Email je povinný" };
    }
    if (!code) {
      return { error: "Zadajte overovací kód" };
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
        return { error: "Neplatný alebo expirovaný kód" };
      }
      return { error: data.message || "Nepodarilo sa overiť email" };
    }

    // Email верифицирован успешно
    return {
      success: true,
      step: "success",
      message: "Email bol úspešne overený",
    };
  } catch (error) {
    console.error("[verifyEmailAction] Error:", error);
    return { error: "Chyba servera. Skúste to znovu." };
  }
}

/**
 * Server Action для восстановления пароля
 */
export async function forgotPasswordAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();

    if (!email) {
      return { error: "Email je povinný" };
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { error: "Neplatný formát emailu" };
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
        error: data.message || "Nepodarilo sa odoslať odkaz na obnovenie hesla",
      };
    }

    return {
      success: true,
      message: "Odkaz na obnovenie hesla bol odoslaný na váš email",
    };
  } catch (error) {
    console.error("[forgotPasswordAction] Error:", error);
    return { error: "Chyba servera. Skúste to znovu." };
  }
}

/**
 * Server Action для сброса пароля
 */
export async function resetPasswordAction(prevState, formData) {
  try {
    const email = formData.get("email")?.toString().trim();
    const code = formData.get("code")?.toString().trim();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    // Валидация
    if (!email) {
      return { error: "Email je povinný" };
    }
    if (!code) {
      return { error: "Kód je povinný" };
    }
    if (!newPassword) {
      return { error: "Nové heslo je povinné" };
    }
    if (newPassword.length < 6) {
      return { error: "Heslo musí mať aspoň 6 znakov" };
    }
    if (newPassword !== confirmPassword) {
      return { error: "Heslá sa nezhodujú" };
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
      return { error: data.message || "Nepodarilo sa obnoviť heslo" };
    }

    return {
      success: true,
      message: "Heslo bolo úspešne obnovené",
    };
  } catch (error) {
    console.error("[resetPasswordAction] Error:", error);
    return { error: "Chyba servera. Skúste to znovu." };
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
