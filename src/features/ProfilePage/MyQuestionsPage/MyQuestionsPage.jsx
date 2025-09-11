// Файл: src/features/ProfilePage/MyQuestionsPage/MyQuestionsPage.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getUserQuestionsAction,
  deleteQuestionAction,
} from "@/app/actions/questions";
// import MyQuestionCard from "./MyQuestionCard/MyQuestionCard";
import QuestionCard from "@/src/components/QuestionCard/QuestionCard";
import { basePath } from "@/src/constants/config";
import "./MyQuestionsPage.scss";

export default function MyQuestionsPage({
  user,
  initialQuestions = [],
  initialPagination = null,
  initialFilters = {},
  error: initialError = null,
}) {
  const router = useRouter();

  // State для данных
  const [questions, setQuestions] = useState(initialQuestions);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // State для фильтров
  const [filters, setFilters] = useState({
    status: initialFilters.status || "",
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 10,
  });

  // Обновление URL при изменении фильтров
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.page > 1) params.set("page", newFilters.page.toString());
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.limit !== 10)
      params.set("limit", newFilters.limit.toString());

    const newURL = `/profile/my-questions${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL, { scroll: false });
  };

  // Вместо questionsService.getUserQuestions используй:
  const loadQuestions = async (newFilters = filters) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getUserQuestionsAction({
        page: newFilters.page,
        limit: newFilters.limit,
        status: newFilters.status,
      });

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
      setQuestions([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчики фильтров
  const handleStatusFilter = (status) => {
    const newFilters = { ...filters, status, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
    loadQuestions(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateURL(newFilters);
    loadQuestions(newFilters);
  };

  // Обработчики действий с вопросами
  const handleEdit = (question) => {
    router.push(`/questions/${question.slug}/edit`);
  };

  const handleDelete = async (question) => {
    if (!confirm(`Naozaj chcete vymazať otázku "${question.title}"?`)) {
      return;
    }

    try {
      const result = await deleteQuestionAction(question._id || question.id);

      if (result.success) {
        // Обновляем список после удаления
        setQuestions((prev) =>
          prev.filter((q) => (q._id || q.id) !== (question._id || question.id))
        );

        console.log("Question deleted successfully");
      }
    } catch (deleteError) {
      console.error("Failed to delete question:", deleteError);
      alert("Nepodarilo sa vymazať otázku. Skúste to znovu.");
    }
  };

  const handleShare = (question) => {
    const url = `${window.location.origin}${basePath}/questions/${question.slug}`;

    if (navigator.share) {
      navigator.share({
        title: question.title,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Odkaz bol skopírovaný do schránky!");
      });
    }
  };

  // Получение статистики
  const getStatusCounts = () => {
    return questions.reduce(
      (acc, question) => {
        const status = question.status || "pending";
        acc[status] = (acc[status] || 0) + 1;
        acc.total++;
        return acc;
      },
      { total: 0, pending: 0, answered: 0, closed: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="my-questions-page">
      {/* Header с заголовком и кнопкой создания */}
      <div className="my-questions-page__header">
        <div className="my-questions-page__title-section">
          <h1 className="my-questions-page__title">
            <span className="my-questions-page__title-icon">❓</span>
            Moje otázky
          </h1>
          <Link href={`/ask`} className="my-questions-page__create-btn">
            <span className="my-questions-page__create-icon">➕</span>
            Nová otázka
          </Link>
        </div>

        <p className="my-questions-page__subtitle">
          Spravujte svoje otázky a sledujte ich stav
        </p>
      </div>

      {/* Статистика и фильтры */}
      <div className="my-questions-page__controls">
        {/* Статистика */}
        <div className="my-questions-page__stats">
          <div className="my-questions-page__stat">
            <span className="my-questions-page__stat-value">
              {statusCounts.total}
            </span>
            <span className="my-questions-page__stat-label">Celkom</span>
          </div>
          <div className="my-questions-page__stat">
            <span className="my-questions-page__stat-value">
              {statusCounts.pending}
            </span>
            <span className="my-questions-page__stat-label">Čakajú</span>
          </div>
          <div className="my-questions-page__stat">
            <span className="my-questions-page__stat-value">
              {statusCounts.answered}
            </span>
            <span className="my-questions-page__stat-label">Zodpovedané</span>
          </div>
          <div className="my-questions-page__stat">
            <span className="my-questions-page__stat-value">
              {statusCounts.closed}
            </span>
            <span className="my-questions-page__stat-label">Uzavreté</span>
          </div>
        </div>

        {/* Фильтры по статусу */}
        <div className="my-questions-page__filters">
          <button
            onClick={() => handleStatusFilter("")}
            className={`my-questions-page__filter ${
              filters.status === "" ? "my-questions-page__filter--active" : ""
            }`}
          >
            Všetky
          </button>
          <button
            onClick={() => handleStatusFilter("pending")}
            className={`my-questions-page__filter ${
              filters.status === "pending"
                ? "my-questions-page__filter--active"
                : ""
            }`}
          >
            Čakajú na odpoveď
          </button>
          <button
            onClick={() => handleStatusFilter("answered")}
            className={`my-questions-page__filter ${
              filters.status === "answered"
                ? "my-questions-page__filter--active"
                : ""
            }`}
          >
            Zodpovedané
          </button>
          <button
            onClick={() => handleStatusFilter("closed")}
            className={`my-questions-page__filter ${
              filters.status === "closed"
                ? "my-questions-page__filter--active"
                : ""
            }`}
          >
            Uzavreté
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="my-questions-page__content">
        {/* Error State */}
        {error && (
          <div className="my-questions-page__error">
            <div className="my-questions-page__error-icon">⚠️</div>
            <p className="my-questions-page__error-text">{error}</p>
            <button
              onClick={() => loadQuestions()}
              className="my-questions-page__error-retry"
            >
              Skúsiť znovu
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="my-questions-page__loading">
            <div className="my-questions-page__loading-spinner"></div>
            <p className="my-questions-page__loading-text">Načítava sa...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && questions.length === 0 && (
          <div className="my-questions-page__empty">
            <div className="my-questions-page__empty-icon">❓</div>
            <h3 className="my-questions-page__empty-title">
              {filters.status
                ? "Žiadne otázky s týmto stavom"
                : "Zatiaľ ste nezadali žiadne otázky"}
            </h3>
            <p className="my-questions-page__empty-text">
              {filters.status
                ? "Skúste zmeniť filter alebo zadajte novú otázku"
                : "Začnite sa pýtať a získajte odpovede od našich expertov"}
            </p>
            <Link href={`/ask`} className="my-questions-page__empty-btn">
              🌟 Zadať prvú otázku
            </Link>
          </div>
        )}

        {/* Questions List */}
        {!isLoading && !error && questions.length > 0 && (
          <div className="my-questions-page__list">
            {questions.map((question) => (
              <QuestionCard
                key={question._id || question.id}
                question={question}
                user={user}
                actionsType="owner"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        {/* Пагинация */}
        {pagination && pagination.totalPages > 1 && (
          <div className="my-questions-page__pagination">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={!pagination.hasPrev || filters.page <= 1}
              className="my-questions-page__pagination-btn my-questions-page__pagination-btn--prev"
            >
              ← Predchádzajúca
            </button>

            <span className="my-questions-page__pagination-info">
              Strana {filters.page} z {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={
                !pagination.hasNext || filters.page >= pagination.totalPages
              }
              className="my-questions-page__pagination-btn my-questions-page__pagination-btn--next"
            >
              Nasledujúca →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
