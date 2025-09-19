// Файл: src/components/Header/Header.jsx

"use client";
import "./Header.scss";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Material UI imports
import { Button } from "@mui/material";

export default function Header({ user = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isProfilePage =
    pathname === "/forum/profile" || pathname.startsWith("/forum/profile/");

  const toggleMenu = () => {
    if (!menuOpen) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove("active-modal");
  };

  // Получаем инициалы пользователя
  const getUserInitials = () => {
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header>
      <div className="container">
        <div className="header__wrapper">
          {/* Лого */}
          <a className="logo" href="/" onClick={closeMenu}>
            <img alt="Fastcredit" src={`/forum/logo.svg`} />
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
                <a itemProp="url" href="/#about" onClick={closeMenu}>
                  O nás
                </a>
              </li>
              <li>
                <a itemProp="url" href="/caste-otazky.html" onClick={closeMenu}>
                  Časté otázky
                </a>
              </li>
              <li>
                <a itemProp="url" href="/#policy" onClick={closeMenu}>
                  Podmienky používania
                </a>
              </li>
              <li>
                <a itemProp="url" href="/blog.html" onClick={closeMenu}>
                  Blog
                </a>
              </li>
              {/* Форумные ссылки */}
              <li>
                <Link itemProp="url" href={"/forum"} onClick={closeMenu}>
                  Fórum
                </Link>
              </li>
            </ul>
          </nav>

          {/* Блок авторизации/профиля */}
          {!isProfilePage ? (
            <div className={`header__profile ${user ? "loggined" : ""}`}>
              {user ? (
                <div className="header__user">
                  <Link href="/forum/profile" className="header__profile-link">
                    <span className="header__user-name">
                      {`${user.firstName || ""} ${
                        user.lastName || ""
                      }`.trim() || user.username}
                    </span>
                    <div className="header__user-avatar">
                      {getUserInitials()}
                    </div>
                  </Link>
                </div>
              ) : (
                /* Компактные кнопки для неавторизованных пользователей */
                <div className="header__guest">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#049ca1",
                      color: "#049ca1",
                      fontWeight: 500,
                      fontSize: "13px",
                      textTransform: "none",
                      minWidth: "70px",
                      height: "32px",
                      "&:hover": {
                        borderColor: "#037d81",
                        backgroundColor: "rgba(4, 156, 161, 0.04)",
                      },
                    }}
                    href={`/forum/login`}
                  >
                    Prihlásiť sa
                  </Button>

                  <div className="header__registracia">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#049ca1",
                        color: "white",
                        fontWeight: 500,
                        fontSize: "13px",
                        textTransform: "none",
                        minWidth: "90px",
                        height: "32px",
                        marginLeft: "8px",
                        "&:hover": {
                          backgroundColor: "#037d81",
                        },
                      }}
                      href={`/forum/register`}
                    >
                      Registrovať sa
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a href="https://fastcredit.sk/#list" className="btn header-btn">
              Získať pôžičku
            </a>
          )}

          {/* Мобильное меню (остается как было) */}
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
    </header>
  );
}
