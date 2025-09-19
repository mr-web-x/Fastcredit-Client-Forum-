// Файл: src/features/QuestionDetailPage/QuestionMeta/QuestionMeta.jsx

"use client";

import "./QuestionMeta.scss";
import { formatCreatedDate } from "@/src/utils/formatDate";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function QuestionMeta({ question }) {
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
        className: "question-meta__priority--medium",
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

  const priorityConfig = getPriorityConfig(question.priority);
  const categoryConfig = getCategoryConfig(question.category);

  return (
    <div className="question-meta">
      {/* Левая секция: категория и приоритет */}
      {question.views && (
        <span className={`question-meta__views`}>
          <VisibilityIcon sx={{ fontSize: "16px" }} />
          {question.views || 0}
        </span>
      )}
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

      {/* Правая секция: дата создания */}
      <div className="question-meta__date">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
        </svg>
        <span>{formatCreatedDate(question.createdAt)}</span>
      </div>
    </div>
  );
}
