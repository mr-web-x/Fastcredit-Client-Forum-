import "server-only";

import serverApiClient from "../base/ServerApiClient";

class ReportsServiceServer {
  constructor() {
    this.client = serverApiClient;

    this.reportTargetTypes = {
      QUESTION: "question",
      ANSWER: "answer",
      COMMENT: "comment",
      USER: "user",
    };

    this.reportReasons = {
      SPAM: "spam",
      INAPPROPRIATE: "inappropriate",
      HARASSMENT: "harassment",
      FAKE_INFO: "fake_info",
      COPYRIGHT: "copyright",
      OTHER: "other",
    };
  }

  // === SERVER-SIDE ===

  async submitReport(reportData) {
    return this.client.post("/reports", reportData);
  }

  async getUserReports(params = {}) {
    const { page = 1, limit = 10, status = "" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) qp.set("status", status);
    return this.client.get(`/reports/my?${qp.toString()}`);
  }

  // === ADMIN ===

  async getAllReports(params = {}) {
    const {
      page = 1,
      limit = 20,
      status = "",
      targetType = "",
      reason = "",
      sortBy = "createdAt",
    } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
    });
    if (status) qp.set("status", status);
    if (targetType) qp.set("targetType", targetType);
    if (reason) qp.set("reason", reason);
    return this.client.get(`/reports?${qp.toString()}`);
  }

  async getReport(reportId) {
    return this.client.get(`/reports/${reportId}`);
  }

  async updateReportStatus(reportId, updateData) {
    return this.client.put(`/reports/${reportId}`, updateData);
  }

  async bulkUpdateReports(reportIds, updateData) {
    return this.client.post("/reports/bulk-update", {
      reportIds,
      ...updateData,
    });
  }

  async getReportsStatistics(params = {}) {
    const { period = "month", groupBy = "status" } = params;
    const qp = new URLSearchParams({ period, groupBy });
    return this.client.get(`/reports/statistics?${qp.toString()}`);
  }

  async deleteReport(reportId) {
    return this.client.delete(`/reports/${reportId}`);
  }

  // === УТИЛИТЫ (те же, что и на клиенте) ===

  getReasonText(reason) {
    const t = {
      [this.reportReasons.SPAM]: "Spam a nevyžiadaný obsah",
      [this.reportReasons.INAPPROPRIATE]: "Nevhodný obsah",
      [this.reportReasons.HARASSMENT]: "Obťažovanie a urážky",
      [this.reportReasons.FAKE_INFO]: "Nepravdivé informácie",
      [this.reportReasons.COPYRIGHT]: "Porušenie autorských práv",
      [this.reportReasons.OTHER]: "Iný dôvod",
    };
    return t[reason] || reason;
  }

  getTargetTypeText(targetType) {
    const t = {
      [this.reportTargetTypes.QUESTION]: "Otázka",
      [this.reportTargetTypes.ANSWER]: "Odpoveď",
      [this.reportTargetTypes.COMMENT]: "Komentár",
      [this.reportTargetTypes.USER]: "Používateľ",
    };
    return t[targetType] || targetType;
  }

  getStatusText(status) {
    const t = {
      pending: "Čaká na kontrolu",
      reviewed: "V riešení",
      resolved: "Vyriešené",
      rejected: "Zamietnuté",
    };
    return t[status] || status;
  }

  getStatusColor(status) {
    const t = {
      pending: "warning",
      reviewed: "info",
      resolved: "success",
      rejected: "danger",
    };
    return t[status] || "secondary";
  }

  canUserReport(user, targetId, targetType) {
    if (!user || !targetId || !targetType) return false;
    if (user.isBanned || !user.isActive) return false;
    return true;
  }

  validateReportData(reportData) {
    const errors = [];
    if (!reportData.targetId) errors.push("ID objektu je povinné");
    if (
      !reportData.targetType ||
      !Object.values(this.reportTargetTypes).includes(reportData.targetType)
    ) {
      errors.push("Neplatný typ objektu");
    }
    if (
      !reportData.reason ||
      !Object.values(this.reportReasons).includes(reportData.reason)
    ) {
      errors.push("Dôvod hlásenia je povinný");
    }
    if (!reportData.description || reportData.description.trim().length < 10) {
      errors.push("Popis musí mať aspoň 10 znakov");
    }
    if (reportData.description && reportData.description.length > 500) {
      errors.push("Popis môže mať maximálne 500 znakov");
    }
    return { isValid: errors.length === 0, errors };
  }

  getAvailableReasons() {
    return Object.values(this.reportReasons).map((value) => ({
      value,
      label: this.getReasonText(value),
    }));
  }

  formatReportTime(createdAt) {
    const d = new Date(createdAt);
    return d.toLocaleDateString("sk-SK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export default new ReportsServiceServer();
