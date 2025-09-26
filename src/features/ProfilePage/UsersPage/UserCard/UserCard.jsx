// Файл: src/features/ProfilePage/UsersPage/UserCard/UserCard.jsx

"use client";

import { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./UserCard.scss";

export default function UserCard({
  targetUser,
  currentUser,
  onChangeRole,
  onBan,
  onUnban,
  disabled = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Проверка - можно ли редактировать этого пользователя
  const canEdit =
    currentUser.role === "admin" && targetUser._id !== currentUser._id;

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return "Neznámy";
    return new Date(dateString).toLocaleDateString("sk-SK");
  };

  // Получение текста роли
  const getRoleText = (role) => {
    switch (role) {
      case "user":
        return "Používateľ";
      case "expert":
        return "Expert";
      case "lawyer":
        return "Právnik";
      case "moderator":
        return "Moderátor";
      case "admin":
        return "Administrátor";
      default:
        return role;
    }
  };

  // Получение иконки роли
  const getRoleIcon = (role) => {
    switch (role) {
      case "expert":
        return <PersonIcon className="user-card__role-icon" />;
      case "lawyer":
        return <GavelIcon className="user-card__role-icon" />;
      case "moderator":
        return <SecurityIcon className="user-card__role-icon" />;
      case "admin":
        return <AdminPanelSettingsIcon className="user-card__role-icon" />;
      default:
        return <PersonIcon className="user-card__role-icon" />;
    }
  };

  // Получение статуса активности
  const getStatusText = (isActive, isBanned) => {
    if (isBanned) return "Zablokovaný";
    if (isActive === false) return "Neaktívny";
    return "Aktívny";
  };

  // Обработчики событий
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeRole = (newRole) => {
    handleMenuClose();
    const reason = prompt("Dôvod zmeny role (voliteľné):");
    if (reason !== null) {
      onChangeRole?.(targetUser._id, newRole, reason);
    }
  };

  const handleBan = () => {
    handleMenuClose();
    const reason = prompt(
      "Dôvod zablokovania:",
      "Porušenie pravidiel komunity"
    );
    if (reason !== null) {
      const duration = prompt("Počet dní (0 = trvale):", "7");
      const durationNum = parseInt(duration) || 7;

      onBan?.(targetUser._id, {
        reason,
        duration: durationNum,
        isPermanent: durationNum === 0,
      });
    }
  };

  const handleUnban = () => {
    handleMenuClose();
    if (
      confirm(
        `Naozaj chcete odblokovať používateľa ${
          targetUser.firstName || targetUser.username
        }?`
      )
    ) {
      onUnban?.(targetUser._id);
    }
  };

  return (
    <div className="user-card">
      <div className="user-card__content">
        <div className="user-card__box">
          {/* Левая часть - аватар и основная информация */}
          <div className="user-card__main">
            <div className="user-card__avatar">
              {targetUser.firstName
                ? targetUser.firstName[0].toUpperCase()
                : targetUser.username?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="user-card__info">
              <div className="user-card__name">
                {targetUser.firstName && targetUser.lastName
                  ? `${targetUser.firstName} ${targetUser.lastName}`
                  : targetUser.username || "Neznámy používateľ"}
              </div>

              <div className="user-card__email">{targetUser.originalEmail}</div>
            </div>
          </div>
        </div>
        <div className="user-card__box">
          <div className="user-card__meta">
            <span className="user-card__registration">
              Registrovaný: {formatDate(targetUser.createdAt)}
            </span>
            {targetUser.lastLoginAt && (
              <span className="user-card__last-login">
                Posledné prihlásenie: {formatDate(targetUser.lastLoginAt)}
              </span>
            )}
          </div>
        </div>
        <div className="user-card__box">
          <div className="user-card__status">
            <div className="user-card__role">
              <span
                className={`user-card__role-badge user-card__role-badge--${targetUser.role}`}
              >
                {getRoleIcon(targetUser.role)}
                {getRoleText(targetUser.role)}
              </span>
            </div>

            <div className="user-card__activity-status">
              <span
                className={`user-card__status-badge ${
                  targetUser.isBanned
                    ? "user-card__status-badge--banned"
                    : targetUser.isActive !== false
                    ? "user-card__status-badge--active"
                    : "user-card__status-badge--inactive"
                }`}
              >
                {targetUser.isBanned ? (
                  <BlockIcon className="user-card__status-icon" />
                ) : (
                  <CheckCircleIcon className="user-card__status-icon" />
                )}
                {getStatusText(targetUser.isActive, targetUser.isBanned)}
              </span>
            </div>

            {/* Статистика пользователя */}
            <div className="user-card__stats">
              {targetUser.questionsCount !== undefined && (
                <div className="user-card__stat">
                  <span className="user-card__stat-label">Otázky:</span>
                  <span className="user-card__stat-value">
                    {targetUser.questionsCount || 0}
                  </span>
                </div>
              )}
              {targetUser.answersCount !== undefined && (
                <div className="user-card__stat">
                  <span className="user-card__stat-label">Odpovede:</span>
                  <span className="user-card__stat-value">
                    {targetUser.answersCount || 0}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="user-card__actions">
          {canEdit && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                disabled={disabled}
                size="small"
                className="user-card__menu-button"
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                className="user-card__menu"
              >
                {/* Смена роли */}
                <MenuItem disabled className="user-card__menu-header">
                  Zmeniť rolu:
                </MenuItem>

                {targetUser.role !== "user" && (
                  <MenuItem
                    onClick={() => handleChangeRole("user")}
                    className="user-card__menu-item"
                  >
                    <PersonIcon className="user-card__menu-icon" />
                    Používateľ
                  </MenuItem>
                )}

                {targetUser.role !== "expert" && (
                  <MenuItem
                    onClick={() => handleChangeRole("expert")}
                    className="user-card__menu-item"
                  >
                    <PersonIcon className="user-card__menu-icon" />
                    Expert
                  </MenuItem>
                )}

                {targetUser.role !== "admin" && (
                  <MenuItem
                    onClick={() => handleChangeRole("admin")}
                    className="user-card__menu-item"
                  >
                    <PersonIcon className="user-card__menu-icon" />
                    Admin
                  </MenuItem>
                )}

                {/* {targetUser.role !== "lawyer" && (
                  <MenuItem
                    onClick={() => handleChangeRole("lawyer")}
                    className="user-card__menu-item"
                  >
                    <GavelIcon className="user-card__menu-icon" />
                    Právnik
                  </MenuItem>
                )} */}

                {/* {targetUser.role !== "moderator" && (
                  <MenuItem
                    onClick={() => handleChangeRole("moderator")}
                    className="user-card__menu-item"
                  >
                    <SecurityIcon className="user-card__menu-icon" />
                    Moderátor
                  </MenuItem>
                )} */}

                <div className="user-card__menu-divider"></div>

                {/* Бан/разбан */}
                {targetUser.isBanned ? (
                  <MenuItem
                    onClick={handleUnban}
                    className="user-card__menu-item user-card__menu-item--success"
                  >
                    <CheckCircleIcon className="user-card__menu-icon" />
                    Odblokovať
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={handleBan}
                    className="user-card__menu-item user-card__menu-item--danger"
                  >
                    <BlockIcon className="user-card__menu-icon" />
                    Zablokovať
                  </MenuItem>
                )}
              </Menu>
            </>
          )}

          {!canEdit && (
            <div className="user-card__no-actions">
              {targetUser._id === currentUser._id ? "To ste vy" : "Nedostupné"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
