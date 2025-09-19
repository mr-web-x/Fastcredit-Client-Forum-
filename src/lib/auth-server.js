// Файл: src/lib/auth-server.js

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Получение данных пользователя из HttpOnly cookie
 * @returns {Object|null} - данные пользователя или null
 */
export async function getServerUser() {
  try {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      return null;
    }

    // Делаем запрос к backend API для получения данных пользователя
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${backendUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
      // Добавляем cache: 'no-store' чтобы всегда получать актуальные данные
      cache: "no-store",
    });

    if (!response.ok) {
      // Если токен невалидный (401), удаляем cookie
      if (response.status === 401) {
        await clearAuthCookie();
      }
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      return null;
    }

    return data.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getServerUser] Error:", error);
    }
    return null;
  }
}

/**
 * Установка HttpOnly cookie с JWT токеном
 * @param {string} token - JWT токен
 */
export async function setAuthCookie(token) {
  const cookieStore = await cookies();

  cookieStore.set("fc_jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 дней
    path: "/",
  });

  cookieStore.set("fc_jwt_client", token, {
    httpOnly: false, // Для клиента (доступно через JS)
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/", // Доступно везде
  });
}

/**
 * Удаление HttpOnly cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "fc_jwt",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Удаляем немедленно
    path: "/",
  });
}

/**
 * Guard для защищенных страниц - требует авторизации
 * @param {string} redirectTo - куда перенаправить если не авторизован
 */
export async function requireAuth(redirectTo = "/forum/login") {
  const user = await getServerUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

/**
 * Guard для гостевых страниц - перенаправляет авторизованных
 * @param {string} redirectTo - куда перенаправить (относительный путь)
 */
export async function requireGuest(redirectTo = "/forum") {
  const user = await getServerUser();

  if (user) {
    redirect(redirectTo);
  }
}
