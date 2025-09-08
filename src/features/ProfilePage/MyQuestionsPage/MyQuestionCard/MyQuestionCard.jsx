// Файл: src/features/ProfilePage/MyQuestionsPage/MyQuestionCard/MyQuestionCard.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { basePath } from "@/src/constants/config";
import { Menu, MenuItem, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LockIcon from "@mui/icons-material/Lock";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import "./MyQuestionCard.scss";

export default function MyQuestionCard({
  question,
  user,
  onEdit,
  onDelete,
  onShare,
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
      pravnik: "Právnik",
      lawyer: "Právnik",
      loans: "Pôžičky",
      banking: "Bankovníctvo",
      insurance: "Poistenie",
      investment: "Investície",
      credit: "Úvery",
    };
    return categoryMap[slug] || slug;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "answered":
        return {
          text: "Zodpovedané",
          type: "success",
          icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
        };
      case "closed":
        return {
          text: "Uzavreté",
          type: "secondary",
          icon: <LockIcon sx={{ fontSize: 14 }} />,
        };
      case "pending":
        return {
          text: "Nezodpovedané",
          type: "primary",
          icon: <HourglassEmptyIcon sx={{ fontSize: 14 }} />,
        };
      default:
        return {
          text: "Aktívne",
          type: "primary",
          icon: <FiberManualRecordIcon sx={{ fontSize: 14 }} />,
        };
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high":
        return {
          text: "Vysoká",
          type: "high",
          icon: <PriorityHighIcon sx={{ fontSize: 14 }} />,
        };
      case "urgent":
        return {
          text: "Urgentná",
          type: "urgent",
          icon: <FlashOnIcon sx={{ fontSize: 14 }} />,
        };
      case "low":
        return {
          text: "Nízka",
          type: "low",
          icon: <LowPriorityIcon sx={{ fontSize: 14 }} />,
        };
      default:
        return null;
    }
  };

  // Проверка прав на редактирование и удаление
  const canEdit = () => {
    if (!user || !question) return false;
    const createdAt = new Date(question.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  const canDelete = () => {
    if (!user || !question) return false;
    const createdAt = new Date(question.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    return hoursDiff <= 1 && !question.hasAnswers;
  };

  // Обработчики меню
  const handleMenuOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    handleMenuClose();

    switch (action) {
      case "view":
        window.open(`${basePath}/questions/${question.slug}`, "_blank");
        break;
      case "edit":
        if (canEdit() && onEdit) {
          onEdit(question);
        }
        break;
      case "delete":
        if (canDelete() && onDelete) {
          onDelete(question);
        }
        break;
      case "share":
        if (onShare) {
          onShare(question);
        }
        break;
    }
  };

  // Превью контента (более короткое для компактности)
  const getPreviewText = (content) => {
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>/g, ""); // Удаление HTML тегов
    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  const statusInfo = getStatusInfo(question.status);
  const priorityInfo = getPriorityInfo(question.priority);
  const questionUrl = `/questions/${question.slug}`;

  return (
    <div className="my-question-card">
      <div className="my-question-card__content">
        {/* Header с статусом и меню */}
        <div className="my-question-card__header">
          <div className="my-question-card__badges">
            <span
              className={`my-question-card__status my-question-card__status--${statusInfo.type}`}
            >
              <span className="my-question-card__status-icon">
                {statusInfo.icon}
              </span>
              {statusInfo.text}
            </span>

            {priorityInfo && (
              <span
                className={`my-question-card__priority my-question-card__priority--${priorityInfo.type}`}
              >
                <span className="my-question-card__priority-icon">
                  {priorityInfo.icon}
                </span>
                {priorityInfo.text}
              </span>
            )}

            {question.category && (
              <span className={`my-question-card__category`}>
                <span className="my-question-card__category-icon">
                  <AssignmentIndIcon sx={{ fontSize: 14 }} />
                </span>
                {getCategoryName(question.category)}
              </span>
            )}
          </div>

          {/* Меню действий */}
          <div className="my-question-card__menu">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              className="my-question-card__menu-trigger"
              aria-label="Možnosti otázky"
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: 2,
                  minWidth: 160,
                  mt: 1,
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1.5,
                    fontSize: 14,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => handleMenuAction("view")}>
                <VisibilityIcon sx={{ fontSize: 18 }} />
                Zobraziť
              </MenuItem>

              {/* Доделать в проде */}
              {/* {canEdit() && (
                <MenuItem onClick={() => handleMenuAction("edit")}>
                  <EditIcon sx={{ fontSize: 18 }} />
                  Upraviť
                </MenuItem>
              )} */}

              <MenuItem onClick={() => handleMenuAction("share")}>
                <ShareIcon sx={{ fontSize: 18 }} />
                Zdieľať
              </MenuItem>

              {canDelete() && (
                <MenuItem
                  onClick={() => handleMenuAction("delete")}
                  sx={{
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "error.light",
                      color: "error.dark",
                    },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                  Vymazať
                </MenuItem>
              )}
            </Menu>
          </div>
        </div>

        {/* Заголовок вопроса */}
        <Link href={questionUrl} className="my-question-card__title-link">
          <h3 className="my-question-card__title">{question.title}</h3>
        </Link>

        {/* Превью контента */}
        {question.content && (
          <p className="my-question-card__preview">
            {getPreviewText(question.content)}
          </p>
        )}

        {/* Footer с метаинформацией и статистикой */}
        <div className="my-question-card__footer">
          <div className="my-question-card__meta">
            <span className="my-question-card__date">
              {formatDate(question.createdAt)}
            </span>
          </div>

          <div className="my-question-card__stats">
            <div className="my-question-card__stat">
              <ThumbUpIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <span className="my-question-card__stat-value">
                {question.likes || 0}
              </span>
            </div>

            <div className="my-question-card__stat">
              <ChatBubbleIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <span className="my-question-card__stat-value">
                {question.answersCount || 0}
              </span>
            </div>

            <div className="my-question-card__stat">
              <VisibilityOutlinedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <span className="my-question-card__stat-value">
                {question.views || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
