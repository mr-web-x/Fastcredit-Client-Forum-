"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteQuestionAction } from "@/app/actions/questions";
import QuestionCard from "@/src/components/QuestionCard/QuestionCard";
import Pagination from "@/src/components/Pagination/Pagination";
import "./AllQuestionsPage.scss";

export default function AllQuestionsPage({
  user,
  initialQuestions = [],
  initialPagination = null,
  initialFilters = {},
  error: initialError = null,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Обработка удаления вопроса
  const handleDeleteQuestion = async (questionId) => {
    const confirmDelete = confirm(
      "Naozaj chcete zmazať túto otázku? Táto akcia sa nedá vrátiť späť."
    );

    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteQuestionAction(questionId);

        if (result?.success) {
          console.log("✅ Otázka zmazaná");
          // revalidation в Server Action обновит данные автоматически
        } else {
          alert(result?.error || "Chyba pri mazaní");
        }
      } catch (error) {
        console.error("Failed to delete question:", error);
        alert("Chyba pri mazaní otázky. Skúste to znovu.");
      }
    });
  };

  // Server-side навигация для фильтров
  const handleAnswerFilterToggle = (filterType, value) => {
    const params = new URLSearchParams();

    // Берем текущие фильтры
    Object.entries(initialFilters).forEach(([key, val]) => {
      if (val && key !== "page" && key !== filterType) {
        params.set(key, val.toString());
      }
    });

    // Добавляем новый фильтр (toggle логика)
    const newValue = initialFilters[filterType] === value ? null : value;
    if (newValue !== null) {
      params.set(filterType, newValue.toString());
    }

    const newURL = `/forum/profile/all-questions${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    const params = new URLSearchParams();

    // Сохраняем все фильтры кроме сортировки
    Object.entries(initialFilters).forEach(([key, val]) => {
      if (val && key !== "page" && key !== "sortBy" && key !== "sortOrder") {
        params.set(key, val.toString());
      }
    });

    // Добавляем новую сортировку
    if (newSortBy !== "createdAt") params.set("sortBy", newSortBy);
    if (newSortOrder !== "desc") params.set("sortOrder", newSortOrder);

    const newURL = `/forum/profile/all-questions${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL);
  };

  const handleViewQuestion = (question) => {
    router.push(`/forum/questions/${question.slug || question._id}`);
  };

  const getSortOptions = () => [
    {
      value: "createdAt-desc",
      label: "Najnovšie → Najstaršie",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    {
      value: "createdAt-asc",
      label: "Najstaršie → Najnovšie",
      sortBy: "createdAt",
      sortOrder: "asc",
    },
    {
      value: "lastActivity-desc",
      label: "Posledná aktivita",
      sortBy: "lastActivity",
      sortOrder: "desc",
    },
    {
      value: "lastAnswered-desc",
      label: "Posledná odpoveď",
      sortBy: "lastAnswered",
      sortOrder: "desc",
    },
    {
      value: "answersCount-desc",
      label: "Najviac odpovedí",
      sortBy: "answersCount",
      sortOrder: "desc",
    },
    {
      value: "viewsCount-desc",
      label: "Najviac zobrazení",
      sortBy: "viewsCount",
      sortOrder: "desc",
    },
  ];

  const currentSortValue = `${initialFilters.sortBy || "createdAt"}-${
    initialFilters.sortOrder || "desc"
  }`;

  return (
    <div className="all-questions-page">
      {/* Header */}
      <div className="all-questions-page__header">
        <div className="all-questions-page__title-section">
          <h1 className="all-questions-page__title">Všetky otázky</h1>
          <p className="all-questions-page__subtitle">
            Otázok celkom - {initialPagination?.totalItems || 0}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="all-questions-page__controls">
        <div className="all-questions-page__filters">
          <div className="all-questions-page__answer-filters">
            <button
              onClick={() =>
                handleAnswerFilterToggle("hasApprovedAnswers", true)
              }
              className={`all-questions-page__filter-btn ${
                initialFilters.hasApprovedAnswers === true ? "active" : ""
              }`}
            >
              S odpoveďami
            </button>
            <button
              onClick={() =>
                handleAnswerFilterToggle("hasApprovedAnswers", false)
              }
              className={`all-questions-page__filter-btn ${
                initialFilters.hasApprovedAnswers === false ? "active" : ""
              }`}
            >
              Bez odpovedí
            </button>
            <button
              onClick={() =>
                handleAnswerFilterToggle("hasPendingAnswers", true)
              }
              className={`all-questions-page__filter-btn ${
                initialFilters.hasPendingAnswers === true ? "active" : ""
              }`}
            >
              Na moderácii
            </button>
          </div>

          <select
            value={currentSortValue}
            onChange={(e) => {
              const option = getSortOptions().find(
                (opt) => opt.value === e.target.value
              );
              if (option) {
                handleSortChange(option.sortBy, option.sortOrder);
              }
            }}
            className="all-questions-page__sort-select"
          >
            {getSortOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="all-questions-page__content">
        {initialError ? (
          <div className="all-questions-page__error">
            <div className="all-questions-page__error-icon">⚠️</div>
            <p className="all-questions-page__error-text">{initialError}</p>
            <button
              onClick={() => window.location.reload()}
              className="all-questions-page__retry-btn"
            >
              Skúsiť znovu
            </button>
          </div>
        ) : isPending ? (
          <div className="all-questions-page__loading">
            <div className="all-questions-page__loading-spinner"></div>
            <p>Načítavam otázky...</p>
          </div>
        ) : initialQuestions.length === 0 ? (
          <div className="all-questions-page__empty">
            <div className="all-questions-page__empty-icon">📭</div>
            <h3 className="all-questions-page__empty-title">
              Žiadne otázky nenájdené
            </h3>
            <p className="all-questions-page__empty-text">
              Skúste zmeniť filtre alebo vyčkajte na nové otázky.
            </p>
          </div>
        ) : (
          <div className="all-questions-page__questions">
            {initialQuestions.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                user={user}
                onClick={() => handleViewQuestion(question)}
                onDelete={handleDeleteQuestion}
                showAdminMetrics={true}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="all-questions-page__pagination">
          {initialPagination && initialPagination.total > 1 && (
            <Pagination
              pagination={initialPagination}
              currentFilters={initialFilters}
              basePath="/forum/profile/all-questions"
            />
          )}
        </div>
      </div>
    </div>
  );
}
