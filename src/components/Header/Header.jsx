"use client";
import "./Header.scss";
import { useState } from "react";
import { basePath } from "@/src/constants/config";
import { authService } from "@/src/services/client";

export default function Header({ user = null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      // authService.logout() уже делает редирект
    } catch (error) {
      // Если ошибка, все равно редиректим
      window.location.href = `${basePath}/login`;
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
              {/* Добавляем ссылки форума */}
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

                <a
                  className="header__user-name"
                  href={`${basePath}/profile`}
                  title={`${user.firstName || user.username} - ${user.role}`}
                >
                  {user.firstName || user.username || "Profil"}
                </a>

                {/* Кнопка "Задать вопрос" для авторизованных */}
                <a
                  className="header__ask-btn btn btn--secondary"
                  href={`${basePath}/ask`}
                >
                  Spýtať sa
                </a>

                <button
                  className="header__logout btn"
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
                >
                  Prihlásiť sa
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
