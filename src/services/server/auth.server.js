import "server-only";

import serverApiClient from "../base/ServerApiClient";

class AuthServiceServer {
  constructor() {
    this.client = serverApiClient;
  }

  // === SERVER-SIDE ===
  async getServerUser() {
    try {
      return await this.client.get("/auth/me");
    } catch (e) {
      if (e.status === 401) return null;
      if (process.env.NODE_ENV === "development") {
        console.error("[AuthServiceServer.getServerUser]", e.message);
      }
      return null;
    }
  }

  async getServerPermissions() {
    try {
      return await this.client.get("/auth/permissions");
    } catch (e) {
      if (e.status === 401) return null;
      return null;
    }
  }

  // (опционально) серверные аналоги, если нужны вызовы из RSC/server actions:
  async login(credentials) {
    return this.client.post("/auth/login", credentials);
  }

  async register(userData) {
    return this.client.post("/auth/register", userData);
  }

  async logout() {
    return this.client.post("/auth/logout");
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
}

export default new AuthServiceServer();
