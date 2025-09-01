import "server-only";
import axios from "axios";
import { cookies } from "next/headers";

class ServerApiClient {
  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    this.timeout = 15000;
  }

  // Создаем клиент для каждого запроса с актуальными cookies
  createClient(additionalHeaders = {}) {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    return axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, // передаем cookies для авторизации
        ...additionalHeaders,
      },
    });
  }

  // Обработка ответа от сервера
  handleResponse(response) {
    // Автоматически извлекаем data из стандартного формата API
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  }

  // Обработка ошибок на сервере
  handleError(error) {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      // Создаем стандартизированную ошибку для сервера
      const apiError = new Error(data?.message || "Server API Error");
      apiError.status = status;
      apiError.code = data?.error?.type || "UNKNOWN_ERROR";
      apiError.field = data?.error?.field;
      apiError.originalError = error;

      // На сервере не делаем редиректы, только логируем
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[ServerAPI Error ${status}]:`,
          data?.message || error.message
        );
      }

      throw apiError;
    }

    // Ошибка сети
    const networkError = new Error("Network error in server API call");
    networkError.status = 0;
    networkError.code = "NETWORK_ERROR";
    networkError.originalError = error;

    if (process.env.NODE_ENV === "development") {
      console.error("[ServerAPI Network Error]:", error.message);
    }

    throw networkError;
  }

  // GET запрос для сервера
  async get(url, config = {}) {
    try {
      const client = this.createClient(config.headers);
      const response = await client.get(url, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST запрос для сервера
  async post(url, data = {}, config = {}) {
    try {
      const client = this.createClient(config.headers);
      const response = await client.post(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // PUT запрос для сервера
  async put(url, data = {}, config = {}) {
    try {
      const client = this.createClient(config.headers);
      const response = await client.put(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // DELETE запрос для сервера
  async delete(url, config = {}) {
    try {
      const client = this.createClient(config.headers);
      const response = await client.delete(url, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // PATCH запрос для сервера
  async patch(url, data = {}, config = {}) {
    try {
      const client = this.createClient(config.headers);
      const response = await client.patch(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Экспортируем синглтон для сервера
const serverApiClient = new ServerApiClient();
export default serverApiClient;
