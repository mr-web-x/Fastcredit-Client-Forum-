"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteQuestionAction } from "@/app/actions/questions";
import QuestionCard from "@/src/components/QuestionCard/QuestionCard";
import Pagination from "@/src/components/Pagination/Pagination";
import "./MyQuestionsPage.scss";

export default function MyQuestionsPage({
  user,
  initialQuestions = [],
  initialPagination = null,
  initialFilters = {},
  error: initialError = null,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Обработка удаления вопроса
  const handleDelete = async (question) => {
    if (!confirm(`Naozaj chcete vymazať otázku "${question.title}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteQuestionAction(question._id || question.id);

        if (result?.success) {
          console.log("✅ Otázka zmazaná");
          // revalidation в Server Action обновит данные автоматически
        } else {
          alert(result?.error || "Nepodarilo sa vymazať otázku");
        }
      } catch (deleteError) {
        console.error("Failed to delete question:", deleteError);
        alert("Nepodarilo sa vymazať otázku. Skúste to znovu.");
      }
    });
  };

  // Server-side навигация для фильтров
  const handleStatusFilter = (status) => {
    const params = new URLSearchParams();

    // Сохраняем остальные фильтры кроме page и status
    Object.entries(initialFilters).forEach(([key, val]) => {
      if (val && key !== "page" && key !== "status") {
        params.set(key, val.toString());
      }
    });

    // Добавляем новый статус
    if (status) {
      params.set("status", status);
    }

    const newURL = `/forum/profile/my-questions${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL);
  };

  const handleEdit = (question) => {
    router.push(`/forum/questions/${question.slug}/edit`);
  };

  const handleShare = (question) => {
    const url = `${window.location.origin}/forum/questions/${question.slug}`;

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

  // Получение статистики из текущих вопросов
  const getStatusCounts = () => {
    return initialQuestions.reduce(
      (acc, question) => {
        const status = question.status || "pending";
        acc[status] = (acc[status] || 0) + 1;
        acc.total++;
        return acc;
      },
      { total: 0, pending: 0, answered: 0, closed: 0 }
    );
  };

  const handleViewQuestion = (question) => {
    router.push(`/forum/questions/${question.slug || question._id}`);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="my-questions-page">
      {/* Header с заголовком и кнопкой создания */}
      <div className="my-questions-page__header">
        <div className="my-questions-page__title-section">
          <h1 className="my-questions-page__title">Moje otázky</h1>
          <Link href="/forum/ask" className="my-questions-page__create-btn">
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
              !initialFilters.status ? "my-questions-page__filter--active" : ""
            }`}
          >
            Všetky
          </button>
          <button
            onClick={() => handleStatusFilter("pending")}
            className={`my-questions-page__filter ${
              initialFilters.status === "pending"
                ? "my-questions-page__filter--active"
                : ""
            }`}
          >
            Čakajú na odpoveď
          </button>
          <button
            onClick={() => handleStatusFilter("answered")}
            className={`my-questions-page__filter ${
              initialFilters.status === "answered"
                ? "my-questions-page__filter--active"
                : ""
            }`}
          >
            Zodpovedané
          </button>
          <button
            onClick={() => handleStatusFilter("closed")}
            className={`my-questions-page__filter ${
              initialFilters.status === "closed"
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
        {initialError && (
          <div className="my-questions-page__error">
            <p className="my-questions-page__error-text">{initialError}</p>
            <button
              onClick={() => window.location.reload()}
              className="my-questions-page__error-retry"
            >
              Skúsiť znovu
            </button>
          </div>
        )}

        {/* Loading State */}
        {isPending && (
          <div className="my-questions-page__loading">
            <div className="my-questions-page__loading-spinner"></div>
            <p className="my-questions-page__loading-text">Načítava sa...</p>
          </div>
        )}

        {/* Empty State */}
        {!isPending && !initialError && initialQuestions.length === 0 && (
          <div className="my-questions-page__empty">
            <h3 className="my-questions-page__empty-title">
              {initialFilters.status
                ? "Žiadne otázky s týmto stavom"
                : "Zatiaľ ste nezadali žiadne otázky"}
            </h3>
            <p className="my-questions-page__empty-text">
              {initialFilters.status
                ? "Skúste zmeniť filter alebo zadajte novú otázku"
                : "Začnite sa pýtať a získajte odpovede od našich expertov"}
            </p>
            <Link href="/forum/ask" className="my-questions-page__empty-btn">
              Zadať prvú otázku
            </Link>
          </div>
        )}

        {/* Questions List */}
        {!isPending && !initialError && initialQuestions.length > 0 && (
          <div className="my-questions-page__list">
            {initialQuestions.map((question) => (
              <QuestionCard
                key={question._id || question.id}
                question={question}
                user={user}
                actionsType="owner"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
                onClick={() => handleViewQuestion(question)}
              />
            ))}
          </div>
        )}

        {/* Пагинация */}
        {initialPagination && initialPagination.total > 1 && (
          <div className="my-questions-page__pagination">
            <Pagination
              pagination={initialPagination}
              currentFilters={initialFilters}
              basePath="/forum/profile/my-questions"
            />
          </div>
        )}
      </div>
    </div>
  );
}
