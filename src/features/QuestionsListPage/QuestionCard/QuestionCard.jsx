// Файл: src/features/QuestionsListPage/QuestionCard/QuestionCard.jsx

import Link from "next/link";
import "./QuestionCard.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import { formatDate } from "@/src/utils/formatDate";
import { getUserInitials } from "@/src/utils/user";

export default function QuestionCard({ question, index = 0 }) {
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

  // Skrátenie textu pre preview (150 znakov)
  const getPreviewText = (content) => {
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>/g, ""); // Odstránenie HTML tagov
    return plainText.length > 150
      ? plainText.substring(0, 150) + "..."
      : plainText;
  };

  // URL pre otázku
  const questionUrl = `/forum/questions/${question.slug || question._id}`;

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
                  <VisibilityIcon sx={{ fontSize: "16px" }} />
                  {question.views || 0}
                </span>
                <span className="question-card__stat">
                  <InsertCommentIcon sx={{ fontSize: "16px" }} />
                  {question.answersCount || 0}
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
