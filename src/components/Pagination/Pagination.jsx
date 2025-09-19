// Файл: src/features/QuestionsListPage/Pagination/Pagination.jsx

"use client";

import "./Pagination.scss";

export default function Pagination({
  pagination,
  currentFilters,
  basePath = "/forum/questions",
}) {
  if (!pagination || pagination.total <= 1) {
    return null;
  }

  const { current, limit, total, totalItems, hasNext, hasPrev } = pagination;

  // Создание URL с параметрами фильтров
  const createPageUrl = (page) => {
    const params = new URLSearchParams();

    // Добавляем страницу
    if (page > 1) {
      params.set("page", page.toString());
    }

    // Добавляем текущие фильтры
    if (currentFilters.category) {
      params.set("category", currentFilters.category);
    }
    if (currentFilters.period) {
      params.set("period", currentFilters.period);
    }
    if (currentFilters.sortBy && currentFilters.sortBy !== "createdAt") {
      params.set("sortBy", currentFilters.sortBy);
    }
    if (currentFilters.sortOrder && currentFilters.sortOrder !== "-1") {
      params.set("sortOrder", currentFilters.sortOrder);
    }

    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ""}`;
  };

  // Генерация массива страниц для отображения
  const generatePageNumbers = () => {
    const pages = [];
    const showAroundCurrent = 2; // Показываем по 2 страницы вокруг текущей

    // Всегда показываем первую страницу
    pages.push(1);

    // Определяем начало и конец диапазона вокруг текущей страницы
    let startPage = Math.max(2, current - showAroundCurrent);
    let endPage = Math.min(total - 1, current + showAroundCurrent);

    // Добавляем многоточие после первой страницы, если нужно
    if (startPage > 2) {
      pages.push("...");
    }

    // Добавляем страницы вокруг текущей
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i);
      }
    }

    // Добавляем многоточие перед последней страницей, если нужно
    if (endPage < total - 1) {
      pages.push("...");
    }

    // Всегда показываем последнюю страницу, если она не равна первой
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="pagination">
      {/* Информация о результатах */}
      <div className="pagination__info">
        <span className="pagination__results">
          Zobrazujeme {Math.min((current - 1) * Number(limit) + 1, totalItems)}–
          {Math.min(current * Number(limit), totalItems)} z{" "}
          <strong>{totalItems}</strong> otázok
        </span>
      </div>

      {/* Навигация по страницам */}
      <nav className="pagination__nav" aria-label="Pagination Navigation">
        {/* Кнопка "Предыдущая" */}
        {hasPrev ? (
          <a
            href={createPageUrl(current - 1)}
            className="pagination__button pagination__button--prev"
            aria-label="Predchádzajúca stránka"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
            </svg>
          </a>
        ) : (
          <span className="pagination__button pagination__button--prev pagination__button--disabled">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
            </svg>
          </span>
        )}

        {/* Номера страниц */}
        <div className="pagination__pages">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="pagination__ellipsis"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const isCurrentPage = page === current;

            return isCurrentPage ? (
              <span
                key={page}
                className="pagination__page pagination__page--current"
                aria-current="page"
                aria-label={`Stránka ${page}, aktuálna stránka`}
              >
                {page}
              </span>
            ) : (
              <a
                key={page}
                href={createPageUrl(page)}
                className="pagination__page"
                aria-label={`Prejsť na stránku ${page}`}
              >
                {page}
              </a>
            );
          })}
        </div>

        {/* Кнопка "Следующая" */}
        {hasNext ? (
          <a
            href={createPageUrl(current + 1)}
            className="pagination__button pagination__button--next"
            aria-label="Nasledujúca stránka"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6L8.59 7.41Z" />
            </svg>
          </a>
        ) : (
          <span className="pagination__button pagination__button--next pagination__button--disabled">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6L8.59 7.41Z" />
            </svg>
          </span>
        )}
      </nav>

      {/* Мобильная версия - простая навигация */}
      <div className="pagination__mobile">
        {hasPrev ? (
          <a
            href={createPageUrl(current - 1)}
            className="pagination__mobile-button"
            aria-label="Predchádzajúca stránka"
          >
            ←
          </a>
        ) : (
          <span className="pagination__mobile-button pagination__mobile-button--disabled">
            ←
          </span>
        )}

        <span className="pagination__mobile-info">
          {current} / {total}
        </span>

        {hasNext ? (
          <a
            href={createPageUrl(current + 1)}
            className="pagination__mobile-button"
            aria-label="Nasledujúca stránka"
          >
            →
          </a>
        ) : (
          <span className="pagination__mobile-button pagination__mobile-button--disabled">
            →
          </span>
        )}
      </div>
    </div>
  );
}
