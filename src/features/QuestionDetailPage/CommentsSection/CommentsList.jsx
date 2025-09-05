// Файл: src/features/QuestionDetailPage/CommentsSection/CommentsList.jsx

"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";

export default function CommentsList({
  comments,
  replyComments,
  user,
  canComment,
  replyingTo,
  onReply,
  onCommentSubmit,
  getRepliesForComment,
}) {
  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          replies={getRepliesForComment(comment._id)}
          user={user}
          canComment={canComment}
          replyingTo={replyingTo}
          onReply={onReply}
          onCommentSubmit={onCommentSubmit}
        />
      ))}
    </div>
  );
}

// Отдельный компонент для комментария
function CommentItem({
  comment,
  replies = [],
  user,
  canComment,
  replyingTo,
  onReply,
  onCommentSubmit,
}) {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);

  // Обработчик лайка комментария
  const handleLike = async () => {
    if (!user) return;

    // Оптимистичное обновление
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      // Здесь будет API вызов
      // await commentsService.likeComment(comment._id);
    } catch (error) {
      // Откат при ошибке
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      console.error("Failed to like comment:", error);
    }
  };

  // Проверяем можно ли редактировать/удалять
  const canEdit =
    user &&
    (user._id === comment.author?._id ||
      user.role === "admin" ||
      user.role === "moderator");

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `pred ${diffMinutes} minútami`;
    if (diffHours < 24) return `pred ${diffHours} hodinami`;
    if (diffDays < 7) return `pred ${diffDays} dňami`;

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

  return (
    <div className="comment-item">
      {/* Comment Header */}
      <div className="comment-item__header">
        <div className="comment-item__author">
          <div className="comment-item__avatar">
            {getUserInitials(comment.author)}
          </div>
          <div className="comment-item__author-info">
            <span className="comment-item__author-name">
              {comment.author?.firstName ||
                comment.author?.username ||
                "Anonym"}
              {comment.author?.role === "expert" && (
                <span className="comment-item__expert-badge">Expert</span>
              )}
            </span>
            <span className="comment-item__date">
              {formatDate(comment.createdAt)}
            </span>
          </div>
        </div>

        {/* Comment Actions */}
        <div className="comment-item__actions">
          {canEdit && (
            <button className="comment-item__action comment-item__action--edit">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Comment Content */}
      <div className="comment-item__content">
        <p>{comment.content}</p>
      </div>

      {/* Comment Footer */}
      <div className="comment-item__footer">
        <div className="comment-item__interactions">
          {/* Like Button */}
          {user && (
            <button
              className={`comment-item__like ${
                isLiked ? "comment-item__like--active" : ""
              }`}
              onClick={handleLike}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{likesCount}</span>
            </button>
          )}

          {/* Reply Button */}
          {canComment && (
            <button
              className="comment-item__reply"
              onClick={() =>
                onReply(replyingTo === comment._id ? null : comment._id)
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
              </svg>
              Odpovedať
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment._id && canComment && (
        <div className="comment-item__reply-form">
          <CommentForm
            user={user}
            placeholder={`Odpoveď pre ${
              comment.author?.firstName || comment.author?.username
            }...`}
            onSubmit={(content) => onCommentSubmit(content, comment._id)}
            onCancel={() => onReply(null)}
            submitText="Odpovedať"
            showCancel={true}
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="comment-item__replies">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              replies={[]} // Не поддерживаем вложенные ответы на ответы
              user={user}
              canComment={false} // Нельзя отвечать на ответы
              replyingTo={null}
              onReply={() => {}}
              onCommentSubmit={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
