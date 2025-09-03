// Файл: src/components/Header/Header.jsx

"use client";
import "./Header.scss";
import { useState } from "react";
import { basePath } from "@/src/constants/config";
import { logoutAction } from "@/app/actions/auth";

export default function Header({ user = null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Используем Server Action для logout
      await logoutAction();
      // logoutAction уже делает redirect и очищает cookie
    } catch (error) {
      console.error("[Header] Logout error:", error);
      // В случае ошибки пытаемся сделать fallback через Route Handler
      try {
        const response = await fetch(`${basePath}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          window.location.href = `${basePath}/`;
        }
      } catch (fallbackError) {
        console.error("[Header] Fallback logout failed:", fallbackError);
        // Последний fallback - просто редирект
        window.location.href = `${basePath}/login`;
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header>
      <div className="container">
        <div className="header__wrapper">
          {/* Лого */}
          <a className="logo" href="/" onClick={closeMenu}>
            <img alt="FastCredit Forum logo" src={`${basePath}/logo.svg`} />
          </a>

          {/* Навигация */}
          <nav
            className={`header__menu ${menuOpen ? "active" : ""}`}
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <ul className="header__menu-list">
              <li>
                <a itemProp="url" href="/#home" onClick={closeMenu}>
                  Hlavná
                </a>
              </li>
              <li>
                <a itemProp="url" href="/caste-otazky.html" onClick={closeMenu}>
                  Časté otázky
                </a>
              </li>
              <li>
                <a itemProp="url" href="/blog.html" onClick={closeMenu}>
                  Blog
                </a>
              </li>
              {/* Форумные ссылки */}
              <li>
                <a itemProp="url" href={`${basePath}/`} onClick={closeMenu}>
                  Fórum
                </a>
              </li>
              <li>
                <a
                  itemProp="url"
                  href={`${basePath}/experts`}
                  onClick={closeMenu}
                >
                  Experti
                </a>
              </li>
            </ul>
          </nav>

          {/* Блок профиля */}
          <div className="header__profile">
            {user ? (
              <div className="header__user">
                {/* Показываем роль если это эксперт или админ */}
                {(user.role === "expert" || user.role === "admin") && (
                  <span className={`header__role header__role--${user.role}`}>
                    {user.role === "expert" ? "👨‍💼" : "⚙️"}
                  </span>
                )}

                {/* Ссылка на профиль */}
                <a
                  className="header__user-name"
                  href={`${basePath}/profile`}
                  title={`${user.firstName || user.username} - ${user.role}`}
                  onClick={closeMenu}
                >
                  {user.firstName || user.username || "Profil"}
                </a>

                {/* Кнопка "Задать вопрос" для авторизованных */}
                <a
                  className="header__ask-btn btn btn--secondary"
                  href={`${basePath}/ask`}
                  onClick={closeMenu}
                >
                  Spýtať sa
                </a>

                {/* Dropdown меню для больших возможностей */}
                <div className="header__user-dropdown">
                  <button
                    className="header__user-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="User menu"
                  >
                    <span className="header__user-avatar">
                      {user.firstName
                        ? user.firstName[0].toUpperCase()
                        : user.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </button>

                  <div
                    className={`header__dropdown-menu ${
                      menuOpen ? "active" : ""
                    }`}
                  >
                    <a
                      href={`${basePath}/profile`}
                      className="header__dropdown-item"
                      onClick={closeMenu}
                    >
                      👤 Môj profil
                    </a>

                    {user.role === "expert" && (
                      <a
                        href={`${basePath}/expert/dashboard`}
                        className="header__dropdown-item"
                        onClick={closeMenu}
                      >
                        👨‍💼 Expert panel
                      </a>
                    )}

                    {user.role === "admin" && (
                      <a
                        href={`${basePath}/admin`}
                        className="header__dropdown-item"
                        onClick={closeMenu}
                      >
                        ⚙️ Admin panel
                      </a>
                    )}

                    <hr className="header__dropdown-divider" />

                    <button
                      className="header__dropdown-item header__logout-btn"
                      onClick={handleLogout}
                    >
                      🚪 Odhlásiť sa
                    </button>
                  </div>
                </div>

                {/* Простая кнопка logout для мобильных */}
                <button
                  className="header__logout header__logout--mobile"
                  onClick={handleLogout}
                  title="Odhlásiť sa"
                >
                  Odhlásiť
                </button>
              </div>
            ) : (
              <div className="header__guest">
                <a
                  className="header__login btn btn--secondary"
                  href={`${basePath}/login`}
                  onClick={closeMenu}
                >
                  Prihlásiť sa
                </a>

                <a
                  className="header__register btn btn--main"
                  href={`${basePath}/register`}
                  onClick={closeMenu}
                >
                  Registrovať sa
                </a>
              </div>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="header__mobile-nav">
            <div
              className={`burger ${menuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              role="button"
              tabIndex={0}
              aria-label="Toggle navigation menu"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleMenu();
                }
              }}
            >
              <figure></figure>
              <figure></figure>
              <figure></figure>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay для закрытия меню при клике вне его */}
      {menuOpen && (
        <div
          className="header__overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
