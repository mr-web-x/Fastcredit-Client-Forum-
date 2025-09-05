// Файл: src/components/QuestionsListPage/QuestionsListPage.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { basePath } from "@/src/constants/config";
import QuestionsFilters from "./QuestionsFilters/QuestionsFilters";
import QuestionsList from "./QuestionsList/QuestionsList";
import QuestionsPagination from "./QuestionsPagination/QuestionsPagination";
import "./QuestionsListPage.scss";

export default function QuestionsListPage({
  questions = [],
  pagination = null,
  filterOptions = {},
  currentFilters = {},
  error = null,
}) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Закрытие modal по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isFilterModalOpen) {
        setIsFilterModalOpen(false);
      }
    };

    if (isFilterModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFilterModalOpen]);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeFilterModal();
    }
  };

  return (
    <div className="questions-list-page">
      <div className="container">
        {/* Breadcrumbs */}
        <nav
          className="questions-list-page__breadcrumbs"
          aria-label="Breadcrumb"
        >
          <Link
            href={`${basePath}/`}
            className="questions-list-page__breadcrumb-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Domov
          </Link>
          <span className="questions-list-page__breadcrumb-separator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6z" />
            </svg>
          </span>
          <span className="questions-list-page__breadcrumb-current">
            Otázky
          </span>
        </nav>

        {/* Header */}
        <div className="questions-list-page__header">
          <div className="questions-list-page__header-content">
            <h1 className="questions-list-page__title">
              Všetky otázky
              {pagination && pagination.totalQuestions > 0 && (
                <span className="questions-list-page__count">
                  ({pagination.totalQuestions})
                </span>
              )}
            </h1>
            <p className="questions-list-page__subtitle">
              Prehliadajte otázky od našej komunity a nájdite odpovede od
              expertov
            </p>
          </div>

          <div className="questions-list-page__header-actions">
            <Link
              href={`${basePath}/ask`}
              className="questions-list-page__ask-btn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Zadať otázku
            </Link>

            {/* Mobile filter toggle - Material Design стиль */}
            <button
              className="questions-list-page__filter-toggle"
              onClick={openFilterModal}
              aria-label="Otvoriť filtre"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
              </svg>
              <span>Filtre</span>
              {/* Badge с количеством активных фильтров */}
              {(() => {
                const activeCount = [
                  currentFilters.category,
                  currentFilters.status,
                  currentFilters.period,
                ].filter(Boolean).length;

                return activeCount > 0 ? (
                  <span className="questions-list-page__filter-badge">
                    {activeCount}
                  </span>
                ) : null;
              })()}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="questions-list-page__error">
            <div className="questions-list-page__error-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <div className="questions-list-page__error-content">
              <h3>Chyba pri načítaní</h3>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="questions-list-page__error-retry"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                Skúsiť znovu
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="questions-list-page__content">
          {/* Desktop Sidebar */}
          <aside className="questions-list-page__sidebar">
            <QuestionsFilters
              filterOptions={filterOptions}
              currentFilters={currentFilters}
            />
          </aside>

          {/* Main Area */}
          <main className="questions-list-page__main">
            {/* Results Summary */}
            {pagination && (
              <div className="questions-list-page__results-summary">
                <div className="questions-list-page__results-info">
                  {pagination.totalQuestions > 0 ? (
                    <>
                      <span className="questions-list-page__results-text">
                        Zobrazujeme {(pagination.currentPage - 1) * 20 + 1}–
                        {Math.min(
                          pagination.currentPage * 20,
                          pagination.totalQuestions
                        )}{" "}
                        z <strong>{pagination.totalQuestions}</strong> otázok
                      </span>
                    </>
                  ) : (
                    <span className="questions-list-page__results-text">
                      Žiadne otázky nenájdené
                    </span>
                  )}
                </div>

                {/* Sort dropdown for mobile */}
                <div className="questions-list-page__mobile-sort">
                  <select
                    value={currentFilters.sortBy || "createdAt"}
                    onChange={(e) => {
                      const params = new URLSearchParams(
                        window.location.search
                      );
                      params.set("sortBy", e.target.value);
                      params.delete("page");
                      window.location.search = params.toString();
                    }}
                    className="questions-list-page__sort-select"
                  >
                    <option value="createdAt">Najnovšie</option>
                    <option value="popular">Najpopulárnejšie</option>
                    <option value="answers">Najviac odpovedí</option>
                  </select>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="questions-list-page__questions">
              <QuestionsList questions={questions} isLoading={false} />
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="questions-list-page__pagination">
                <QuestionsPagination
                  pagination={pagination}
                  currentFilters={currentFilters}
                />
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Modal */}
        {isFilterModalOpen && (
          <div
            className="questions-filters-backdrop"
            onClick={handleBackdropClick}
          >
            <QuestionsFilters
              filterOptions={filterOptions}
              currentFilters={currentFilters}
              isModal={true}
              onClose={closeFilterModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}
