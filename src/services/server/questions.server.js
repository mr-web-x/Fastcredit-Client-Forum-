import "server-only";

import serverApiClient from "../base/ServerApiClient";

class QuestionsServiceServer {
  constructor() {
    this.client = serverApiClient;
  }

  // === SERVER-SIDE (SSR / server actions / route handlers) ===

  /** Последние вопросы (сервер) */
  async getLatest(params = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "-1",
      category = "",
      status = "",
      priority = "",
      hasApprovedAnswers = null,
      hasPendingAnswers = null,
      includeAnswersCounters = false, // Добавили новый параметр
    } = params;

    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
    });

    if (category) qp.set("category", category);
    if (status) qp.set("status", status);
    if (priority) qp.set("priority", priority);

    // Добавляем новые параметры фильтрации по ответам
    if (hasApprovedAnswers !== null) {
      qp.set("hasApprovedAnswers", String(hasApprovedAnswers));
    }
    if (hasPendingAnswers !== null) {
      qp.set("hasPendingAnswers", String(hasPendingAnswers));
    }

    // Добавляем параметр для получения счетчиков ответов
    if (includeAnswersCounters) {
      qp.set("includeAnswersCounters", "true");
    }

    try {
      const result = await this.client.get(`/questions?${qp.toString()}`);
      if (result?.data && result?.pagination) {
        return { items: result.data, pagination: result.pagination };
      }
      return { items: Array.isArray(result) ? result : [], pagination: null };
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[QuestionsServiceServer.getLatest]", e.message);
      }
      return { items: [], pagination: null };
    }
  }
  /** Топ вопросов (сервер) */
  async getTop(params = {}) {
    const { limit = 5, period = 30, sortBy = "likes" } = params;
    const qp = new URLSearchParams({
      limit: String(limit),
      period: String(period),
      sortBy,
    });
    try {
      const result = await this.client.get(`/questions/top?${qp.toString()}`);
      return {
        items: Array.isArray(result) ? result : result?.data || [],
        pagination: null,
      };
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[QuestionsServiceServer.getTop]", e.message);
      }
      return { items: [], pagination: null };
    }
  }

  /** Вопрос по id/slug (сервер) */
  async getById(identifier) {
    try {
      return await this.client.get(`/questions/${identifier}`);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[QuestionsServiceServer.getById]",
          identifier,
          e.message
        );
      }
      throw e; // важно для 404
    }
  }

  // === CRUD и прочее — серверные аналоги при необходимости ===

  async create(questionData) {
    return this.client.post("/questions", questionData);
  }

  async update(id, updateData) {
    return this.client.put(`/questions/${id}`, updateData);
  }

  async like(id) {
    return this.client.post(`/questions/${id}/like`);
  }

  async getSimilar(id, limit = 5) {
    return this.client.get(`/questions/${id}/similar?limit=${limit}`);
  }

  async delete(id) {
    return this.client.delete(`/questions/${id}`);
  }

  async getUserQuestions(userId, params = {}) {
    const { page = 1, limit = 10, status = "" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) qp.set("status", status);
    return this.client.get(`/questions/user/${userId}?${qp.toString()}`);
  }

  // === ADMIN (сервер — если нужно вызывать из RSC/экшенов) ===

  async getStatistics() {
    return this.client.get("/questions/statistics");
  }

  async getPending(params = {}) {
    const { page = 1, limit = 10, priority = "" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (priority) qp.set("priority", priority);
    return this.client.get(`/questions/pending?${qp.toString()}`);
  }

  async changeStatus(id, status) {
    return this.client.put(`/questions/${id}/status`, { status });
  }

  // совместимость со старыми названиями (если использовались)
  async getLatestServer(p = {}) {
    return this.getLatest(p);
  }
  async getTopServer(p = {}) {
    return this.getTop(p);
  }
  async getByIdServer(id) {
    return this.getById(id);
  }
}

export default new QuestionsServiceServer();
