import "server-only";

import serverApiClient from "../base/ServerApiClient";

class CategoriesServiceServer {
  constructor() {
    this.client = serverApiClient;

    // тот же статичный fallback
    this.staticCategories = [
      {
        id: "expert",
        name: "Otázka expertovi",
        slug: "expert",
        description: "Finančné otázky pre odborníkov a expertov",
        icon: "👨‍💼",
        questionsCount: 0,
      },
      {
        id: "lawyer",
        name: "Otázka právnikovi",
        slug: "pravnik",
        description: "Právne otázky a právne poradenstvo",
        icon: "⚖️",
        questionsCount: 0,
      },
    ];
  }

  // === SERVER-SIDE ===

  async getAll(withStats = false) {
    try {
      // когда появится реальный эндпоинт:
      // return await this.client.get(`/categories${withStats ? '?stats=true' : ''}`);
      return this.staticCategories;
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[CategoriesServiceServer.getAll]", e.message);
      }
      return this.staticCategories;
    }
  }

  async getBySlug(slug) {
    try {
      // реальный запрос:
      // return await this.client.get(`/categories/${slug}`);
      const category = this.staticCategories.find((c) => c.slug === slug);
      if (!category) {
        const err = new Error("Категория не найдена");
        err.status = 404;
        throw err;
      }
      return category;
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[CategoriesServiceServer.getBySlug]", e.message);
      }
      throw e;
    }
  }

  async getPopular(limit = 2) {
    try {
      const all = await this.getAll(true);
      return all
        .sort((a, b) => (b.questionsCount || 0) - (a.questionsCount || 0))
        .slice(0, limit);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[CategoriesServiceServer.getPopular]", e.message);
      }
      return this.staticCategories.slice(0, limit);
    }
  }

  // === ADMIN ===
  async updateCategoryStats(slug, questionsCount) {
    // при реальном API:
    // await this.client.put(`/categories/${slug}/stats`, { questionsCount });
    const i = this.staticCategories.findIndex((c) => c.slug === slug);
    if (i !== -1) this.staticCategories[i].questionsCount = questionsCount;
    return { success: true };
  }

  // === УТИЛИТЫ (те же, что и в клиенте) ===
  getCategoryName(slug) {
    const c = this.staticCategories.find((cat) => cat.slug === slug);
    return c ? c.name : slug;
  }

  getCategoryIcon(slug) {
    const c = this.staticCategories.find((cat) => cat.slug === slug);
    return c ? c.icon : "❓";
  }

  categoryExists(slug) {
    return this.staticCategories.some((cat) => cat.slug === slug);
  }

  getCategoryBreadcrumbs(slug) {
    const c = this.staticCategories.find((cat) => cat.slug === slug);
    if (!c) {
      return [
        { name: "FastCredit", href: "/" },
        { name: "Fórum", href: "/forum" },
        { name: "Neznáma kategória", href: `/forum/categories/${slug}` },
      ];
    }
    return [
      { name: "FastCredit", href: "/" },
      { name: "Fórum", href: "/forum" },
      { name: c.name, href: `/forum/categories/${slug}` },
    ];
  }

  getCategoryMetadata(slug) {
    const c = this.staticCategories.find((cat) => cat.slug === slug);
    if (!c) {
      return {
        title: "Neznáma kategória - FastCredit Fórum",
        description: "Kategória nebola nájdená",
        keywords: "fastcredit, forum",
      };
    }
    return {
      title: `${c.name} - FastCredit Fórum`,
      description: c.description,
      keywords: `${c.name.toLowerCase()}, fastcredit, forum, otázky, odpovede`,
    };
  }

  // совместимость со старым неймингом:
  async getAllServer(withStats = false) {
    return this.getAll(withStats);
  }
  async getBySlugServer(slug) {
    return this.getBySlug(slug);
  }
  async getPopularServer(limit = 2) {
    return this.getPopular(limit);
  }
}

export default new CategoriesServiceServer();
