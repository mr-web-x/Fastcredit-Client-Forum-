// Файл: src/features/QuestionDetailPage/CommentsSection/CommentsSection.jsx

"use client";

import { useState, useEffect } from "react";
import CommentsList from "./CommentsList";
import CommentForm from "./CommentForm";
import CommentPermissionGate from "./CommentPermissionGate";
import "./CommentsSection.scss";

export default function CommentsSection({
  comments = [],
  question,
  answers = [],
  user,
  permissions,
  onCommentSubmit,
}) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Проверяем права на комментирование
  const canComment = checkDetailedCommentPermissions(user, question, answers);
  const shouldShowComments = canComment.show;

  // Группируем комментарии (родительские и ответы)
  const parentComments = comments.filter((comment) => !comment.parentComment);
  const replyComments = comments.filter((comment) => comment.parentComment);

  // Ограничиваем количество показываемых комментариев
  const visibleComments = showAllComments
    ? parentComments
    : parentComments.slice(0, 3);

  const hasMoreComments = parentComments.length > 3;

  // Обработчик отправки комментария
  const handleCommentSubmit = async (content, parentId = null) => {
    if (!canComment.canComment) return;

    const commentData = {
      content,
      parentComment: parentId,
    };

    try {
      await onCommentSubmit(commentData);
      setReplyingTo(null); // Закрываем форму ответа
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  // Получаем ответы на конкретный комментарий
  const getRepliesForComment = (commentId) => {
    return replyComments.filter((reply) => reply.parentComment === commentId);
  };

  return (
    <section className="comments-section">
      <div className="comments-section__header">
        <h3 className="comments-section__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
          Komentáre ({comments.length})
        </h3>
      </div>

      {/* Permission Gate - показывает состояние доступности комментариев */}
      <CommentPermissionGate
        canComment={canComment}
        user={user}
        question={question}
        answers={answers}
      />

      {/* Comments Content - показываем только если доступно */}
      {shouldShowComments && (
        <div className="comments-section__content">
          {/* Comments List */}
          {parentComments.length > 0 ? (
            <div className="comments-section__list">
              <CommentsList
                comments={visibleComments}
                replyComments={replyComments}
                user={user}
                canComment={canComment.canComment}
                replyingTo={replyingTo}
                onReply={setReplyingTo}
                onCommentSubmit={handleCommentSubmit}
                getRepliesForComment={getRepliesForComment}
              />

              {/* Show More Button */}
              {hasMoreComments && !showAllComments && (
                <button
                  className="comments-section__show-more"
                  onClick={() => setShowAllComments(true)}
                >
                  Zobraziť všetkých {parentComments.length - 3} komentárov
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                  </svg>
                </button>
              )}

              {showAllComments && hasMoreComments && (
                <button
                  className="comments-section__show-less"
                  onClick={() => setShowAllComments(false)}
                >
                  Zobraziť menej komentárov
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <div className="comments-section__empty">
              <div className="comments-section__empty-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                </svg>
              </div>
              <p>Zatiaľ žiadne komentáre. Buďte prvý kto komentuje!</p>
            </div>
          )}

          {/* Comment Form */}
          {canComment.canComment && (
            <div className="comments-section__form">
              <CommentForm
                user={user}
                placeholder="Napíšte komentár k tejto otázke..."
                onSubmit={(content) => handleCommentSubmit(content)}
                submitText="Pridať komentár"
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// === UTILITY FUNCTIONS ===

/**
 * Детальная проверка прав на комментирование
 * КЛЮЧЕВАЯ БИЗНЕС-ЛОГИКА
 */
function checkDetailedCommentPermissions(user, question, answers) {
  // Базовая проверка
  if (!user) {
    return {
      canComment: false,
      show: false,
      reason: "not_authenticated",
      message: "Pre komentovanie sa musíte prihlásiť",
    };
  }

  // Эксперты и админы всегда могут комментировать
  if (user.role === "expert" || user.role === "admin") {
    return {
      canComment: true,
      show: true,
      reason: "expert_or_admin",
      message: null,
    };
  }

  // Автор вопроса всегда может комментировать
  if (user._id === question.author?._id || user._id === question.author) {
    return {
      canComment: true,
      show: true,
      reason: "question_author",
      message: null,
    };
  }

  // Проверяем наличие ответов экспертов
  const expertAnswers = answers.filter(
    (answer) => answer.author?.role === "expert" && answer.status === "approved"
  );

  if (expertAnswers.length === 0) {
    // Обычные пользователи НЕ МОГУТ комментировать до ответа эксперта
    return {
      canComment: false,
      show: true, // Показываем секцию с объяснением
      reason: "no_expert_answers",
      message: "Komentáre budú dostupné po odpovedi experta",
      expertAnswersCount: 0,
    };
  }

  // Есть ответы экспертов - обычные пользователи могут комментировать
  return {
    canComment: true,
    show: true,
    reason: "expert_answered",
    message: null,
    expertAnswersCount: expertAnswers.length,
  };
}
