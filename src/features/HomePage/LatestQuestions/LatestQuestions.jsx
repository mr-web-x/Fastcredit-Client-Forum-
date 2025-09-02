import Link from "next/link";
import { questionsService } from "@/src/services/server";
import "./LatestQuestions.scss";

export default async function LatestQuestions() {
  // Получаем последние вопросы с сервера
  let questions = [];
  try {
    const result = await questionsService.getLatest({ limit: 15 });
    questions = result.items || [];
  } catch (error) {
    console.error("Failed to load latest questions:", error);
    // Fallback - показываем пустой массив
  }

  // Функции для форматирования
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "success";
      case "closed":
        return "secondary";
      case "pending":
        return "primary";
      default:
        return "primary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "answered":
        return "Zodpovedané";
      case "closed":
        return "Uzavreté";
      case "pending":
        return "Čaká na odpoveď";
      default:
        return "Aktívne";
    }
  };

  const getCategoryName = (slug) => {
    // Используем статический маппинг из вашего categories service
    const categoryMap = {
      expert: "Expert",
      pravnik: "Právnik",
    };
    return categoryMap[slug] || slug;
  };

  return (
    <section className="latest-questions">
      <div className="container latest-questions__container">
        <div className="latest-questions__header">
          <h2 className="latest-questions__title">Najnovšie otázky</h2>
          <p className="latest-questions__subtitle">
            Posledné otázky od našej komunity
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="latest-questions__empty">
            <p>Zatiaľ nie su žiadne otázky.</p>
            <Link href="/ask" className="btn">
              Položiť prvú otázku
            </Link>
          </div>
        ) : (
          <>
            <div className="latest-questions__grid">
              {questions.map((question) => (
                <article key={question._id} className="latest-questions__card">
                  <div className="latest-questions__card-header">
                    {question.category && (
                      <span
                        className={`latest-questions__category latest-questions__category--${question.category}`}
                      >
                        {getCategoryName(question.category)}
                      </span>
                    )}
                    {question.priority && question.priority !== "medium" && (
                      <span
                        className={`latest-questions__priority latest-questions__priority--${question.priority}`}
                      >
                        {question.priority === "high"
                          ? "Vysoká"
                          : question.priority === "urgent"
                          ? "Urgentná"
                          : "Nízka"}
                      </span>
                    )}
                  </div>

                  <div className="latest-questions__card-content">
                    <h3 className="latest-questions__card-title">
                      <Link
                        href={`/questions/${question.slug || question._id}`}
                      >
                        {question.title}
                      </Link>
                    </h3>

                    <p className="latest-questions__card-description">
                      {truncateText(question.content)}
                    </p>
                  </div>

                  <div className="latest-questions__card-meta">
                    <div className="latest-questions__card-author">
                      <span className="latest-questions__author-name">
                        {question.author?.firstName ||
                          question.author?.username ||
                          "Anonymný"}
                      </span>
                      <span className="latest-questions__date">
                        {formatDate(question.createdAt)}
                      </span>
                    </div>

                    <div className="latest-questions__card-stats">
                      <span className="latest-questions__stat">
                        <span className="latest-questions__stat-icon">💬</span>
                        {question.answersCount || 0}
                      </span>
                      <span className="latest-questions__stat">
                        <span className="latest-questions__stat-icon">👍</span>
                        {question.likesCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="latest-questions__card-status">
                    <span
                      className={`latest-questions__status latest-questions__status--${getStatusColor(
                        question.status
                      )}`}
                    >
                      {getStatusText(question.status)}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="latest-questions__footer">
              <Link href="/questions" className="btn btn--secondary">
                Zobraziť všetky otázky
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
