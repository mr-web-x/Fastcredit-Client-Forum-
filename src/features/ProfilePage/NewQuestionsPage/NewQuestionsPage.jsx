// Файл: src/features/ProfilePage/NewQuestionsPage/NewQuestionsPage.jsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getNewQuestionsAction } from "@/app/actions/questions";
import QuestionCard from "@/src/components/QuestionCard/QuestionCard";
import "./NewQuestionsPage.scss";

export default function NewQuestionsPage({
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
    priority: initialFilters.priority || "",
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 10,
  });

  // Обновление URL при изменении фильтров
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.page > 1) params.set("page", newFilters.page.toString());
    if (newFilters.priority) params.set("priority", newFilters.priority);
    if (newFilters.limit !== 10)
      params.set("limit", newFilters.limit.toString());

    const newURL = `/profile/all-questions${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL, { scroll: false });
  };

  // Загрузка вопросов через Server Action
  const loadQuestions = async (newFilters = filters) => {
    startTransition(async () => {
      try {
        setError(null);

        const result = await getNewQuestionsAction(newFilters);

        if (result.success) {
          setQuestions(result.data.items);
          setPagination(result.data.pagination);
        } else {
          setError(result.error);
          setQuestions([]);
          setPagination(null);
        }
      } catch (loadError) {
        console.error("Failed to load new questions:", loadError);
        setError("Nepodarilo sa načítať nové otázky. Skúste to znovu.");
      }
    });
  };

  // Обработка изменения фильтров
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
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
    router.push(`/questions/${question.slug || question._id}`);
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

  return (
    <div className="all-questions-page">
      {/* Заголовок */}
      <div className="all-questions-page__header">
        <div className="all-questions-page__title-section">
          <h1 className="all-questions-page__title">
            <span className="all-questions-page__title-icon">🔔</span>
            Nové otázky
          </h1>
          <p className="all-questions-page__subtitle">
            {getRoleText()} - Zobrazte a odpovedajte na nové otázky
          </p>
        </div>
      </div>

      {/* Фильтры и статистика */}
      <div className="all-questions-page__controls">
        {/* Статистика */}
        <div className="all-questions-page__stats">
          <div className="all-questions-page__stat">
            <span className="all-questions-page__stat-value">
              {pagination?.totalItems || 0}
            </span>
            <span className="all-questions-page__stat-label">
              Nových otázok
            </span>
          </div>
        </div>

        {/* Фильтры */}
        <div className="all-questions-page__filters">
          {/* Фильтр по приоритету */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="all-questions-page__filter-select"
            disabled={isPending}
          >
            <option value="">Všetky priority</option>
            <option value="high">Vysoká priorita</option>
            <option value="urgent">Urgentná priorita</option>
          </select>
        </div>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="all-questions-page__error">
          <span className="all-questions-page__error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Loading состояние */}
      {isPending && (
        <div className="all-questions-page__loading">
          <span className="all-questions-page__loading-spinner"></span>
          Načítava sa...
        </div>
      )}

      {/* Список вопросов */}
      <div className="all-questions-page__questions">
        {questions.length > 0
          ? questions.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                user={user}
                actionsType="viewer"
                onView={handleViewQuestion}
                disabled={isPending}
              />
            ))
          : !isPending && (
              <div className="all-questions-page__empty">
                <div className="all-questions-page__empty-icon">❓</div>
                <h3 className="all-questions-page__empty-title">
                  {user.role === "expert" && "Žiadne nové otázky pre expertov"}
                  {user.role === "lawyer" && "Žiadne nové otázky pre právnikov"}
                  {(user.role === "admin" || user.role === "moderator") &&
                    "Žiadne nové otázky"}
                </h3>
                <p className="all-questions-page__empty-text">
                  Momentálne nie sú dostupné žiadne nové otázky. Skontrolujte
                  neskôr.
                </p>
              </div>
            )}
      </div>

      {/* Пагинация */}
      {pagination && pagination.totalPages > 1 && (
        <div className="all-questions-page__pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev || isPending}
            className="all-questions-page__pagination-button"
          >
            ← Predchádzajúca
          </button>

          <div className="all-questions-page__pagination-info">
            Strana {pagination.page} z {pagination.totalPages}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext || isPending}
            className="all-questions-page__pagination-button"
          >
            Nasledujúca →
          </button>
        </div>
      )}
    </div>
  );
}
