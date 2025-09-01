import "server-only";
import { authService } from "@/src/services/server";

/**
 * Получение данных пользователя для SSR
 * Использует cookies автоматически через serverApiClient
 * @returns {Object|null} - данные пользователя или null
 */
export async function getServerUser() {
  try {
    const user = await authService.getServerUser();
    return user;
  } catch (error) {
    // В случае любых ошибок возвращаем null
    return null;
  }
}

/**
 * Проверка прав пользователя на сервере
 * @param {Object} user - данные пользователя
 * @param {string} requiredRole - требуемая роль
 * @returns {boolean} - имеет ли пользователь нужные права
 */
export function hasServerPermission(user, requiredRole) {
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

/**
 * Генерация мета данных для страницы с учетом пользователя
 * @param {Object} baseMetadata - базовые мета данные
 * @param {Object} user - данные пользователя
 * @returns {Object} - обновленные мета данные
 */
export function generateUserMetadata(baseMetadata, user) {
  if (!user) {
    return baseMetadata;
  }

  return {
    ...baseMetadata,
    // Можем добавить персонализированные мета теги
    // title: `${baseMetadata.title} - ${user.firstName || user.username}`,
    // Или другие персонализированные данные
  };
}

/**
 * Проверка может ли пользователь просматривать контент
 * @param {Object} content - контент (вопрос, ответ и т.д.)
 * @param {Object} user - данные пользователя
 * @returns {boolean} - может ли просматривать
 */
export function canUserViewContent(content, user) {
  if (!content) return false;

  // Публичный контент может смотреть любой
  if (content.status === "approved" || content.status === "published") {
    return true;
  }

  // Черновики и неодобренный контент может смотреть только автор или админ
  if (content.status === "draft" || content.status === "pending") {
    if (!user) return false;

    const isAuthor =
      user._id === content.author?._id || user._id === content.author;
    const isAdmin = user.role === "admin" || user.role === "moderator";

    return isAuthor || isAdmin;
  }

  return false;
}

/**
 * Получение breadcrumbs с учетом пользователя
 * @param {Array} baseBreadcrumbs - базовые breadcrumbs
 * @param {Object} user - данные пользователя
 * @returns {Array} - обновленные breadcrumbs
 */
export function getUserBreadcrumbs(baseBreadcrumbs, user) {
  const breadcrumbs = [...baseBreadcrumbs];

  // Если пользователь авторизован, можем добавить персонализированные ссылки
  if (user && user.role === "admin") {
    // Для админа можем добавить ссылку на админ панель в определенных местах
  }

  return breadcrumbs;
}
