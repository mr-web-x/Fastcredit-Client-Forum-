import "server-only";

import serverApiClient from "../base/ServerApiClient";

class AnswersServiceServer {
  constructor() {
    this.client = serverApiClient;
  }

  // === SERVER-SIDE (SSR / server actions / route handlers) ===

  /** Получение ответов для вопроса (сервер) */
  async getAnswersForQuestion(questionId, includeUnapproved = false) {
    try {
      const qp = new URLSearchParams();
      if (includeUnapproved) qp.set("includeUnapproved", "true");
      const url = `/answers/question/${questionId}${
        qp.toString() ? `?${qp.toString()}` : ""
      }`;
      return await this.client.get(url);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[AnswersServiceServer.getAnswersForQuestion]",
          e.message
        );
      }
      return [];
    }
  }

  /** Ответы эксперта (сервер) */
  async getExpertAnswers(expertId, params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    try {
      return await this.client.get(
        `/answers/expert/${expertId}?${qp.toString()}`
      );
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[AnswersServiceServer.getExpertAnswers]", e.message);
      }
      return { items: [], pagination: null };
    }
  }

  /** Лучшие ответы эксперта (сервер) */
  async getExpertBestAnswers(expertId) {
    return this.client.get(`/answers/expert/${expertId}/best`);
  }

  // === CRUD/операции (серверные аналоги, если нужно вызывать с сервера) ===

  async createAnswer(questionId, answerData) {
    return this.client.post(`/answers/question/${questionId}`, answerData);
  }

  async updateAnswer(answerId, updateData) {
    return this.client.put(`/answers/${answerId}`, updateData);
  }

  async acceptAnswer(answerId) {
    return this.client.post(`/answers/${answerId}/accept`);
  }

  async likeAnswer(answerId) {
    return this.client.post(`/answers/${answerId}/like`);
  }

  async deleteAnswer(answerId) {
    return this.client.delete(`/answers/${answerId}`);
  }

  // === ADMIN ===

  async moderateAnswer(answerId, moderationData) {
    return this.client.post(`/answers/${answerId}/moderate`, moderationData);
  }

  async getAnswersStatistics() {
    return this.client.get("/answers/statistics");
  }

  async getPendingAnswers(params = {}) {
    const { page = 1, limit = 10, status = "pending" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) qp.set("status", status);
    return this.client.get(`/answers/pending?${qp.toString()}`);
  }

  // === УТИЛИТЫ (чистые функции — можно дублировать для удобства) ===

  canUserAnswer(user) {
    if (!user) return false;
    return user.role === "expert" || user.role === "admin";
  }

  canUserAcceptAnswer(user, question) {
    if (!user || !question) return false;
    return user._id === (question.author?._id ?? question.author);
  }

  canUserEditAnswer(user, answer) {
    if (!user || !answer) return false;
    return (
      user._id === (answer.author?._id ?? answer.author) ||
      user.role === "admin"
    );
  }

  getAnswerStatusText(answer) {
    if (!answer) return "";
    switch (answer.status) {
      case "approved":
        return answer.isBest ? "Лучший ответ" : "Опубликован";
      case "pending":
        return "На модерации";
      case "rejected":
        return "Отклонен";
      default:
        return "";
    }
  }
}

export default new AnswersServiceServer();
