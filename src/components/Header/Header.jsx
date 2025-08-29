"use client";
import "./Header.scss";
import { useEffect, useState } from "react";
import { basePath } from "@/src/constants/config";

export default function Header() {
  const [me, setMe] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${basePath}/api/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setMe(d?.data || null))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch(`${basePath}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = `${basePath}/login`;
  };

  return (
    <header>
      <div className="container">
        <div className="header__wrapper">
          {/* Лого */}
          <a className="logo" href="/">
            <img alt="logo" src={`${basePath}/logo.svg`} />
          </a>

          {/* Навигация */}
          <nav
            className={`header__menu ${menuOpen ? "active" : ""}`}
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <ul className="header__menu-list">
              <li>
                <a itemProp="url" href="/#home">
                  Hlavná
                </a>
              </li>
              <li>
                <a itemProp="url" href="/#about">
                  O nás
                </a>
              </li>
              <li>
                <a itemProp="url" href="/caste-otazky.html">
                  Časté otázky
                </a>
              </li>
              <li>
                <a itemProp="url" href="/#policy">
                  Podmienky používania
                </a>
              </li>
              <li>
                <a itemProp="url" href="/blog.html">
                  Blog
                </a>
              </li>
              <li className="row">
                <a className="btn header-btn" itemProp="url" href="/#list">
                  Získať pôžičku
                </a>
              </li>
            </ul>
          </nav>

          {/* Блок профиля */}
          <div className="header__profile">
            {me ? (
              <div className="header__user">
                <a className="header__user-name" href={`${basePath}/account`}>
                  {me.firstName || me.username || "Profil"}
                </a>
                <button className="header__logout btn" onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            ) : (
              <a className="header__login btn" href={`${basePath}/login`}>
                Войти
              </a>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="header__mobile-nav">
            <div
              className={`burger ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <figure></figure>
              <figure></figure>
              <figure></figure>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
