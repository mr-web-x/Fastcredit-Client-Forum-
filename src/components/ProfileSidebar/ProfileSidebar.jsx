"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./ProfileSidebar.scss";

export default function ProfileSidebar({ user }) {
  const pathname = usePathname();

  // Правильная проверка активной ссылки
  const isActiveLink = (href) => {
    // Для корневых путей проверяем точное совпадение
    if (href === "/profile" || href === "/") {
      return pathname === href;
    }

    // Для остальных путей проверяем начало пути
    return pathname?.startsWith(href);
  };

  return (
    <aside className="profile-sidebar">
      {/* Информация о пользователе */}
      <div className="profile-sidebar__user-info">
        <div className="profile-sidebar__user-top">
          {/* Аватар пользователя */}
          <div className="profile-sidebar__avatar">
            {user.firstName
              ? user.firstName[0].toUpperCase()
              : user.username?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="profile-sidebar__user-details">
            <h2 className="profile-sidebar__user-name">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username || "Používateľ"}
            </h2>

            <div className="profile-sidebar__email">
              <span className="profile-sidebar__email">{user.email}</span>
            </div>

            <div className="profile-sidebar__user-labels">
              {/* Email статус */}
              <div className="profile-sidebar__email-status">
                {!user.isEmailVerified && (
                  <span className="profile-sidebar__verification-badge profile-sidebar__verification-badge--pending">
                    Neoverený
                  </span>
                )}
                {user.isEmailVerified && (
                  <span className="profile-sidebar__verification-badge profile-sidebar__verification-badge--verified">
                    ✓ Overený
                  </span>
                )}
              </div>

              <div className="profile-sidebar__user-role">
                {user.role === "expert" && (
                  <span className="profile-sidebar__badge profile-sidebar__badge--expert">
                    👨‍💼 Expert
                  </span>
                )}
                {user.role === "admin" && (
                  <span className="profile-sidebar__badge profile-sidebar__badge--admin">
                    ⚙️ Administrátor
                  </span>
                )}
                {user.role === "moderator" && (
                  <span className="profile-sidebar__badge profile-sidebar__badge--moderator">
                    🛡️ Moderátor
                  </span>
                )}
                {user.role === "user" && (
                  <span className="profile-sidebar__badge profile-sidebar__badge--user">
                    👤 Používateľ
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Навигационное меню */}
      <nav className="profile-sidebar__nav">
        {/* Разделитель */}
        <div className="profile-sidebar__nav-divider"></div>

        {/* Дополнительные ссылки в зависимости от роли */}
        {user.role === "expert" && (
          <Link
            href="/expert/dashboard"
            className={`profile-sidebar__nav-link profile-sidebar__nav-link--special ${
              isActiveLink("/expert/dashboard")
                ? "profile-sidebar__nav-link--active"
                : ""
            }`}
          >
            <span className="profile-sidebar__nav-icon">📊</span>
            Expert Dashboard
          </Link>
        )}

        {(user.role === "admin" || user.role === "moderator") && (
          <Link
            href="/admin"
            className={`profile-sidebar__nav-link profile-sidebar__nav-link--special ${
              isActiveLink("/admin") ? "profile-sidebar__nav-link--active" : ""
            }`}
          >
            <span className="profile-sidebar__nav-icon">🛡️</span>
            {user.role === "admin" ? "Admin Panel" : "Moderation"}
          </Link>
        )}

        {/* Ссылка на мои вопросы */}
        <Link
          href="/my/questions"
          className={`profile-sidebar__nav-link ${
            isActiveLink("/my/questions")
              ? "profile-sidebar__nav-link--active"
              : ""
          }`}
        >
          <span className="profile-sidebar__nav-icon">❓</span>
          Moje otázky
        </Link>
        <div className="profile-sidebar__nav-divider"></div>

        <Link
          href="/profile"
          className={`profile-sidebar__nav-link ${
            isActiveLink("/profile") ? "profile-sidebar__nav-link--active" : ""
          }`}
        >
          <span className="profile-sidebar__nav-icon">👤</span>
          Môj profil
        </Link>

        <Link
          href="/profile/settings"
          className={`profile-sidebar__nav-link ${
            isActiveLink("/profile/settings")
              ? "profile-sidebar__nav-link--active"
              : ""
          }`}
        >
          <span className="profile-sidebar__nav-icon">⚙️</span>
          Nastavenia účtu
        </Link>

        <Link
          href="/profile/security"
          className={`profile-sidebar__nav-link ${
            isActiveLink("/profile/security")
              ? "profile-sidebar__nav-link--active"
              : ""
          }`}
        >
          <span className="profile-sidebar__nav-icon">🔒</span>
          Bezpečnosť
        </Link>
      </nav>

      {/* Краткая статистика */}
      <div className="profile-sidebar__stats">
        <h3 className="profile-sidebar__stats-title">Štatistiky</h3>
        <div className="profile-sidebar__stat-item">
          <span className="profile-sidebar__stat-label">Registrácia:</span>
          <span className="profile-sidebar__stat-value">
            {new Date(user.createdAt).toLocaleDateString("sk-SK")}
          </span>
        </div>
        {user.lastLoginAt && (
          <div className="profile-sidebar__stat-item">
            <span className="profile-sidebar__stat-label">
              Posledné prihlásenie:
            </span>
            <span className="profile-sidebar__stat-value">
              {new Date(user.lastLoginAt).toLocaleDateString("sk-SK")}
            </span>
          </div>
        )}
        {user.questionsCount !== undefined && (
          <div className="profile-sidebar__stat-item">
            <span className="profile-sidebar__stat-label">Otázky:</span>
            <span className="profile-sidebar__stat-value">
              {user.questionsCount || 0}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
