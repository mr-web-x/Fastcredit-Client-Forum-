// Файл: src/features/ProfilePage/AllQuestionsPage/AllQuestionsPage.jsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  getAllQuestionsAction,
  deleteQuestionAction,
} from "@/app/actions/questions";
import QuestionCard from "@/src/components/QuestionCard/QuestionCard";
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

  // State для данных
  const [questions, setQuestions] = useState(initialQuestions);
  const [pagination, setPagination] = useState(initialPagination);
  const [error, setError] = useState(initialError);

  // State для фильтров
  const [filters, setFilters] = useState({
    hasApprovedAnswers: initialFilters.hasApprovedAnswers || null,
    hasPendingAnswers: initialFilters.hasPendingAnswers || null,
    sortBy: initialFilters.sortBy || "createdAt",
    sortOrder: initialFilters.sortOrder || "desc",
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 10,
  });

  // Обновление URL при изменении фильтров
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.page > 1) params.set("page", newFilters.page.toString());

    if (newFilters.hasApprovedAnswers !== null) {
      params.set(
        "hasApprovedAnswers",
        newFilters.hasApprovedAnswers.toString()
      );
    }
    if (newFilters.hasPendingAnswers !== null) {
      params.set("hasPendingAnswers", newFilters.hasPendingAnswers.toString());
    }

    if (newFilters.sortBy !== "createdAt")
      params.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder !== "desc")
      params.set("sortOrder", newFilters.sortOrder);
    if (newFilters.limit !== 10)
      params.set("limit", newFilters.limit.toString());

    const newURL = `/forum/profile/all-questions${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL, { scroll: false });
  };

  // Загрузка вопросов через Server Action
  const loadQuestions = async (newFilters = filters) => {
    startTransition(async () => {
      try {
        setError(null);

        const result = await getAllQuestionsAction(newFilters);

        if (result.success) {
          setQuestions(result.data.items);
          setPagination(result.data.pagination);
        } else {
          setError(result.error);
          setQuestions([]);
          setPagination(null);
        }
      } catch (loadError) {
        console.error("Failed to load questions:", loadError);
        setError("Nepodarilo sa načítať otázky. Skúste to znovu.");
      }
    });
  };

  // Обработка удаления вопроса
  const handleDeleteQuestion = async (questionId) => {
    const confirmDelete = confirm(
      "Naozaj chcete zmazať túto otázku? Táto akcia sa nedá vrátiť späť."
    );

    if (!confirmDelete) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteQuestionAction(questionId);

        if (result.success) {
          // Удаляем вопрос из локального state
          setQuestions((prev) => prev.filter((q) => q._id !== questionId));

          // Показываем сообщение об успехе (можно добавить toast)
          console.log("✅", result.message);

          // Обновляем pagination если нужно
          if (pagination) {
            setPagination((prev) => ({
              ...prev,
              totalItems: prev.totalItems - 1,
            }));
          }
        } else {
          // Показываем ошибку
          alert(result.error || "Nepodarilo sa zmazať otázku");
        }
      } catch (error) {
        console.error("Failed to delete question:", error);
        alert("Chyba pri mazaní otázky. Skúste to znovu.");
      }
    });
  };

  // Обработка изменения фильтров по ответам
  const handleAnswerFilterToggle = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: filters[filterType] === value ? null : value,
      page: 1, // Сбрасываем на первую страницу
    };
    setFilters(newFilters);
    updateURL(newFilters);
    loadQuestions(newFilters);
  };

  // Обработка изменения сортировки
  const handleSortChange = (newSortBy, newSortOrder) => {
    const newFilters = {
      ...filters,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1,
    };
    setFilters(newFilters);
    updateURL(newFilters);
    loadQuestions(newFilters);
  };

  // Обработка смены страницы
  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateURL(newFilters);
    loadQuestions(newFilters);
  };

  // Обработка просмотра вопроса
  const handleViewQuestion = (question) => {
    router.push(`/forum/questions/${question.slug || question._id}`);
  };

  // Получение текста роли для заголовка
  const getRoleText = () => {
    switch (user.role) {
      case "expert":
        return "Pre expertov";
      case "lawyer":
        return "Pre právnikov";
      case "admin":
      case "moderator":
        return "Všetky otázky";
      default:
        return "";
    }
  };

  // Получение опций сортировки
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

  const currentSortValue = `${filters.sortBy}-${filters.sortOrder}`;

  return (
    <div className="all-questions-page">
      {/* Заголовок */}
      <div className="all-questions-page__header">
        <div className="all-questions-page__title-section">
          <h1 className="all-questions-page__title">Všetky otázky</h1>
          <p className="all-questions-page__subtitle">
            Otázok celkom - {pagination?.totalItems || 0}
          </p>
        </div>
      </div>

      {/* Фильтры и статистика */}
      <div className="all-questions-page__controls">
        {/* Статистика */}

        {/* Фильтры и сортировка */}
        <div className="all-questions-page__filters">
          {/* Фильтры по ответам */}
          <div className="all-questions-page__answer-filters">
            <button
              onClick={() =>
                handleAnswerFilterToggle("hasApprovedAnswers", true)
              }
              className={`all-questions-page__filter-btn ${
                filters.hasApprovedAnswers === true ? "active" : ""
              }`}
            >
              S odpoveďami
            </button>
            <button
              onClick={() =>
                handleAnswerFilterToggle("hasApprovedAnswers", false)
              }
              className={`all-questions-page__filter-btn ${
                filters.hasApprovedAnswers === false ? "active" : ""
              }`}
            >
              Bez odpovedí
            </button>
            <button
              onClick={() =>
                handleAnswerFilterToggle("hasPendingAnswers", true)
              }
              className={`all-questions-page__filter-btn ${
                filters.hasPendingAnswers === true ? "active" : ""
              }`}
            >
              Na moderácii
            </button>
          </div>

          {/* Сортировка */}
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

      {/* Список вопросов */}
      <div className="all-questions-page__content">
        {error ? (
          <div className="all-questions-page__error">
            <div className="all-questions-page__error-icon">⚠️</div>
            <p className="all-questions-page__error-text">{error}</p>
            <button
              onClick={() => loadQuestions()}
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
        ) : questions.length === 0 ? (
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
            {questions.map((question) => (
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

        {/* Пагинация */}
        {pagination && pagination.totalPages > 1 && (
          <div className="all-questions-page__pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="all-questions-page__pagination-btn"
            >
              ← Predchádzajúca
            </button>

            <span className="all-questions-page__pagination-info">
              Stránka {pagination.page} z {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="all-questions-page__pagination-btn"
            >
              Nasledujúca →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
