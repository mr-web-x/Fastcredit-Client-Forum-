// Файл: src/features/QuestionDetailPage/AuthorInfo/AuthorInfo.jsx

"use client";

import Link from "next/link";
import "./AuthorInfo.scss";

export default function AuthorInfo({ author, createdAt }) {
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

  // Получение бейджа роли
  const getRoleBadge = (role) => {
    const roleConfig = {
      expert: { label: "Expert", className: "author-info__role-badge--expert" },
      lawyer: {
        label: "Právnik",
        className: "author-info__role-badge--lawyer",
      },
      admin: {
        label: "Administrátor",
        className: "author-info__role-badge--admin",
      },
      moderator: {
        label: "Moderátor",
        className: "author-info__role-badge--moderator",
      },
      user: { label: "", className: "" },
    };

    return roleConfig[role] || roleConfig.user;
  };

  const roleBadge = getRoleBadge(author?.role);

  return (
    <div className="author-info">
      {/* Аватар */}
      <div className="author-info__avatar">
        {author?.avatar ? (
          <img
            src={author.avatar}
            alt={getDisplayName(author)}
            className="author-info__avatar-image"
          />
        ) : (
          <div className="author-info__avatar-initials">
            {getUserInitials(author)}
          </div>
        )}
      </div>

      {/* Информация об авторе */}
      <div className="author-info__details">
        <div className="author-info__name-section">
          {author?.username ? (
            <Link
              href={`/profile/${author.username}`}
              className="author-info__name"
            >
              {getDisplayName(author)}
            </Link>
          ) : (
            <span className="author-info__name">{getDisplayName(author)}</span>
          )}

          {roleBadge.label && (
            <span className={`author-info__role-badge ${roleBadge.className}`}>
              {roleBadge.label}
            </span>
          )}
        </div>

        {/* Метаинформация */}
        <div className="author-info__meta">
          <span
            className="author-info__date"
            title={new Date(createdAt).toLocaleString("sk-SK")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
            </svg>
            {formatDate(createdAt)}
          </span>

          {author?.reputation && (
            <span className="author-info__reputation">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {author.reputation}
            </span>
          )}

          {author?.questionsCount && (
            <span className="author-info__stats">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
              </svg>
              {author.questionsCount} otázok
            </span>
          )}
        </div>
      </div>

      {/* Статус онлайн (если нужно) */}
      {author?.isOnline && (
        <div className="author-info__status" title="Používateľ je online">
          <div className="author-info__status-indicator" />
        </div>
      )}
    </div>
  );
}
