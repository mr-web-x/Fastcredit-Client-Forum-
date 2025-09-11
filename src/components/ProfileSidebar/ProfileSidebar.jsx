"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./ProfileSidebar.scss";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpIcon from "@mui/icons-material/Help";
import PeopleIcon from "@mui/icons-material/People";
import QuizIcon from "@mui/icons-material/Quiz";

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
                    ⚙️ Admin
                  </span>
                )}
                {user.role === "moderator" && (
                  <span className="profile-sidebar__badge profile-sidebar__badge--moderator">
                    🛡️ Moder
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
        {(user.role === "admin" || user.role === "moderator") && (
          <Link
            href="/profile/users"
            className={`profile-sidebar__nav-link  ${
              isActiveLink("/profile/users")
                ? "profile-sidebar__nav-link--active"
                : ""
            }`}
          >
            <span className="profile-sidebar__nav-icon">
              <PeopleIcon />
            </span>
            <span className="profile-sidebar__nav-label">Používateľov</span>
          </Link>
        )}
        {(user.role === "admin" ||
          user.role === "expert" ||
          user.role === "lawyer") && (
          <Link
            href="/profile/all-questions"
            className={`profile-sidebar__nav-link  ${
              isActiveLink("/profile/all-questions")
                ? "profile-sidebar__nav-link--active"
                : ""
            }`}
          >
            <span className="profile-sidebar__nav-icon">
              <QuizIcon />
            </span>
            <span className="profile-sidebar__nav-label">Všetky otázky</span>
          </Link>
        )}
        {/* Ссылка на мои вопросы */}
        <Link
          href="/profile/my-questions"
          className={`profile-sidebar__nav-link profile-sidebar__nav-link--myquestions ${
            isActiveLink("/profile/my-questions")
              ? "profile-sidebar__nav-link--active"
              : ""
          }`}
        >
          <span className="profile-sidebar__nav-icon">
            <HelpIcon />
          </span>
          <span className="profile-sidebar__nav-label">Moje otázky</span>
        </Link>
        <div className="profile-sidebar__nav-divider"></div>
        <Link
          href="/profile"
          className={`profile-sidebar__nav-link profile-sidebar__nav-link--dashboard ${
            isActiveLink("/profile") ? "profile-sidebar__nav-link--active" : ""
          }`}
        >
          <span className="profile-sidebar__nav-icon">
            <SpaceDashboardIcon />
          </span>
          <span className="profile-sidebar__nav-label">Dashboard</span>
        </Link>
        <Link
          href="/profile/my-data"
          className={`profile-sidebar__nav-link profile-sidebar__nav-link--mydata ${
            isActiveLink("/profile/my-data")
              ? "profile-sidebar__nav-link--active"
              : ""
          }`}
        >
          <span className="profile-sidebar__nav-icon">
            <AccountCircleIcon />
          </span>
          <span className="profile-sidebar__nav-label">Moje údaje</span>
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
