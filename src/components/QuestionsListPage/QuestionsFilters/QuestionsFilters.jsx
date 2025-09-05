// Файл: src/features/QuestionsListPage/QuestionsFilters/QuestionsFilters.jsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import "./QuestionsFilters.scss";

export default function QuestionsFilters({
  filterOptions = {},
  currentFilters = {},
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Локальний стан для швидкої реакції UI
  const [localFilters, setLocalFilters] = useState({
    category: currentFilters.category || "",
    status: currentFilters.status || "",
    period: currentFilters.period || "",
    sortBy: currentFilters.sortBy || "createdAt",
  });

  // Функція для оновлення URL з новими фільтрами
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    // Оновлюємо параметри
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Скидаємо сторінку на 1 при зміні фільтрів
    params.delete("page");

    // Оновлюємо URL з transition для smooth UX
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  // Обробники зміни фільтрів
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...localFilters,
      [filterType]: value,
    };

    setLocalFilters(newFilters);
    updateFilters(newFilters);
  };

  // Скидання всіх фільтрів
  const clearAllFilters = () => {
    const clearedFilters = {
      category: "",
      status: "",
      period: "",
      sortBy: "createdAt",
    };

    setLocalFilters(clearedFilters);
    startTransition(() => {
      router.push("/questions", { scroll: false });
    });
  };

  // Перевірка чи є активні фільтри
  const hasActiveFilters =
    localFilters.category || localFilters.status || localFilters.period;

  return (
    <div className="questions-filters">
      <div className="questions-filters__header">
        <h2 className="questions-filters__title">Filtrovať otázky</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="questions-filters__clear"
            disabled={isPending}
          >
            Vymazať filtre
          </button>
        )}
      </div>

      <div className="questions-filters__row">
        {/* Kategória */}
        <div className="questions-filters__group">
          <label htmlFor="category-filter" className="questions-filters__label">
            Kategória
          </label>
          <select
            id="category-filter"
            value={localFilters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="questions-filters__select"
            disabled={isPending}
          >
            <option value="">Všetky kategórie</option>
            {filterOptions.categories?.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
                {category.count > 0 && ` (${category.count})`}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="questions-filters__group">
          <label htmlFor="status-filter" className="questions-filters__label">
            Stav
          </label>
          <select
            id="status-filter"
            value={localFilters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="questions-filters__select"
            disabled={isPending}
          >
            {filterOptions.statuses?.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
                {status.count && ` (${status.count})`}
              </option>
            ))}
          </select>
        </div>

        {/* Obdobie */}
        <div className="questions-filters__group">
          <label htmlFor="period-filter" className="questions-filters__label">
            Obdobie
          </label>
          <select
            id="period-filter"
            value={localFilters.period}
            onChange={(e) => handleFilterChange("period", e.target.value)}
            className="questions-filters__select"
            disabled={isPending}
          >
            {filterOptions.periods?.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sortovanie */}
        <div className="questions-filters__group">
          <label htmlFor="sort-filter" className="questions-filters__label">
            Zoradiť podľa
          </label>
          <select
            id="sort-filter"
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="questions-filters__select"
            disabled={isPending}
          >
            {filterOptions.sortOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <div className="questions-filters__active">
          <span className="questions-filters__active-label">
            Aktívne filtre:
          </span>
          <div className="questions-filters__pills">
            {localFilters.category && (
              <div className="questions-filters__pill">
                <span>
                  {filterOptions.categories?.find(
                    (c) => c.value === localFilters.category
                  )?.label || localFilters.category}
                </span>
                <button
                  onClick={() => handleFilterChange("category", "")}
                  className="questions-filters__pill-remove"
                  disabled={isPending}
                  aria-label="Odstrániť filter kategórie"
                >
                  ×
                </button>
              </div>
            )}

            {localFilters.status && (
              <div className="questions-filters__pill">
                <span>
                  {filterOptions.statuses?.find(
                    (s) => s.value === localFilters.status
                  )?.label || localFilters.status}
                </span>
                <button
                  onClick={() => handleFilterChange("status", "")}
                  className="questions-filters__pill-remove"
                  disabled={isPending}
                  aria-label="Odstrániť filter stavu"
                >
                  ×
                </button>
              </div>
            )}

            {localFilters.period && (
              <div className="questions-filters__pill">
                <span>
                  {filterOptions.periods?.find(
                    (p) => p.value === localFilters.period
                  )?.label || localFilters.period}
                </span>
                <button
                  onClick={() => handleFilterChange("period", "")}
                  className="questions-filters__pill-remove"
                  disabled={isPending}
                  aria-label="Odstrániť filter obdobia"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="questions-filters__loading">
          <span className="questions-filters__loading-text">
            Aktualizuje sa...
          </span>
        </div>
      )}

      {/* Apply button - только для модального окна */}
      {isModal && (
        <div className="questions-filters__modal-footer">
          <button
            onClick={onClose}
            className="questions-filters__apply-btn"
            disabled={isPending}
          >
            Použiť filtre
          </button>
        </div>
      )}
    </div>
  );
}
