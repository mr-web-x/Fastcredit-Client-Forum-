"use client";

import apiClient from "../base/ApiClient";

class UsersServiceClient {
  constructor() {
    this.client = apiClient;
  }

  // === CLIENT-SIDE ===

  /** Список экспертов */
  async getExperts(params = {}) {
    const { page = 1, limit = 10, sortBy = "rating" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
    });
    return this.client.get(`/experts?${qp.toString()}`);
  }

  /** Профиль эксперта */
  async getExpertProfile(userId) {
    return this.client.get(`/experts/${userId}`);
  }

  /** Профиль пользователя */
  async getUserProfile(userId) {
    return this.client.get(`/users/${userId}`);
  }

  /** Активность пользователя */
  async getUserActivity(userId, params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/users/${userId}/activity?${qp.toString()}`);
  }

  // === ADMIN ===

  /** Все пользователи (админ) */
  async getAllUsers(params = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      role = "",
      isActive = "",
      search = "",
    } = params;

    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
    });
    if (role) qp.set("role", role);
    if (isActive !== "") qp.set("isActive", String(isActive));
    if (search) qp.set("search", search);

    return this.client.get(`/users?${qp.toString()}`);
  }

  /** Поиск пользователей (админ) */
  async searchUsers(params = {}) {
    const { q, page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      q: q || "",
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/users/search?${qp.toString()}`);
  }

  /** Статистика пользователей (админ) */
  async getUsersStatistics() {
    return this.client.get("/users/statistics");
  }

  /** Смена роли (админ) */
  async changeUserRole(userId, newRole, reason) {
    return this.client.put(`/users/${userId}/role`, { newRole, reason });
  }

  /** Бан (админ) */
  async banUser(userId, banData) {
    return this.client.post(`/users/${userId}/ban`, banData);
  }

  /** Разбан (админ) */
  async unbanUser(userId) {
    return this.client.post(`/users/${userId}/unban`);
  }

  /** История ролей (админ) */
  async getUserRoleHistory(userId, params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/users/${userId}/role-history?${qp.toString()}`);
  }

  // === EXPERT ===

  /** Дашборд эксперта */
  async getExpertDashboard() {
    return this.client.get("/experts/dashboard");
  }

  /** Кандидаты в эксперты (админ) */
  async getExpertCandidates(params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/users/expert-candidates?${qp.toString()}`);
  }
}

export default new UsersServiceClient();
