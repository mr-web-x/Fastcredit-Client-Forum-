"use client";

import apiClient from "../base/ApiClient";

class AdminServiceClient {
  constructor() {
    this.client = apiClient;
  }

  // === DASHBOARD И СТАТИСТИКА ===

  async getDashboard() {
    return this.client.get("/admin");
  }

  async getForumStatistics(params = {}) {
    const { period = 30, groupBy = "day" } = params;
    const qp = new URLSearchParams({ period: String(period), groupBy });
    return this.client.get(`/admin/statistics?${qp.toString()}`);
  }

  async getAnalytics(type, params = {}) {
    const { period = 30, detailed = false } = params;
    const qp = new URLSearchParams({ period: String(period) });
    if (detailed) qp.set("detailed", "true");
    return this.client.get(`/admin/analytics/${type}?${qp.toString()}`);
  }

  // === МОДЕРАЦИЯ ===

  async getQueueQuestions(params = {}) {
    const { page = 1, limit = 10, priority = "", category = "" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (priority) qp.set("priority", priority);
    if (category) qp.set("category", category);
    return this.client.get(`/admin/questions?${qp.toString()}`);
  }

  async getQueueAnswers(params = {}) {
    const { page = 1, limit = 10, status = "pending" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) qp.set("status", status);
    return this.client.get(`/admin/answers?${qp.toString()}`);
  }

  async getRoleChangesHistory(params = {}) {
    const { page = 1, limit = 20, userId = "", period = "" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (userId) qp.set("userId", userId);
    if (period) qp.set("period", period);
    return this.client.get(`/admin/role-changes?${qp.toString()}`);
  }

  async bulkModeration(moderationData) {
    return this.client.post("/admin/bulk-moderate", moderationData);
  }

  // === УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ===

  async getProblematicUsers(params = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = "reportsCount",
      minReports = 3,
      period = 30,
    } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      minReports: String(minReports),
      period: String(period),
    });
    return this.client.get(`/admin/users/problematic?${qp.toString()}`);
  }

  async getActiveUsers(params = {}) {
    const { page = 1, limit = 20, period = 30 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      period: String(period),
    });
    return this.client.get(`/admin/users/active?${qp.toString()}`);
  }

  async bulkUserAction(actionData) {
    return this.client.post("/admin/users/bulk-action", actionData);
  }

  // === СИСТЕМНЫЕ НАСТРОЙКИ ===

  async getSystemSettings() {
    return this.client.get("/admin/settings");
  }

  async updateSystemSettings(settings) {
    return this.client.put("/admin/settings", settings);
  }

  async getSystemLogs(params = {}) {
    const {
      page = 1,
      limit = 50,
      level = "",
      module = "",
      startDate = "",
      endDate = "",
    } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (level) qp.set("level", level);
    if (module) qp.set("module", module);
    if (startDate) qp.set("startDate", startDate);
    if (endDate) qp.set("endDate", endDate);
    return this.client.get(`/admin/logs?${qp.toString()}`);
  }

  // === ОТЧЁТЫ / ЭКСПОРТ ===

  async generateReport(reportConfig) {
    return this.client.post("/admin/reports/generate", reportConfig);
  }

  async exportData(exportConfig) {
    return this.client.post("/admin/export", exportConfig, {
      responseType: "blob",
    });
  }

  // === УТИЛИТЫ (чистые функции) ===

  isAdmin(user) {
    return user && user.role === "admin";
  }

  isModerator(user) {
    return user && (user.role === "admin" || user.role === "moderator");
  }

  getModerationActions(contentType) {
    const base = [
      { value: "approve", label: "Schváliť", color: "success" },
      { value: "reject", label: "Odmietnuť", color: "warning" },
      { value: "delete", label: "Vymazať", color: "danger" },
    ];
    switch (contentType) {
      case "questions":
        return [
          ...base,
          { value: "feature", label: "Označiť ako odporúčané", color: "info" },
          { value: "close", label: "Uzavrieť", color: "secondary" },
        ];
      case "answers":
        return [
          ...base,
          {
            value: "mark_best",
            label: "Označiť ako najlepšiu",
            color: "primary",
          },
        ];
      case "comments":
      default:
        return base;
    }
  }

  formatStatisticsForChart(data, type) {
    if (!Array.isArray(data)) return [];
    switch (type) {
      case "timeline":
        return data.map((i) => ({
          date: new Date(i.date).toLocaleDateString("sk-SK"),
          value: i.count ?? 0,
          ...i,
        }));
      case "pie":
        return data.map((i) => ({
          name: i.label || i.name,
          value: i.count ?? i.value,
          percentage: i.percentage ?? 0,
        }));
      case "bar":
        return data.map((i) => ({
          category: i.category || i.name,
          value: i.count ?? i.value,
          color: i.color || "#049ca1",
        }));
      default:
        return data;
    }
  }

  getPriorityColor(priority) {
    const colors = {
      low: "success",
      medium: "warning",
      high: "danger",
      urgent: "dark",
    };
    return colors[priority] || "secondary";
  }

  getPriorityText(priority) {
    const texts = {
      low: "Nízka",
      medium: "Stredná",
      high: "Vysoká",
      urgent: "Urgentná",
    };
    return texts[priority] || priority;
  }
}

export default new AdminServiceClient();
