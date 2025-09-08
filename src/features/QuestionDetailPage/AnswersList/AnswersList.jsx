// Файл: src/features/QuestionDetailPage/AnswersList/AnswersList.jsx

"use client";

import { useState } from "react";
import { basePath } from "@/src/constants/config";
import "./AnswersList.scss";

export default function AnswersList({
  answers = [],
  question,
  user,
  permissions,
  onAcceptAnswer,
}) {
  const [optimisticAnswers, setOptimisticAnswers] = useState(answers);
  const [loadingStates, setLoadingStates] = useState({});

  // Сортируем ответы: лучший ответ вверху, потом по дате
  const sortedAnswers = [...optimisticAnswers].sort((a, b) => {
    if (a.isBest && !b.isBest) return -1;
    if (!a.isBest && b.isBest) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Обработчик лайка ответа
  const handleLikeAnswer = async (answerId) => {
    if (!user || loadingStates[`like-${answerId}`]) return;

    setLoadingStates((prev) => ({ ...prev, [`like-${answerId}`]: true }));

    // Оптимистичное обновление
    setOptimisticAnswers((prev) =>
      prev.map((answer) => {
        if (answer._id === answerId) {
          return {
            ...answer,
            likes: answer.isLiked ? answer.likes - 1 : answer.likes + 1,
            isLiked: !answer.isLiked,
          };
        }
        return answer;
      })
    );

    try {
      // Здесь будет API вызов
      // await answersService.likeAnswer(answerId);
    } catch (error) {
      // Откат при ошибке
      setOptimisticAnswers((prev) =>
        prev.map((answer) => {
          if (answer._id === answerId) {
            return {
              ...answer,
              likes: answer.isLiked ? answer.likes + 1 : answer.likes - 1,
              isLiked: !answer.isLiked,
            };
          }
          return answer;
        })
      );
      console.error("Failed to like answer:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`like-${answerId}`]: false }));
    }
  };

  // Обработчик принятия ответа как лучшего
  const handleAcceptAnswer = async (answerId) => {
    if (!permissions.canAcceptAnswer || loadingStates[`accept-${answerId}`])
      return;

    setLoadingStates((prev) => ({ ...prev, [`accept-${answerId}`]: true }));

    // Оптимистичное обновление
    setOptimisticAnswers((prev) =>
      prev.map((answer) => ({
        ...answer,
        isBest: answer._id === answerId,
      }))
    );

    try {
      await onAcceptAnswer(answerId);
    } catch (error) {
      // Откат при ошибке
      setOptimisticAnswers((prev) =>
        prev.map((answer) => ({
          ...answer,
          isBest: answer._id === answerId ? false : answer.isBest,
        }))
      );
      console.error("Failed to accept answer:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`accept-${answerId}`]: false }));
    }
  };

  // Empty state
  if (sortedAnswers.length === 0) {
    return (
      <div className="answers-list answers-list--empty">
        <div className="answers-list__empty-content">
          <div className="answers-list__empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
            </svg>
          </div>
          <h3>Zatiaľ žiadne odpovede</h3>
          <p>
            Buďte prvý, kto poskytne odpoveď na túto otázku.
            {!permissions.canAnswer && " Len experti môžu odpovedať na otázky."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="answers-list">
      {sortedAnswers.map((answer, index) => (
        <AnswerItem
          key={answer._id}
          answer={answer}
          question={question}
          user={user}
          permissions={permissions}
          onLike={() => handleLikeAnswer(answer._id)}
          onAccept={() => handleAcceptAnswer(answer._id)}
          isLiking={loadingStates[`like-${answer._id}`]}
          isAccepting={loadingStates[`accept-${answer._id}`]}
          index={index}
        />
      ))}
    </div>
  );
}

// Отдельный компонент для одного ответа
function AnswerItem({
  answer,
  question,
  user,
  permissions,
  onLike,
  onAccept,
  isLiking = false,
  isAccepting = false,
  index = 0,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

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

  // Получение инициалов
  const getUserInitials = (author) => {
    if (!author) return "?";
    if (author.firstName) return author.firstName[0].toUpperCase();
    if (author.username) return author.username[0].toUpperCase();
    return "E";
  };

  // Получение полного имени
  const getAuthorName = (author) => {
    if (!author) return "Anonymný expert";
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    if (author.firstName) return author.firstName;
    if (author.username) return author.username;
    return "Expert";
  };

  // Проверка прав на редактирование
  const canEdit =
    user &&
    (user._id === answer.author?._id ||
      user.role === "admin" ||
      user.role === "moderator");

  // Проверка можно ли принять ответ
  const canAccept = permissions.canAcceptAnswer && !answer.isBest;
  const alreadyHasBestAnswer = question.hasBestAnswer || false;

  return (
    <article
      className={`answer-item ${answer.isBest ? "answer-item--best" : ""} ${
        isExpanded ? "answer-item--expanded" : ""
      }`}
    >
      {/* Best Answer Badge */}
      {answer.isBest && (
        <div className="answer-item__best-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span>Najlepšia odpoveď</span>
        </div>
      )}

      {/* Answer Header */}
      <header className="answer-item__header">
        <div className="answer-item__author">
          <div className="answer-item__avatar">
            {answer.author?.avatar ? (
              <img
                src={answer.author.avatar}
                alt={getAuthorName(answer.author)}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="answer-item__avatar-fallback"
              style={answer.author?.avatar ? { display: "none" } : {}}
            >
              {getUserInitials(answer.author)}
            </div>
          </div>

          <div className="answer-item__author-info">
            <h4 className="answer-item__author-name">
              {getAuthorName(answer.author)}
            </h4>
            <div className="answer-item__author-meta">
              {answer.author?.role === "expert" && (
                <span className="answer-item__expert-badge">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Expert
                </span>
              )}
              {answer.author?.specialization && (
                <span className="answer-item__specialization">
                  {answer.author.specialization}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="answer-item__meta">
          <time className="answer-item__date" dateTime={answer.createdAt}>
            {formatDate(answer.createdAt)}
          </time>

          {answer.status && answer.status !== "approved" && (
            <span
              className={`answer-item__status answer-item__status--${answer.status}`}
            >
              {answer.status === "pending"
                ? "Čaká na schválenie"
                : answer.status === "rejected"
                ? "Zamietnuté"
                : answer.status}
            </span>
          )}
        </div>
      </header>

      {/* Answer Content */}
      <div className="answer-item__content">
        <div
          className="answer-item__text"
          dangerouslySetInnerHTML={{ __html: answer.content }}
        />
      </div>

      {/* Answer Footer */}
      <footer className="answer-item__footer">
        <div className="answer-item__actions">
          {/* Like Button */}
          <button
            onClick={onLike}
            disabled={!user || isLiking}
            className={`answer-item__action answer-item__like ${
              answer.isLiked ? "answer-item__like--active" : ""
            } ${isLiking ? "answer-item__like--loading" : ""}`}
            title={
              user
                ? answer.isLiked
                  ? "Zrušiť páči sa mi"
                  : "Páči sa mi"
                : "Prihláste sa pre lajkovanie"
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{answer.likes}</span>
          </button>

          {/* Accept Answer Button */}
          {canAccept && !alreadyHasBestAnswer && (
            <button
              onClick={onAccept}
              disabled={isAccepting}
              className={`answer-item__action answer-item__accept ${
                isAccepting ? "answer-item__accept--loading" : ""
              }`}
              title="Označiť ako najlepšiu odpoveď"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>Označiť ako najlepšiu</span>
            </button>
          )}

          {/* Edit Button */}
          {canEdit && (
            <button
              className="answer-item__action answer-item__edit"
              title="Upraviť odpoveď"
              onClick={() => {
                // Здесь будет логика редактирования
                console.log("Edit answer", answer._id);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              <span>Upraviť</span>
            </button>
          )}

          {/* Report Button */}
          {user && user._id !== answer.author?._id && (
            <button
              className="answer-item__action answer-item__report"
              title="Nahlásiť odpoveď"
              onClick={() => {
                // Здесь будет логика жалобы
                console.log("Report answer", answer._id);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
              </svg>
              <span>Nahlásiť</span>
            </button>
          )}
        </div>

        {/* Answer Stats */}
        {answer.author?.stats && (
          <div className="answer-item__author-stats">
            <span className="answer-item__stat">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
              </svg>
              {answer.author.stats.totalAnswers || 0} odpovedí
            </span>

            <span className="answer-item__stat">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {answer.author.stats.bestAnswers || 0} najlepších
            </span>

            <span className="answer-item__stat">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {answer.author.stats.totalLikes || 0} páči sa
            </span>
          </div>
        )}
      </footer>
    </article>
  );
}
