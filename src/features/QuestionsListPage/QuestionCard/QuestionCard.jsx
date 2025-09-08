// Файл: src/features/QuestionsListPage/QuestionCard/QuestionCard.jsx

import Link from "next/link";
import { basePath } from "@/src/constants/config";
import "./QuestionCard.scss";

export default function QuestionCard({ question, index = 0 }) {
  // Функції для форматування даних
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
        return { text: "Čaká na odpoveď", type: "primary" };
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

  // Skrátenie textu pre preview (150 znakov)
  const getPreviewText = (content) => {
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>/g, ""); // Odstránenie HTML tagov
    return plainText.length > 150
      ? plainText.substring(0, 150) + "..."
      : plainText;
  };

  // Získanie autorových iniciálov
  const getUserInitials = (user) => {
    if (!user) return "?";
    if (user.firstName) return user.firstName[0].toUpperCase();
    if (user.username) return user.username[0].toUpperCase();
    return "U";
  };

  // URL pre otázku
  const questionUrl = `/questions/${question.slug || question._id}`;

  const statusInfo = getStatusInfo(question.status);
  const priorityInfo = getPriorityInfo(question.priority);

  return (
    <article className="question-card">
      <Link href={questionUrl} className="question-card__link">
        {/* Hlavný obsah */}
        <div className="question-card__content">
          {/* Horný riadok: Názov + bádže (desktop) */}
          <div className="question-card__header">
            <h3 className="question-card__title">{question.title}</h3>

            {/* Bádže na desktop */}
            <div className="question-card__badges question-card__badges--desktop">
              {question.category && (
                <span
                  className={`question-card__category question-card__category--${question.category}`}
                >
                  {getCategoryName(question.category)}
                </span>
              )}

              {priorityInfo && (
                <span
                  className={`question-card__priority question-card__priority--${priorityInfo.type}`}
                >
                  {priorityInfo.text}
                </span>
              )}

              <span
                className={`question-card__status question-card__status--${statusInfo.type}`}
              >
                {statusInfo.text}
              </span>
            </div>
          </div>

          {/* Preview textu */}
          {question.content && (
            <p className="question-card__preview">
              {getPreviewText(question.content)}
            </p>
          )}

          {/* Spodný riadok: Meta informácie */}
          <div className="question-card__footer">
            <div className="question-card__meta">
              {/* Autor */}
              <div className="question-card__author">
                <div className="question-card__avatar">
                  {getUserInitials(question.author)}
                </div>
                <span className="question-card__author-name">
                  {question.author?.firstName ||
                    question.author?.username ||
                    "Anonym"}
                </span>
              </div>

              {/* Dátum */}
              <span className="question-card__date">
                {formatDate(question.createdAt)}
              </span>

              {/* Štatistiky */}
              <div className="question-card__stats">
                <span className="question-card__stat">
                  <span className="question-card__stat-icon">💬</span>
                  {question.answersCount || 0}
                </span>

                <span className="question-card__stat">
                  <span className="question-card__stat-icon">👍</span>
                  {question.likesCount || 0}
                </span>
              </div>
            </div>

            {/* Bádže na mobile */}
            <div className="question-card__badges question-card__badges--mobile">
              {question.category && (
                <span
                  className={`question-card__category question-card__category--${question.category}`}
                >
                  {getCategoryName(question.category)}
                </span>
              )}

              {priorityInfo && (
                <span
                  className={`question-card__priority question-card__priority--${priorityInfo.type}`}
                >
                  {priorityInfo.text}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
