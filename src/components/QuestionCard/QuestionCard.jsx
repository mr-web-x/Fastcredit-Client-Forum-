// Файл: src/components/QuestionCard/QuestionCard.jsx

"use client";

import { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import "./QuestionCard.scss";

export default function QuestionCard({
  question,
  user = null,
  onClick,
  onDelete = null,
  showAdminMetrics = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Функции для форматирования данных
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Dnes";
    if (diffDays === 2) return "Včera";
    if (diffDays <= 7) return `Pred ${diffDays} dňami`;

    return date.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryName = (slug) => {
    const categoryMap = {
      expert: "Expert",
      lawyer: "Právnik",
      pravnik: "Právnik",
    };
    return categoryMap[slug] || slug;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "answered":
        return { text: "Zodpovedané", type: "success" };
      case "closed":
        return { text: "Uzavreté", type: "secondary" };
      case "pending":
        return { text: "Nezodpovedané", type: "primary" };
      default:
        return { text: "Aktívne", type: "primary" };
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high":
        return { text: "Vysoká", type: "high" };
      case "urgent":
        return { text: "Urgentná", type: "urgent" };
      case "low":
        return { text: "Nízka", type: "low" };
      default:
        return null;
    }
  };

  // Скрытие контента для превью
  const getPreviewText = (content) => {
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  // Обработчики для меню
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleView = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onClick) onClick(question);
  };

  const handleShare = (event) => {
    event.stopPropagation();
    handleMenuClose();
    const url = `${window.location.origin}/questions/${
      question.slug || question._id
    }`;

    if (navigator.share) {
      navigator.share({
        title: question.title,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Odkaz bol skopírovaný do schránky!");
      });
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onDelete) {
      onDelete(question._id);
    }
  };

  // Рендер админских метрик (правая часть)
  const renderAdminMetrics = () => {
    if (!showAdminMetrics || !user) return null;

    if (user.role === "admin") {
      // Для админов показываем счетчики
      const approvedCount = question.approvedAnswersCount || 0;
      const pendingCount = question.pendingAnswersCount || 0;

      return (
        <div className="question-card__admin-metrics">
          {pendingCount > 0 && (
            <div className="question-card__admin-metric question-card__admin-metric--pending">
              <span className="question-card__admin-dot">🟡</span>
              <span className="question-card__admin-count">{pendingCount}</span>
            </div>
          )}
          {approvedCount > 0 && (
            <div className="question-card__admin-metric question-card__admin-metric--approved">
              <span className="question-card__admin-dot">🟢</span>
              <span className="question-card__admin-count">
                {approvedCount}
              </span>
            </div>
          )}
        </div>
      );
    } else if (user.role === "expert" || user.role === "lawyer") {
      // Для экспертов показываем их статус ответа (пока заглушка)
      console.log(question);
      //Schválená odpoveď
      //Na moderácii

      const expertAnswer = question.userAnswers.find(
        (el) => el.expert === user.id
      );

      if (!expertAnswer) return null;

      return (
        <div
          className={`question-card__admin-metrics {expertAnswer.isApproved ? "question-card__admin-metric--approved" : "question-card__admin-metric--pending"}`}
        >
          <span className="question-card__admin-dot">
            {expertAnswer.isApproved ? "🟢" : "🟡"}
          </span>
          <span className="question-card__admin-count">
            {expertAnswer.isApproved ? "Schválená odpoveď" : "Na moderácii"}
          </span>
        </div>
      );
    }

    return null;
  };

  const statusInfo = getStatusInfo(question.status);
  const priorityInfo = getPriorityInfo(question.priority);
  const questionUrl = `/questions/${question.slug || question._id}`;

  return (
    <div className="question-card" onClick={() => onClick && onClick(question)}>
      <div className="question-card__content">
        {/* Header с badges и меню */}
        <div className="question-card__header">
          <div className="question-card__badges">
            <span
              className={`question-card__status question-card__status--${statusInfo.type}`}
            >
              {statusInfo.text}
            </span>

            {priorityInfo && (
              <span
                className={`question-card__priority question-card__priority--${priorityInfo.type}`}
              >
                {priorityInfo.text}
              </span>
            )}

            {question.category && (
              <span className="question-card__category">
                {getCategoryName(question.category)}
              </span>
            )}
          </div>

          {/* Меню действий */}
          <div className="question-card__menu">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              className="question-card__menu-trigger"
              aria-label="Možnosti otázky"
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem onClick={handleView}>
                <VisibilityIcon sx={{ fontSize: 18, marginRight: 1 }} />
                Zobraziť
              </MenuItem>

              <MenuItem onClick={handleShare}>
                <ShareIcon sx={{ fontSize: 18, marginRight: 1 }} />
                Zdieľať
              </MenuItem>

              {onDelete && user.role === "admin" && (
                <MenuItem onClick={handleDelete} sx={{ color: "#d32f2f" }}>
                  <DeleteIcon sx={{ fontSize: 18, marginRight: 1 }} />
                  Vymazať
                </MenuItem>
              )}
            </Menu>
          </div>
        </div>

        {/* Заголовок вопроса */}
        <h3 className="question-card__title">{question.title}</h3>

        {/* Превью контента */}
        {question.content && (
          <p className="question-card__preview">
            {getPreviewText(question.content)}
          </p>
        )}

        {/* Footer с метаинформацией */}
        <div className="question-card__footer">
          {/* Левая часть: дата, просмотры, публичные ответы */}
          <div className="question-card__meta">
            <span className="question-card__date">
              {formatDate(question.createdAt)}
            </span>

            <div className="question-card__stats">
              <div className="question-card__stat">
                <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
                <span className="question-card__stat-value">
                  {question.views || 0}
                </span>
              </div>

              <div className="question-card__stat">
                <ChatBubbleIcon sx={{ fontSize: 14 }} />
                <span className="question-card__stat-value">
                  {question.answersCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Правая часть: админские метрики */}
          {renderAdminMetrics()}
        </div>
      </div>
    </div>
  );
}
