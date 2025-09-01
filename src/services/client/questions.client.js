"use client";

import apiClient from "../base/ApiClient";

class QuestionsServiceClient {
  constructor() {
    this.client = apiClient;
  }

  // === CLIENT-SIDE ===

  /** Последние вопросы (клиент) */
  async getLatest(params = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "-1",
      category = "",
      status = "",
      priority = "",
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

    const result = await this.client.get(`/questions?${qp.toString()}`);
    if (result?.data && result?.pagination) {
      return { items: result.data, pagination: result.pagination };
    }
    return { items: Array.isArray(result) ? result : [], pagination: null };
  }

  /** Топ вопросов */
  async getTop(params = {}) {
    const { limit = 5, period = 30, sortBy = "likes" } = params;
    const qp = new URLSearchParams({
      limit: String(limit),
      period: String(period),
      sortBy,
    });
    const result = await this.client.get(`/questions/top?${qp.toString()}`);
    return {
      items: Array.isArray(result) ? result : result?.data || [],
      pagination: null,
    };
  }

  /** Поиск */
  async search(params = {}) {
    const { q, page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      q: q || "",
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/questions/search?${qp.toString()}`);
  }

  /** Вопрос по id/slug */
  async getById(identifier) {
    return this.client.get(`/questions/${identifier}`);
  }

  /** Создать вопрос */
  async create(questionData) {
    return this.client.post("/questions", questionData);
  }

  /** Обновить вопрос */
  async update(id, updateData) {
    return this.client.put(`/questions/${id}`, updateData);
  }

  /** Лайк вопроса */
  async like(id) {
    return this.client.post(`/questions/${id}/like`);
  }

  /** Похожие вопросы */
  async getSimilar(id, limit = 5) {
    return this.client.get(`/questions/${id}/similar?limit=${limit}`);
  }

  /** Удалить вопрос */
  async delete(id) {
    return this.client.delete(`/questions/${id}`);
  }

  /** Вопросы пользователя */
  async getUserQuestions(userId, params = {}) {
    const { page = 1, limit = 10, status = "" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) qp.set("status", status);
    return this.client.get(`/questions/user/${userId}?${qp.toString()}`);
  }

  // === ADMIN ===

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
}

export default new QuestionsServiceClient();
