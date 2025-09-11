// Файл: src/features/QuestionDetailPage/AuthorInfo/AuthorInfo.jsx

"use client";

import "./AuthorInfo.scss";
import { formatDate } from "@/src/utils/formatDate";
import {
  getUserInitials,
  getDisplayName,
  getRoleBadge,
} from "@/src/utils/user";

export default function AuthorInfo({ author, createdAt }) {
  const roleBadge = getRoleBadge(author?.role);
  const displayName = getDisplayName(author);
  const userInitials = getUserInitials(author);

  console.log(author);

  return (
    <div className="author-info">
      {/* Аватар */}
      <div className="author-info__avatar">
        {author?.avatar ? (
          <img
            src={author.avatar}
            alt={displayName}
            className="author-info__avatar-image"
          />
        ) : (
          <div className="author-info__avatar-initials">{userInitials}</div>
        )}
      </div>

      {/* Информация об авторе */}
      <div className="author-info__details">
        <div className="author-info__name-section">
          <span className="author-info__name">{displayName}</span>

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
        </div>
      </div>
    </div>
  );
}
