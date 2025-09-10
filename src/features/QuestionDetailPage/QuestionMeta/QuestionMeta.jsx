// Файл: src/features/QuestionDetailPage/QuestionMeta/QuestionMeta.jsx

"use client";

import { useState } from "react";
import "./QuestionMeta.scss";

export default function QuestionMeta({
  question,
  stats,
  user,
  permissions,
  onLike,
  onShare,
  onReport,
  isLiking = false,
}) {
  const [showReportModal, setShowReportModal] = useState(false);

  // Форматирование даты создания для правого нижнего угла
  const formatCreatedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Получение цвета приоритета
  const getPriorityConfig = (priority) => {
    const configs = {
      low: { label: "Nízka", className: "question-meta__priority--low" },
      normal: {
        label: "Normálna",
        className: "question-meta__priority--normal",
      },
      high: { label: "Vysoká", className: "question-meta__priority--high" },
      urgent: {
        label: "Urgentná",
        className: "question-meta__priority--urgent",
      },
    };
    return configs[priority] || configs.normal;
  };

  // Получение конфига категории
  const getCategoryConfig = (category) => {
    const configs = {
      expert: { label: "Expert", className: "question-meta__category--expert" },
      lawyer: {
        label: "Právnik",
        className: "question-meta__category--lawyer",
      },
      general: {
        label: "Všeobecné",
        className: "question-meta__category--general",
      },
    };
    return configs[category] || configs.general;
  };

  // Обработчик отправки жалобы
  const handleReportSubmit = async (reportData) => {
    try {
      await onReport(reportData);
      setShowReportModal(false);
    } catch (error) {
      console.error("Failed to report question:", error);
    }
  };

  const priorityConfig = getPriorityConfig(question.priority);
  const categoryConfig = getCategoryConfig(question.category);

  return (
    <div className="question-meta">
      {/* Левая секция: категория и приоритет */}
      <div className="question-meta__tags">
        {question.category && (
          <span
            className={`question-meta__category ${categoryConfig.className}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
            </svg>
            {categoryConfig.label}
          </span>
        )}

        {question.priority && question.priority !== "normal" && (
          <span
            className={`question-meta__priority ${priorityConfig.className}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {priorityConfig.label}
          </span>
        )}
      </div>

      {/* Центральная секция: статистика и действия */}
      <div className="question-meta__stats-actions">
        {/* Лайки */}
        <button
          onClick={onLike}
          disabled={!permissions.canLike || isLiking}
          className={`question-meta__like ${
            stats.isLiked ? "question-meta__like--active" : ""
          } ${isLiking ? "question-meta__like--loading" : ""}`}
          title={
            !user
              ? "Prihláste sa pre lajkovanie"
              : stats.isLiked
              ? "Zrušiť páči sa mi"
              : "Páči sa mi"
          }
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{stats.likes}</span>
        </button>

        {/* Просмотры */}
        <div className="question-meta__views" title="Počet zobrazení">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          <span>{stats.views || 0}</span>
        </div>

        {/* Поделиться */}
        <button
          onClick={onShare}
          className="question-meta__share"
          title="Zdieľať otázku"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
          </svg>
          <span>Zdieľať</span>
        </button>

        {/* Пожаловаться */}
        {permissions.canReport && (
          <button
            onClick={() => setShowReportModal(true)}
            className="question-meta__report"
            title="Nahlásiť otázku"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z" />
            </svg>
            <span>Nahlásiť</span>
          </button>
        )}
      </div>

      {/* Правая секция: дата создания */}
      <div className="question-meta__date">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
        </svg>
        <span>{formatCreatedDate(question.createdAt)}</span>
      </div>

      {/* Модал жалобы */}
      {showReportModal && (
        <ReportModal
          onSubmit={handleReportSubmit}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

// Компонент модала для жалобы
function ReportModal({ onSubmit, onClose }) {
  const [reason, setReason] = useState("inappropriate");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    { value: "spam", label: "Spam alebo reklama" },
    { value: "inappropriate", label: "Nevhodný obsah" },
    { value: "off-topic", label: "Mimo témy" },
    { value: "duplicate", label: "Duplicitná otázka" },
    { value: "misleading", label: "Zavádzajúce informácie" },
    { value: "other", label: "Iné" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ reason, description });
    } catch (error) {
      console.error("Report failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="report-modal" onClick={handleBackdropClick}>
      <div className="report-modal__content">
        <div className="report-modal__header">
          <h3>Nahlásiť otázku</h3>
          <button
            onClick={onClose}
            className="report-modal__close"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-modal__form">
          <div className="report-modal__field">
            <label>Dôvod nahlasovania:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            >
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="report-modal__field">
            <label>Dodatočné informácie (voliteľné):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Popíšte problém podrobnejšie..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="report-modal__actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Zrušiť
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Odosiela sa..." : "Nahlásiť"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
