import "server-only";

import serverApiClient from "../base/ServerApiClient";

class UsersServiceServer {
  constructor() {
    this.client = serverApiClient;
  }

  // === SERVER-SIDE ===

  /** Список экспертов (сервер) */
  async getExperts(params = {}) {
    const { page = 1, limit = 10, sortBy = "rating" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
    });
    try {
      return await this.client.get(`/experts?${qp.toString()}`);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[UsersServiceServer.getExperts]", e.message);
      }
      return { items: [], pagination: null };
    }
  }

  /** Профиль эксперта (сервер) */
  async getExpertProfile(userId) {
    try {
      return await this.client.get(`/experts/${userId}`);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[UsersServiceServer.getExpertProfile]",
          userId,
          e.message
        );
      }
      throw e; // важно для 404
    }
  }

  /** Профиль пользователя (сервер) */
  async getUserProfile(userId) {
    try {
      return await this.client.get(`/users/${userId}`);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[UsersServiceServer.getUserProfile]", userId, e.message);
      }
      throw e;
    }
  }

  /** Активность пользователя (сервер) */
  async getUserActivity(userId, params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/users/${userId}/activity?${qp.toString()}`);
  }

  // === ADMIN (сервер) ===

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

  async searchUsers(params = {}) {
    const { q, page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      q: q || "",
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/users/search?${qp.toString()}`);
  }

  async getUsersStatistics() {
    return this.client.get("/users/statistics");
  }

  async changeUserRole(userId, role, reason) {
    return this.client.put(`/users/${userId}/role`, { role, reason });
  }

  async banUser(userId, banData) {
    return this.client.post(`/users/${userId}/ban`, banData);
  }

  async unbanUser(userId) {
    return this.client.post(`/users/${userId}/unban`);
  }

  async getUserRoleHistory(userId, params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/users/${userId}/role-history?${qp.toString()}`);
  }

  // === EXPERT ===

  async getExpertDashboard() {
    return this.client.get("/experts/dashboard");
  }

  async getExpertCandidates(params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/users/expert-candidates?${qp.toString()}`);
  }

  // — совместимость со старыми именами (если где-то используются)
  async getExpertsServer(p = {}) {
    return this.getExperts(p);
  }
  async getExpertProfileServer(id) {
    return this.getExpertProfile(id);
  }
  async getUserProfileServer(id) {
    return this.getUserProfile(id);
  }
}

export default new UsersServiceServer();
