// Файл: src/features/QuestionDetailPage/AnswersSection/AnswersSection.jsx

"use client";

import { useState } from "react";
import AnswerForm from "./AnswerForm/AnswerForm";
import AnswersList from "./AnswersList/AnswersList";
import "./AnswersSection.scss";

export default function AnswersSection({
  answers = [],
  question,
  user,
  permissions,
  onAnswerSubmit,
  onAnswerLike,
  onAcceptAnswer,
}) {
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);
  const [sortBy, setSortBy] = useState("best"); // best, newest, oldest, popular

  // Сортировка ответов
  const getSortedAnswers = () => {
    const sortedAnswers = [...answers];

    switch (sortBy) {
      case "best":
        return sortedAnswers.sort((a, b) => {
          // Лучший ответ всегда первый
          if (a.isBest && !b.isBest) return -1;
          if (!a.isBest && b.isBest) return 1;
          // Затем по дате (новые сверху)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

      case "newest":
        return sortedAnswers.sort((a, b) => {
          if (a.isBest && !b.isBest) return -1;
          if (!a.isBest && b.isBest) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

      case "oldest":
        return sortedAnswers.sort((a, b) => {
          if (a.isBest && !b.isBest) return -1;
          if (!a.isBest && b.isBest) return 1;
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

      case "popular":
        return sortedAnswers.sort((a, b) => {
          if (a.isBest && !b.isBest) return -1;
          if (!a.isBest && b.isBest) return 1;
          return (b.likes || 0) - (a.likes || 0);
        });

      default:
        return sortedAnswers;
    }
  };

  // Обработчик отправки ответа
  const handleAnswerSubmit = async (answerData) => {
    try {
      await onAnswerSubmit(answerData);
      setIsAnswerFormOpen(false);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      // Форма покажет свою ошибку
    }
  };

  const sortedAnswers = getSortedAnswers();
  const hasAnswers = answers.length > 0;
  const canAnswer = permissions.canAnswer;

  return (
    <div className="answers-section">
      {/* Заголовок секции */}
      <div className="answers-section__header">
        <div className="answers-section__title-area">
          <h2 className="answers-section__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
            </svg>
            Odpovede {hasAnswers && `(${answers.length})`}
          </h2>

          {hasAnswers > 1 && (
            <div className="answers-section__sort">
              <label htmlFor="answers-sort">Zoradiť podľa:</label>
              <select
                id="answers-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="answers-section__sort-select"
              >
                <option value="best">Najlepšie</option>
                <option value="newest">Najnovšie</option>
                <option value="oldest">Najstaršie</option>
                <option value="popular">Najpopulárnejšie</option>
              </select>
            </div>
          )}
        </div>

        {/* Кнопка добавления ответа */}
        {canAnswer && !isAnswerFormOpen && (
          <button
            onClick={() => setIsAnswerFormOpen(true)}
            className="answers-section__add-btn"
            title="Pridať odpoveď"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Odpovedať
          </button>
        )}
      </div>

      {/* Форма ответа */}
      {canAnswer && isAnswerFormOpen && (
        <div className="answers-section__form">
          <AnswerForm
            question={question}
            user={user}
            onSubmit={handleAnswerSubmit}
            onCancel={() => setIsAnswerFormOpen(false)}
          />
        </div>
      )}

      {/* Информация о правах на ответы */}
      {!canAnswer && (
        <div className="answers-section__permission-info">
          <div className="answers-section__permission-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div>
              <h4>Iba experti môžu odpovedať</h4>
              <p>
                Na otázky môžu odpovedať iba overení experti a právnici. Ak ste
                expert v tejto oblasti, môžete sa prihlásiť ako poradca.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Список ответов */}
      {hasAnswers ? (
        <div className="answers-section__list">
          <AnswersList
            answers={sortedAnswers}
            question={question}
            user={user}
            permissions={permissions}
            onAnswerLike={onAnswerLike}
            onAcceptAnswer={onAcceptAnswer}
          />
        </div>
      ) : (
        <div className="answers-section__empty">
          <div className="answers-section__empty-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
            </svg>
            <h3>Zatiaľ žiadne odpovede</h3>
            <p>
              {canAnswer
                ? "Buďte prvý, kto odpovie na túto otázku!"
                : "Čaká sa na odpovede od expertov."}
            </p>

            {canAnswer && !isAnswerFormOpen && (
              <button
                onClick={() => setIsAnswerFormOpen(true)}
                className="answers-section__empty-cta"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Pridať prvú odpoveď
              </button>
            )}
          </div>
        </div>
      )}

      {/* Статистика ответов */}
      {hasAnswers && (
        <div className="answers-section__stats">
          <div className="answers-section__stats-item">
            <span className="answers-section__stats-value">
              {answers.length}
            </span>
            <span className="answers-section__stats-label">
              {answers.length === 1 ? "odpoveď" : "odpovedí"}
            </span>
          </div>

          {answers.some((a) => a.isBest) && (
            <div className="answers-section__stats-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="answers-section__stats-label">
                Má najlepšiu odpoveď
              </span>
            </div>
          )}

          {answers.filter((a) => a.author?.role === "expert").length > 0 && (
            <div className="answers-section__stats-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="answers-section__stats-label">
                {answers.filter((a) => a.author?.role === "expert").length} od
                expertov
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
