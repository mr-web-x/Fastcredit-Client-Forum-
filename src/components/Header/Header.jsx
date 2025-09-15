// Файл: src/components/Header/Header.jsx

"use client";
import "./Header.scss";
import { useState } from "react";
import { basePath } from "@/src/constants/config";
import { logoutAction } from "@/app/actions/auth";

// Material UI imports
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import {
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

export default function Header({ user = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);

  // Сохраняем ориентацию меню в состоянии
  const [menuPosition, setMenuPosition] = useState({
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "left" },
  });

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);

    const rect = event.currentTarget.getBoundingClientRect();
    const middle = window.innerWidth / 2;

    // Если иконка справа от середины экрана → меню открываем влево
    if (rect.left > middle) {
      setMenuPosition({
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "top", horizontal: "right" },
      });
    } else {
      // Иначе вправо
      setMenuPosition({
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        transformOrigin: { vertical: "top", horizontal: "left" },
      });
    }
  };

  const handleLogout = async () => {
    try {
      // Закрываем меню перед logout
      handleCloseProfileMenu();

      // Используем Server Action для logout
      await logoutAction();
      // logoutAction уже делает redirect и очищает cookie
    } catch (error) {
      console.error("[Header] Logout error:", error);
      // В случае ошибки пытаемся сделать fallback через Route Handler
      try {
        const response = await fetch(`${basePath}api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          window.location.href = `${basePath}`;
        }
      } catch (fallbackError) {
        console.error("[Header] Fallback logout failed:", fallbackError);
        // Последний fallback - просто редирект
        window.location.href = `${basePath}login`;
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
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

  // Получаем полное имя пользователя
  const getUserFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.username) {
      return user.username;
    }
    return "User";
  };

  return (
    <header>
      <div className="container">
        <div className="header__wrapper">
          {/* Лого */}
          <a className="logo" href="/" onClick={closeMenu}>
            <img alt="FastCredit Forum logo" src={`${basePath}logo.svg`} />
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
                <a itemProp="url" href={`${basePath}`} onClick={closeMenu}>
                  Fórum
                </a>
              </li>
              <li>
                <a
                  itemProp="url"
                  href={`${basePath}experts`}
                  onClick={closeMenu}
                >
                  Experti
                </a>
              </li>
            </ul>
          </nav>

          {/* Блок авторизации/профиля */}
          <div className={`header__profile ${user ? "loggined" : ""}`}>
            {user ? (
              <div className="header__user">
                {/* Material UI Avatar с dropdown menu */}
                <Box>
                  <IconButton
                    onClick={handleProfileMenuClick}
                    size="small"
                    sx={{
                      ml: 2,
                      "&:hover": {
                        backgroundColor: "rgba(4, 156, 161, 0.08)",
                      },
                    }}
                    aria-controls={profileMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={profileMenuOpen ? "true" : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: "#049ca1",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={profileMenuOpen}
                    onClose={handleCloseProfileMenu}
                    onClick={handleCloseProfileMenu}
                    anchorOrigin={menuPosition.anchorOrigin}
                    transformOrigin={menuPosition.transformOrigin}
                  >
                    {/* Информация о пользователе */}
                    <Box
                      sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e0e0e0" }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#333" }}
                      >
                        {getUserFullName()}
                      </Typography>
                      {user?.email && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", fontSize: "13px" }}
                        >
                          {user.email}
                        </Typography>
                      )}
                    </Box>

                    {/* Ссылка на профиль */}
                    <MenuItem
                      onClick={() =>
                        (window.location.href = `${basePath}profile`)
                      }
                      sx={{ py: 1.5 }}
                    >
                      <PersonIcon sx={{ mr: 2, color: "#666" }} />
                      <Typography variant="body2">Môj profil</Typography>
                    </MenuItem>

                    {/* Expert panel для экспертов */}
                    {user.role === "expert" && (
                      <MenuItem
                        onClick={() =>
                          (window.location.href = `${basePath}expert/dashboard`)
                        }
                        sx={{ py: 1.5 }}
                      >
                        <WorkIcon sx={{ mr: 2, color: "#666" }} />
                        <Typography variant="body2">Expert panel</Typography>
                      </MenuItem>
                    )}

                    {/* Admin panel для админов */}
                    {user.role === "admin" && (
                      <MenuItem
                        onClick={() =>
                          (window.location.href = `${basePath}admin`)
                        }
                        sx={{ py: 1.5 }}
                      >
                        <AdminIcon sx={{ mr: 2, color: "#666" }} />
                        <Typography variant="body2">Admin panel</Typography>
                      </MenuItem>
                    )}

                    {/* Выход */}
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        color: "#d32f2f",
                        "&:hover": {
                          backgroundColor: "rgba(211, 47, 47, 0.08)",
                        },
                      }}
                    >
                      <ExitToAppIcon sx={{ mr: 2, color: "#d32f2f" }} />
                      <Typography variant="body2" sx={{ color: "#d32f2f" }}>
                        Odhlásiť sa
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
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
                  href={`${basePath}login`}
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
                    href={`${basePath}register`}
                  >
                    Registrovať sa
                  </Button>
                </div>
              </div>
            )}
          </div>

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
