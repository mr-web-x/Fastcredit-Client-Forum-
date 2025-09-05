// Файл: src/features/QuestionsListPage/QuestionsListPage.jsx

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
      // Блокируем скролл body когда открыт modal
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFilterModalOpen]);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  // Закрытие modal по клику на backdrop
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
            FastCredit
          </Link>
          <span className="questions-list-page__breadcrumb-separator">›</span>
          <Link
            href={`${basePath}/`}
            className="questions-list-page__breadcrumb-link"
          >
            Fórum
          </Link>
          <span className="questions-list-page__breadcrumb-separator">›</span>
          <span className="questions-list-page__breadcrumb-current">
            Otázky
          </span>
        </nav>

        {/* Page Header */}
        <div className="questions-list-page__header">
          <div className="questions-list-page__header-content">
            <h1 className="questions-list-page__title">Všetky otázky</h1>
            <p className="questions-list-page__subtitle">
              Prehliadajte otázky od našej komunity a nájdite odpovede od
              expertov
            </p>
          </div>

          <div className="questions-list-page__header-actions">
            <Link
              href={`${basePath}/ask`}
              className="btn questions-list-page__ask-btn"
            >
              ➕ Zadať otázku
            </Link>

            {/* Mobile filter toggle - показывается только на мобильных */}
            <button
              className="questions-list-page__filter-toggle"
              onClick={openFilterModal}
              aria-label="Otvoriť filtre"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 6h18v2H3V6zm2 5h14v2H5v-2zm4 5h6v2H9v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="questions-list-page__error">
            <div className="questions-list-page__error-content">
              <span className="questions-list-page__error-icon">⚠️</span>
              <div>
                <strong>Chyba pri načítaní</strong>
                <p>{error}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="questions-list-page__error-retry"
            >
              Skúsiť znovu
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="questions-list-page__content">
          {/* Sidebar - Desktop Filters */}
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
                <span className="questions-list-page__results-count">
                  {pagination.totalQuestions > 0 ? (
                    <>
                      Zobrazujeme {(pagination.currentPage - 1) * 20 + 1}-
                      {Math.min(
                        pagination.currentPage * 20,
                        pagination.totalQuestions
                      )}{" "}
                      z {pagination.totalQuestions} otázok
                    </>
                  ) : (
                    "Žiadne otázky nenájdené"
                  )}
                </span>
              </div>
            )}

            {/* Questions List */}
            <QuestionsList questions={questions} isLoading={false} />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <QuestionsPagination
                pagination={pagination}
                currentFilters={currentFilters}
              />
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
