// Файл: src/lib/auth-server.js

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { basePath } from "@/src/constants/config";

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
    path: "/forum",
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
    path: "/forum",
  });
}

/**
 * Проверка валидности сессии
 * @returns {boolean} - валидна ли сессия
 */
export async function validateSession() {
  const user = await getServerUser();
  return !!user;
}

/**
 * Guard для защищенных страниц - требует авторизации
 * @param {string} redirectTo - куда перенаправить если не авторизован
 */
export async function requireAuth(redirectTo = "/login") {
  const user = await getServerUser();

  if (!user) {
    const loginUrl = redirectTo.startsWith("/")
      ? `${basePath}${redirectTo}`
      : `${basePath}/${redirectTo}`;
    redirect(loginUrl);
  }

  return user;
}

/**
 * Guard для гостевых страниц - перенаправляет авторизованных
 * @param {string} redirectTo - куда перенаправить (относительный путь)
 */
export async function requireGuest(redirectTo = "/") {
  const user = await getServerUser();

  if (user) {
    // Просто делаем редирект - middleware сам добавит basePath если нужно
    redirect(redirectTo);
  }
}

/**
 * Проверка ролей пользователя
 * @param {Object} user - данные пользователя
 * @param {string} requiredRole - требуемая роль
 * @returns {boolean} - имеет ли пользователь нужные права
 */
export function hasPermission(user, requiredRole) {
  if (!user) return false;

  const roleHierarchy = {
    user: 1,
    expert: 2,
    moderator: 3,
    admin: 4,
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Guard для страниц с ограничением по ролям
 * @param {string} requiredRole - требуемая роль
 * @param {string} redirectTo - куда перенаправить при отсутствии прав
 */
export async function requireRole(requiredRole, redirectTo = "/") {
  const user = await requireAuth(); // Сначала проверяем авторизацию

  if (!hasPermission(user, requiredRole)) {
    const accessDeniedUrl = redirectTo.startsWith("/")
      ? `${basePath}${redirectTo}`
      : `${basePath}/${redirectTo}`;
    redirect(accessDeniedUrl);
  }

  return user;
}

/**
 * Проверка активности пользователя
 * @param {Object} user - данные пользователя
 * @returns {boolean} - активен ли пользователь
 */
export function isUserActive(user) {
  if (!user) return false;
  return user.isActive && !user.isBanned;
}

/**
 * Получение инициалов пользователя для аватара
 * @param {Object} user - данные пользователя
 * @returns {string} - инициалы
 */
export function getUserInitials(user) {
  if (!user) return "?";

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return firstName[0].toUpperCase();
  }

  if (user.username) {
    return user.username.slice(0, 2).toUpperCase();
  }

  return "?";
}

/**
 * Форматирование роли пользователя для отображения
 * @param {string} role - роль пользователя
 * @returns {string} - отформатированная роль
 */
export function formatUserRole(role) {
  const roleNames = {
    user: "Používateľ",
    expert: "Expert",
    moderator: "Moderátor",
    admin: "Administrátor",
  };

  return roleNames[role] || role;
}
