"use client";

import { useState } from "react";

export default function CommentForm({
  user,
  placeholder = "Napíšte komentár...",
  onSubmit,
  onCancel,
  submitText = "Pridať komentár",
  showCancel = false,
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit(content.trim());
      setContent(""); // Очищаем форму после успешной отправки
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  // Получение инициалов пользователя
  const getUserInitials = (user) => {
    if (!user) return "?";
    if (user.firstName) return user.firstName[0].toUpperCase();
    if (user.username) return user.username[0].toUpperCase();
    return "U";
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form__header">
        <div className="comment-form__avatar">{getUserInitials(user)}</div>
        <div className="comment-form__user">
          <span className="comment-form__username">
            {user?.firstName || user?.username || "Anonym"}
            {user?.role === "expert" && (
              <span className="comment-form__expert-badge">Expert</span>
            )}
          </span>
        </div>
      </div>

      <div className="comment-form__content">
        <textarea
          className="comment-form__textarea"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={isSubmitting}
          required
        />

        <div className="comment-form__footer">
          <div className="comment-form__help">
            <span>Buďte slušní a konštruktívni vo svojich komentároch.</span>
          </div>

          <div className="comment-form__actions">
            {showCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="comment-form__cancel"
                disabled={isSubmitting}
              >
                Zrušiť
              </button>
            )}

            <button
              type="submit"
              className="comment-form__submit"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="comment-form__loading"
                  >
                    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6z" />
                  </svg>
                  Odosielanie...
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  {submitText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
