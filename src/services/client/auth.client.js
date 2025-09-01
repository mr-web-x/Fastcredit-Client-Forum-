"use client";

import apiClient from "../base/ApiClient";

class AuthServiceClient {
  constructor() {
    this.client = apiClient;
  }

  // === CLIENT-SIDE ===
  async login(credentials) {
    return this.client.post("/auth/login", credentials);
  }

  async register(userData) {
    return this.client.post("/auth/register", userData);
  }

  async logout() {
    try {
      await this.client.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") window.location.href = "/forum/login";
    }
  }

  async getMe() {
    try {
      return await this.client.get("/auth/me");
    } catch (e) {
      if (e.status === 401) return null;
      throw e;
    }
  }

  async updateProfile(profileData) {
    return this.client.put("/auth/profile", profileData);
  }

  async sendVerificationCode(email) {
    return this.client.post("/auth/send-verification-code", { email });
  }

  async verifyEmail(email, code) {
    return this.client.post("/auth/verify-email", { email, code });
  }

  async requestPasswordReset(email) {
    return this.client.post("/auth/request-password-reset", { email });
  }

  async resetPassword(resetData) {
    return this.client.post("/auth/reset-password", resetData);
  }

  async checkEmailAvailability(email) {
    return this.client.post("/auth/check-email", { email });
  }

  async checkUsernameAvailability(username) {
    return this.client.post("/auth/check-username", { username });
  }

  // === УТИЛИТЫ (только клиент) ===
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    const jwtName = (process.env.JWT_COOKIE_NAME || "fc_jwt") + "=";
    return document.cookie.split(";").some((c) => c.trim().startsWith(jwtName));
  }

  getUserRole() {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const user = JSON.parse(raw);
      return user?.role ?? null;
    } catch {
      return null;
    }
  }

  setUserData(user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  clearUserData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }
}

export default new AuthServiceClient();
