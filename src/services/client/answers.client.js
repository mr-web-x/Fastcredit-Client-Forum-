"use client";

import apiClient from "../base/ApiClient";

class AnswersServiceClient {
  constructor() {
    this.client = apiClient;
  }

  // === CLIENT-SIDE МЕТОДЫ ===

  /** Получение ответов для вопроса */
  async getAnswersForQuestion(questionId, includeUnapproved = false) {
    const qp = new URLSearchParams();
    if (includeUnapproved) qp.set("includeUnapproved", "true");
    const url = `/answers/question/${questionId}${
      qp.toString() ? `?${qp.toString()}` : ""
    }`;
    return this.client.get(url);
  }

  /** Создание ответа эксперта на вопрос */
  async createAnswer(questionId, answerData) {
    return this.client.post(`/answers/question/${questionId}`, answerData);
  }

  /** Обновление ответа */
  async updateAnswer(answerId, updateData) {
    return this.client.put(`/answers/${answerId}`, updateData);
  }

  /** Принятие ответа как лучшего */
  async acceptAnswer(answerId) {
    return this.client.post(`/answers/${answerId}/accept`);
  }

  /** Лайк ответа */
  async likeAnswer(answerId) {
    return this.client.post(`/answers/${answerId}/like`);
  }

  /** Удаление ответа */
  async deleteAnswer(answerId) {
    return this.client.delete(`/answers/${answerId}`);
  }

  /** Ответы конкретного эксперта (пагинация) */
  async getExpertAnswers(expertId, params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/answers/expert/${expertId}?${qp.toString()}`);
  }

  /** Лучшие ответы эксперта */
  async getExpertBestAnswers(expertId) {
    return this.client.get(`/answers/expert/${expertId}/best`);
  }

  // === ADMIN ===

  /** Модерация ответа */
  async moderateAnswer(answerId, moderationData) {
    return this.client.post(`/answers/${answerId}/moderate`, moderationData);
  }

  /** Статистика ответов */
  async getAnswersStatistics() {
    return this.client.get("/answers/statistics");
  }

  /** Ответы на модерации */
  async getPendingAnswers(params = {}) {
    const { page = 1, limit = 10, status = "pending" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) qp.set("status", status);
    return this.client.get(`/answers/pending?${qp.toString()}`);
  }

  // === УТИЛИТЫ (чистые функции, безопасно шарить) ===

  canUserAnswer(user) {
    if (!user) return false;
    return user.role === "expert" || user.role === "admin";
  }

  canUserAcceptAnswer(user, question) {
    if (!user || !question) return false;
    return user._id === question.author._id || user._id === question.author;
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

export default new AnswersServiceClient();
