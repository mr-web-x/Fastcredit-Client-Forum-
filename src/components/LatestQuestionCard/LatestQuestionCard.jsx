import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import { formatDate } from "@/src/utils/formatDate";
import { getUserInitials } from "@/src/utils/user";
import "./LatestQuestionCard.scss";

export default function LatestQuestionCard({ question }) {
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
                return "Nezodpovedané";
            default:
                return "Aktívne";
        }
    };

    const getCategoryName = (slug) => {
        const categoryMap = {
            expert: "Expert",
            pravnik: "Právnik",
        };
        return categoryMap[slug] || slug;
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case "medium":
                return "Vysoká";
            case "high":
                return "Urgentná";
            case "low":
                return "Nízka";
            default:
                return null;
        }
    };

    return (
        <Link
            href={`/forum/questions/${question.slug || question._id}`}
            className="latest-questions__item"
        >
            {/* Первый ряд: Заголовок + бейджи (на ПК) */}
            <div className="latest-questions__row latest-questions__row--title">
                <h3 className="latest-questions__question-title">{question.title}</h3>

                {/* Бейджи показываются только на ПК */}
                <div className="latest-questions__badges latest-questions__badges--desktop">
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
                            {getPriorityText(question.priority)}
                        </span>
                    )}
                </div>
            </div>

            {/* Третий ряд: Все бейджи + статус (только на мобильных) */}
            <div className="latest-questions__row latest-questions__row--badges">
                <div className="latest-questions__badges latest-questions__badges--mobile">
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
                            {getPriorityText(question.priority)}
                        </span>
                    )}
                    <span
                        className={`latest-questions__status latest-questions__status--mobile latest-questions__status--${getStatusColor(
                            question.status
                        )}`}
                    >
                        {getStatusText(question.status)}
                    </span>
                </div>
            </div>

            {/* Второй ряд: Мета-информация */}
            <div className="latest-questions__row latest-questions__row--meta">
                <div className="latest-questions__author">
                    <div className="latest-questions__avatar">
                        {getUserInitials(question.author)}
                    </div>
                    <span className="latest-questions__author-name">
                        {question.author?.firstName ||
                            question.author?.username ||
                            "Anonym"}
                    </span>
                </div>

                <span className="latest-questions__meta-item">
                    {formatDate(question.createdAt)}
                </span>

                <span className="latest-questions__meta-item">
                    <VisibilityIcon sx={{ fontSize: "16px" }} />
                    {question.views || 0}
                </span>

                <span className="latest-questions__meta-item">
                    <InsertCommentIcon sx={{ fontSize: "16px" }} />
                    {question.answersCount || 0}
                </span>

                <span
                    className={`latest-questions__status latest-questions__status--${getStatusColor(
                        question.status
                    )}`}
                >
                    {getStatusText(question.status)}
                </span>
            </div>
        </Link>
    );
}