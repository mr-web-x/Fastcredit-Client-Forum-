// Файл: src/features/QuestionDetailPage/AnswersSection/AnswerItem/AnswerItem.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import "./AnswerItem.scss";

export default function AnswerItem({
  answer,
  question,
  user,
  permissions,
  onLike,
  onAcceptAnswer,
  isExpanded,
  shouldTruncate,
  previewContent,
  onToggleExpansion,
  isBest = false,
  isLast = false,
}) {
  const [isLiking, setIsLiking] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Получение инициалов пользователя
  const getUserInitials = (author) => {
    if (!author) return "?";
    if (author.firstName && author.lastName) {
      return `${author.firstName[0]}${author.lastName[0]}`.toUpperCase();
    }
    if (author.firstName) return author.firstName[0].toUpperCase();
    if (author.username) return author.username[0].toUpperCase();
    return "U";
  };

  // Получение отображаемого имени
  const getDisplayName = (author) => {
    if (!author) return "Neznámy používateľ";
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    if (author.firstName) return author.firstName;
    if (author.username) return author.username;
    return "Anonym";
  };

  // Получение конфига роли
  const getRoleConfig = (role) => {
    const configs = {
      expert: { label: "Expert", className: "answer-item__role--expert" },
      lawyer: { label: "Právnik", className: "answer-item__role--lawyer" },
      admin: { label: "Administrátor", className: "answer-item__role--admin" },
      moderator: {
        label: "Moderátor",
        className: "answer-item__role--moderator",
      },
      user: { label: "", className: "" },
    };
    return configs[role] || configs.user;
  };

  // Обработчик лайка
  const handleLike = async () => {
    if (!permissions.canLike || isLiking) return;

    setIsLiking(true);
    try {
      await onLike();
    } catch (error) {
      console.error("Failed to like answer:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Обработчик принятия ответа
  const handleAcceptAnswer = async () => {
    if (!permissions.canAcceptAnswer || isAccepting || isBest) return;

    setIsAccepting(true);
    try {
      await onAcceptAnswer();
    } catch (error) {
      console.error("Failed to accept answer:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const roleConfig = getRoleConfig(answer.author?.role);
  const isExpert =
    answer.author?.role === "expert" || answer.author?.role === "lawyer";

  return (
    <article
      className={`answer-item ${isBest ? "answer-item--best" : ""} ${
        isLast ? "answer-item--last" : ""
      }`}
    >
      {/* Заголовок ответа */}
      <header className="answer-item__header">
        {/* Информация об авторе */}
        <div className="answer-item__author">
          <div className="answer-item__avatar">
            {answer.author?.avatar ? (
              <img
                src={answer.author.avatar}
                alt={getDisplayName(answer.author)}
                className="answer-item__avatar-image"
              />
            ) : (
              <div className="answer-item__avatar-initials">
                {getUserInitials(answer.author)}
              </div>
            )}
          </div>

          <div className="answer-item__author-info">
            <div className="answer-item__author-name-section">
              {answer.author?.username ? (
                <Link
                  href={`/profile/${answer.author.username}`}
                  className="answer-item__author-name"
                >
                  {getDisplayName(answer.author)}
                </Link>
              ) : (
                <span className="answer-item__author-name">
                  {getDisplayName(answer.author)}
                </span>
              )}

              {roleConfig.label && (
                <span className={`answer-item__role ${roleConfig.className}`}>
                  {roleConfig.label}
                </span>
              )}
            </div>

            <div className="answer-item__meta">
              <span
                className="answer-item__date"
                title={new Date(answer.createdAt).toLocaleString("sk-SK")}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                </svg>
                {formatDate(answer.createdAt)}
              </span>

              {answer.author?.reputation && (
                <span className="answer-item__reputation">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {answer.author.reputation}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Бейдж лучшего ответа */}
        {isBest && (
          <div className="answer-item__best-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Najlepšia odpoveď
          </div>
        )}

        {/* Кнопка принятия ответа */}
        {!isBest && permissions.canAcceptAnswer && (
          <button
            onClick={handleAcceptAnswer}
            className="answer-item__accept-btn"
            disabled={isAccepting}
            title="Označiť ako najlepšiu odpoveď"
          >
            {isAccepting ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="31.416"
                  strokeDashoffset="31.416"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    dur="2s"
                    values="0 31.416;15.708 15.708;0 31.416"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    dur="2s"
                    values="0;-15.708;-31.416"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
          </button>
        )}
      </header>

      {/* Контент ответа */}
      <div className="answer-item__content">
        <div className="answer-item__text">
          {previewContent ? (
            previewContent
              .split("\n")
              .map((paragraph, index) =>
                paragraph.trim() ? (
                  <p key={index}>{paragraph}</p>
                ) : (
                  <br key={index} />
                )
              )
          ) : (
            <p className="answer-item__text--empty">
              Obsah odpovede nebol zadaný.
            </p>
          )}
        </div>

        {/* Кнопка развернуть/свернуть */}
        {shouldTruncate && (
          <button
            onClick={onToggleExpansion}
            className="answer-item__expand-btn"
          >
            {isExpanded ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </svg>
                Zobraziť menej
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
                Zobraziť viac
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer с действиями */}
      <footer className="answer-item__footer">
        <div className="answer-item__actions">
          {/* Лайк */}
          <button
            onClick={handleLike}
            disabled={!permissions.canLike || isLiking}
            className={`answer-item__like ${
              answer.isLiked ? "answer-item__like--active" : ""
            } ${isLiking ? "answer-item__like--loading" : ""}`}
            title={
              !user
                ? "Prihláste sa pre lajkovanie"
                : answer.isLiked
                ? "Zrušiť páči sa mi"
                : "Páči sa mi"
            }
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{answer.likes || 0}</span>
          </button>

          {/* Комментарии (если нужно в будущем) */}
          {/* <button className="answer-item__comments">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
            </svg>
            <span>Komentovať</span>
          </button> */}
        </div>

        {/* Статус и информация */}
        <div className="answer-item__status">
          {answer.status === "pending" && (
            <span className="answer-item__status-badge answer-item__status-badge--pending">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
              </svg>
              Čaká na schválenie
            </span>
          )}

          {answer.editedAt && (
            <span
              className="answer-item__edited"
              title={`Upravené ${new Date(answer.editedAt).toLocaleString(
                "sk-SK"
              )}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              Upravené
            </span>
          )}
        </div>
      </footer>
    </article>
  );
}
