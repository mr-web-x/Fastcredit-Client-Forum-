// Файл: src/components/QuestionsListPage/QuestionsFilters/QuestionsFilters.jsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import "./QuestionsFilters.scss";

export default function QuestionsFilters({
  filterOptions = {},
  currentFilters = {},
  isModal = false,
  onClose = null,
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

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...localFilters,
      [filterType]: value,
    };

    setLocalFilters(newFilters);
    updateFilters(newFilters);

    // Не закрываем модал сразу, даем пользователю настроить все фильтры
  };

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

  const hasActiveFilters =
    localFilters.category || localFilters.status || localFilters.period;

  const activeFiltersCount = [
    localFilters.category,
    localFilters.status,
    localFilters.period,
  ].filter(Boolean).length;

  return (
    <div
      className={`questions-filters ${
        isModal ? "questions-filters--modal" : ""
      }`}
    >
      {/* Header */}
      <div className="questions-filters__header">
        <div className="questions-filters__header-main">
          <h2 className="questions-filters__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            Filtre
            {activeFiltersCount > 0 && (
              <span className="questions-filters__count">
                {activeFiltersCount}
              </span>
            )}
          </h2>
          {isModal && (
            <button
              onClick={onClose}
              className="questions-filters__close"
              aria-label="Zavrieť filtre"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="questions-filters__clear"
            disabled={isPending}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
            Vymazať všetko
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="questions-filters__content">
        {/* Kategória */}
        <div className="questions-filters__group">
          <label htmlFor="category-filter" className="questions-filters__label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h6v-2H3v2zM3 6v2h6V6H3zm0 7h6v-2H3v2z" />
              <path d="M20 2H10v2h10v2l3-3-3-3v2zM20 22h-10v-2H20v-2l3 3-3 3v-2z" />
            </svg>
            Sortovať podľa
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="questions-filters__loading">
          <div className="questions-filters__loading-spinner"></div>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Použiť filtre
          </button>
        </div>
      )}
    </div>
  );
}
