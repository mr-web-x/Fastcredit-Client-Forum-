// Файл: src/features/QuestionDetailPage/QuestionStats/QuestionStats.jsx

"use client";

import { useState, useEffect } from "react";
import "./QuestionStats.scss";

export default function QuestionStats({ question, stats, answers = [], user }) {
  const [isVisible, setIsVisible] = useState(false);

  // Анимация появления при загрузке
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Форматирование чисел
  const formatNumber = (num) => {
    if (!num || num === 0) return "0";
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  // Форматирование даты создания
  const formatCreatedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Вычисление времени с момента создания
  const getTimeSinceCreated = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "včera";
    if (diffDays < 7) return `pred ${diffDays} dňami`;
    if (diffDays < 30) return `pred ${Math.ceil(diffDays / 7)} týždňami`;
    if (diffDays < 365) return `pred ${Math.ceil(diffDays / 30)} mesiacmi`;
    return `pred ${Math.ceil(diffDays / 365)} rokmi`;
  };

  // Подсчет экспертских ответов
  const expertAnswers = answers.filter(
    (answer) => answer.author?.role === "expert" && answer.status === "approved"
  );

  const hasAcceptedAnswer = answers.some((answer) => answer.isBest);

  return (
    <div
      className={`question-stats ${isVisible ? "question-stats--visible" : ""}`}
    >
      <div className="question-stats__header">
        <h3 className="question-stats__title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </svg>
          Statistiky
        </h3>
      </div>

      <div className="question-stats__content">
        {/* Primary Stats */}
        <div className="question-stats__primary">
          {/* Likes */}
          <div className="question-stats__item question-stats__item--likes">
            <div className="question-stats__icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="question-stats__value">
              <span className="question-stats__number">
                {formatNumber(stats.likes)}
              </span>
              <span className="question-stats__label">
                {stats.likes === 1 ? "páči sa" : "páči sa"}
              </span>
            </div>
          </div>

          {/* Views */}
          <div className="question-stats__item question-stats__item--views">
            <div className="question-stats__icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </div>
            <div className="question-stats__value">
              <span className="question-stats__number">
                {formatNumber(stats.views)}
              </span>
              <span className="question-stats__label">zobrazení</span>
            </div>
          </div>

          {/* Answers */}
          <div className="question-stats__item question-stats__item--answers">
            <div className="question-stats__icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
              </svg>
            </div>
            <div className="question-stats__value">
              <span className="question-stats__number">{answers.length}</span>
              <span className="question-stats__label">
                {answers.length === 1
                  ? "odpoveď"
                  : answers.length < 5
                  ? "odpovede"
                  : "odpovedí"}
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="question-stats__secondary">
          {/* Expert Answers */}
          {expertAnswers.length > 0 && (
            <div className="question-stats__item question-stats__item--expert">
              <div className="question-stats__icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="question-stats__text">
                {expertAnswers.length} expertných{" "}
                {expertAnswers.length === 1 ? "odpovede" : "odpovedí"}
              </span>
            </div>
          )}

          {/* Accepted Answer */}
          {hasAcceptedAnswer && (
            <div className="question-stats__item question-stats__item--accepted">
              <div className="question-stats__icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span className="question-stats__text">
                Má akceptovanú odpoveď
              </span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="question-stats__metadata">
          <div className="question-stats__meta-item">
            <span className="question-stats__meta-label">Vytvorené:</span>
            <span className="question-stats__meta-value">
              {formatCreatedDate(question.createdAt)}
            </span>
            <span className="question-stats__meta-relative">
              ({getTimeSinceCreated(question.createdAt)})
            </span>
          </div>

          {question.updatedAt && question.updatedAt !== question.createdAt && (
            <div className="question-stats__meta-item">
              <span className="question-stats__meta-label">Upravené:</span>
              <span className="question-stats__meta-value">
                {formatCreatedDate(question.updatedAt)}
              </span>
            </div>
          )}

          {question.category && (
            <div className="question-stats__meta-item">
              <span className="question-stats__meta-label">Kategória:</span>
              <span className="question-stats__meta-value question-stats__meta-category">
                {question.category}
              </span>
            </div>
          )}

          {question.priority && question.priority !== "normal" && (
            <div className="question-stats__meta-item">
              <span className="question-stats__meta-label">Priorita:</span>
              <span
                className={`question-stats__meta-priority question-stats__meta-priority--${question.priority}`}
              >
                {question.priority === "high"
                  ? "Vysoká"
                  : question.priority === "urgent"
                  ? "Urgentná"
                  : question.priority === "low"
                  ? "Nízka"
                  : question.priority}
              </span>
            </div>
          )}
        </div>

        {/* Activity Indicator */}
        <div className="question-stats__activity">
          <div className="question-stats__activity-indicator">
            <div className="question-stats__activity-dot"></div>
            <span className="question-stats__activity-text">
              {answers.length === 0
                ? "Čaká na odpoveď"
                : expertAnswers.length === 0
                ? "Čaká na experta"
                : hasAcceptedAnswer
                ? "Vyriešené"
                : "Aktívne"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
