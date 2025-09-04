import "server-only";
import axios from "axios";
import { cookies } from "next/headers";

class ServerApiClient {
  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    this.timeout = 15000;
  }

  // Создаем клиент с автоматической передачей всех cookies
  async createClient(additionalHeaders = {}) {
    const cookieStore = await cookies();

    // Получаем все cookies для передачи на backend
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    // Формируем заголовки
    const headers = {
      "Content-Type": "application/json",
      ...additionalHeaders,
    };

    // Добавляем Cookie header если есть cookies
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    return axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers,
    });
  }

  handleResponse(response) {
    // API возвращает стандартный формат: { success, data, message }
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  }

  handleError(error) {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      // Создаем стандартизированную ошибку
      const apiError = new Error(data?.message || "Server API Error");
      apiError.status = status;
      apiError.code = data?.error?.type || "UNKNOWN_ERROR";
      apiError.field = data?.error?.field;
      apiError.originalError = error;

      // Логирование для development
      if (process.env.NODE_ENV === "development") {
        console.error(`[ServerAPI Error ${status}]:`, {
          message: data?.message || error.message,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          cookies: error.config?.headers?.Cookie ? "Present" : "Missing",
          data: error.config?.data,
        });
      }

      throw apiError;
    }

    // Network ошибка
    const networkError = new Error("Network error in server API call");
    networkError.status = 0;
    networkError.code = "NETWORK_ERROR";
    networkError.originalError = error;

    if (process.env.NODE_ENV === "development") {
      console.error("[ServerAPI Network Error]:", error.message);
    }

    throw networkError;
  }

  // HTTP методы
  async get(url, config = {}) {
    try {
      const client = await this.createClient(config.headers);
      const response = await client.get(url, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const client = await this.createClient(config.headers);
      const response = await client.post(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const client = await this.createClient(config.headers);
      const response = await client.put(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const client = await this.createClient(config.headers);
      const response = await client.delete(url, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const client = await this.createClient(config.headers);
      const response = await client.patch(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

const serverApiClient = new ServerApiClient();
export default serverApiClient;
