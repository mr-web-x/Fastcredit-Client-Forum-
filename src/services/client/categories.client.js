"use client";

import apiClient from "../base/ApiClient";

class CategoriesServiceClient {
  constructor() {
    this.client = apiClient;

    // статичный fallback
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
        slug: "lawyer",
        description: "Právne otázky a právne poradenstvo",
        icon: "⚖️",
        questionsCount: 0,
      },
    ];
  }

  // === CLIENT-SIDE ===

  async getAll(withStats = false) {
    try {
      // при появлении API раскомментируй:
      // return this.client.get(`/categories${withStats ? '?stats=true' : ''}`);
      return this.staticCategories;
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[CategoriesServiceClient.getAll] fallback to static:",
          e.message
        );
      }
      return this.staticCategories;
    }
  }

  async getBySlug(slug) {
    // при появлении API:
    // return this.client.get(`/categories/${slug}`);
    const category = this.staticCategories.find((c) => c.slug === slug);
    if (!category) {
      const err = new Error("Категория не найдена");
      err.status = 404;
      throw err;
    }
    return category;
  }

  async getPopular(limit = 2) {
    const all = await this.getAll(true);
    return all
      .sort((a, b) => (b.questionsCount || 0) - (a.questionsCount || 0))
      .slice(0, limit);
  }

  // === ADMIN (если подключишь реальный API) ===
  async updateCategoryStats(slug, questionsCount) {
    // при реальном API:
    // await this.client.put(`/categories/${slug}/stats`, { questionsCount });
    const i = this.staticCategories.findIndex((c) => c.slug === slug);
    if (i !== -1) this.staticCategories[i].questionsCount = questionsCount;
    return { success: true };
  }

  // === УТИЛИТЫ (чистые функции) ===
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
        { name: "Fórum", href: "/" },
        { name: "Neznáma kategória", href: `//categories/${slug}` },
      ];
    }
    return [
      { name: "FastCredit", href: "/" },
      { name: "Fórum", href: "/" },
      { name: c.name, href: `//categories/${slug}` },
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
}

export default new CategoriesServiceClient();
