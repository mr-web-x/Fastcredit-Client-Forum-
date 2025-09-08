import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
      timeout: 15000,
      withCredentials: true, // для передачи cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor для запросов
    this.client.interceptors.request.use(
      (config) => {
        // Читаем токен из cookies и добавляем в Authorization header
        if (typeof window !== "undefined") {
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("fc_jwt_client="))
            ?.split("=")[1];

          console.log("token", document.cookie.split("; "));

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor для ответов
    this.client.interceptors.response.use(
      (response) => {
        // Автоматически извлекаем data из стандартного формата API
        if (response.data && response.data.success) {
          return response.data.data;
        }
        return response.data;
      },
      (error) => {
        const { response } = error;

        if (response) {
          const { status, data } = response;

          // Создаем стандартизированную ошибку
          const apiError = new Error(data?.message || "Произошла ошибка");
          apiError.status = status;
          apiError.code = data?.error?.type || "UNKNOWN_ERROR";
          apiError.field = data?.error?.field;
          apiError.originalError = error;

          // Специальная обработка для разных статусов
          switch (status) {
            case 401:
              // НЕ делаем автоматический редирект - пусть компонент сам решает
              apiError.message = "Необходима повторная авторизация";
              break;
            case 403:
              apiError.message = "Недостаточно прав доступа";
              break;
            case 404:
              apiError.message = "Ресурс не найден";
              break;
            case 429:
              apiError.message = "Слишком много запросов. Попробуйте позже";
              break;
            case 500:
              apiError.message = "Ошибка сервера. Попробуйте позже";
              break;
          }

          return Promise.reject(apiError);
        }

        // Ошибка сети или таймаут
        const networkError = new Error("Проблемы с подключением к серверу");
        networkError.status = 0;
        networkError.code = "NETWORK_ERROR";
        networkError.originalError = error;

        return Promise.reject(networkError);
      }
    );
  }

  // GET запрос
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  // POST запрос
  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  // PUT запрос
  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  // DELETE запрос
  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  // PATCH запрос
  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }
}

// Экспортируем синглтон
const apiClient = new ApiClient();
export default apiClient;
