// Файл: src/features/QuestionDetailPage/QuestionHeader/QuestionHeader.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { basePath } from "@/src/constants/config";
import "./QuestionHeader.scss";

export default function QuestionHeader({
  question,
  stats,
  user,
  permissions,
  onLike,
}) {
  const [isLiking, setIsLiking] = useState(false);

  // Обработчик лайка с защитой от спама
  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `pred ${diffHours} ${diffHours === 1 ? "hodinou" : "hodinami"}`;
    }
    if (diffDays < 7) {
      return `pred ${diffDays} ${diffDays === 1 ? "dňom" : "dňami"}`;
    }

    return date.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Получение инициалов пользователя
  const getUserInitials = (author) => {
    if (!author) return "?";
    if (author.firstName) return author.firstName[0].toUpperCase();
    if (author.username) return author.username[0].toUpperCase();
    return "U";
  };

  // Определение цвета статуса
  const getStatusInfo = (status) => {
    switch (status) {
      case "answered":
        return { text: "Zodpovedané", type: "success" };
      case "closed":
        return { text: "Uzavreté", type: "secondary" };
      case "pending":
        return { text: "Nezodpovedané", type: "primary" };
      default:
        return { text: "Aktívne", type: "primary" };
    }
  };

  // Определение приоритета
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high":
        return { text: "Vysoká", type: "high" };
      case "urgent":
        return { text: "Urgentná", type: "urgent" };
      case "low":
        return { text: "Nízka", type: "low" };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo(question.status);
  const priorityInfo = getPriorityInfo(question.priority);

  return (
    <header className="question-header">
      <div className="question-header__content">
        {/* Title and Badges Row */}
        <div className="question-header__title-row">
          <h1 className="question-header__title">{question.title}</h1>

          {/* Badges */}
          <div className="question-header__badges">
            {question.category && (
              <span
                className={`question-header__category question-header__category--${question.category}`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {question.category}
              </span>
            )}

            {priorityInfo && (
              <span
                className={`question-header__priority question-header__priority--${priorityInfo.type}`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
                {priorityInfo.text}
              </span>
            )}

            <span
              className={`question-header__status question-header__status--${statusInfo.type}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {statusInfo.type === "success" ? (
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                ) : statusInfo.type === "secondary" ? (
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                ) : (
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                )}
              </svg>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Meta Information Row */}
        <div className="question-header__meta">
          {/* Author Info */}
          <div className="question-header__author">
            <div className="question-header__avatar">
              {getUserInitials(question.author)}
            </div>
            <div className="question-header__author-info">
              <div className="question-header__author-name">
                {question.author?.firstName ||
                  question.author?.username ||
                  "Anonym"}
                {question.author?.role === "expert" && (
                  <span className="question-header__expert-badge">Expert</span>
                )}
              </div>
              <div className="question-header__author-meta">
                <span>položené {formatDate(question.createdAt)}</span>
                {question.updatedAt &&
                  question.updatedAt !== question.createdAt && (
                    <span className="question-header__updated">
                      • upravené {formatDate(question.updatedAt)}
                    </span>
                  )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="question-header__quick-stats">
            <div className="question-header__stat">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              <span>{stats.views}</span>
            </div>

            <div className="question-header__stat">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
              </svg>
              <span>{question.answersCount || 0}</span>
            </div>

            <button
              className={`question-header__like-btn ${
                stats.isLiked ? "question-header__like-btn--active" : ""
              }`}
              onClick={handleLike}
              disabled={!user || isLiking}
              title={
                user
                  ? stats.isLiked
                    ? "Odstrániť páčenie"
                    : "Páči sa mi"
                  : "Prihláste sa pre páčenie"
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{stats.likes}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="question-header__actions">
            {permissions.canEdit && (
              <Link
                href={`${basePath}/questions/${
                  question.slug || question._id
                }/edit`}
                className="question-header__action question-header__action--edit"
                title="Upraviť otázku"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Upraviť
              </Link>
            )}

            <button
              className="question-header__action question-header__action--share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: question.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  // Здесь можно показать toast уведомление
                }
              }}
              title="Zdieľať otázku"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
              Zdieľať
            </button>

            {user && (
              <button
                className="question-header__action question-header__action--report"
                onClick={() => {
                  // Здесь будет модал для жалобы
                  console.log("Report question");
                }}
                title="Nahlásiť problém"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
