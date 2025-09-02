import "server-only";
import axios from "axios";
import { cookies } from "next/headers";

class ServerApiClient {
  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    this.timeout = 15000;
  }

  // Всегда создаём клиент с актуальными куками запроса
  async createClient(additionalHeaders = {}) {
    const cookieStore = await cookies(); // <-- обязательно await в Next 15
    const all = cookieStore.getAll(); // [{ name, value }, ...]
    const cookieHeader = all
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    return axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...additionalHeaders,
      },
      // withCredentials не обязателен для server-side axios, но можно оставить:
      // withCredentials: true,
    });
  }

  handleResponse(response) {
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  }

  handleError(error) {
    const { response } = error;

    if (response) {
      const { status, data } = response;
      const apiError = new Error(data?.message || "Server API Error");
      apiError.status = status;
      apiError.code = data?.error?.type || "UNKNOWN_ERROR";
      apiError.field = data?.error?.field;
      apiError.originalError = error;

      if (process.env.NODE_ENV === "development") {
        console.error(
          `[ServerAPI Error ${status}]:`,
          data?.message || error.message
        );
      }
      throw apiError;
    }

    const networkError = new Error("Network error in server API call");
    networkError.status = 0;
    networkError.code = "NETWORK_ERROR";
    networkError.originalError = error;

    if (process.env.NODE_ENV === "development") {
      console.error("[ServerAPI Network Error]:", error.message);
    }
    throw networkError;
  }

  async get(url, config = {}) {
    try {
      const client = await this.createClient(config.headers); // <-- await
      const response = await client.get(url, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const client = await this.createClient(config.headers); // <-- await
      const response = await client.post(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const client = await this.createClient(config.headers); // <-- await
      const response = await client.put(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const client = await this.createClient(config.headers); // <-- await
      const response = await client.delete(url, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const client = await this.createClient(config.headers); // <-- await
      const response = await client.patch(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

const serverApiClient = new ServerApiClient();
export default serverApiClient;
