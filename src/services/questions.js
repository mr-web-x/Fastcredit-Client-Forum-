import api from "./api";

class QuestionsService {
  async getLatest({ page = 1, limit = 10 } = {}) {
    const res = await api.get(
      `/questions?page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=-1`
    );

    console.log(res);

    // нормализуем
    if (res?.data?.data) {
      return {
        items: res.data.data,
        pagination: res.data.pagination,
      };
    }
    return { items: [], pagination: null };
  }

  async getTop({ limit = 5, period = 30, sortBy = "likes" } = {}) {
    const res = await api.get(
      `/questions/top?limit=${limit}&period=${period}&sortBy=${sortBy}`
    );

    // нормализуем
    if (Array.isArray(res?.data)) {
      return {
        items: res.data,
        pagination: null, // топ без пагинации
      };
    }
    return { items: [], pagination: null };
  }

  async search({ q, page = 1, limit = 10 } = {}) {
    const qs = new URLSearchParams({
      q,
      page: String(page),
      limit: String(limit),
    }).toString();
    return api.get(`/questions/search?${qs}`);
  }

  async getById(id) {
    return api.get(`/questions/${id}`);
  }

  async getPending({ page = 1, limit = 10 } = {}) {
    return api.get(`/questions/pending?page=${page}&limit=${limit}`);
  }

  async create({ title, content, category = "general", priority = "medium" }) {
    return api.post(
      "/questions",
      { title, content, category, priority },
      { credentials: "include" }
    );
  }

  async like(id) {
    return api.post(`/questions/${id}/like`, undefined, {
      credentials: "include",
    });
  }
}

// экспортируем один экземпляр
const questionsService = new QuestionsService();
export default questionsService;
