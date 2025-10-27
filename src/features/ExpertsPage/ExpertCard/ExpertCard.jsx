// Файл: src/features/ExpertsPage/ExpertCard/ExpertCard.jsx

"use client";

import Link from "next/link";
import "./ExpertCard.scss";

// Icons
import StarIcon from "@mui/icons-material/Star";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedIcon from "@mui/icons-material/Verified";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function ExpertCard({ expert }) {
    // Получаем инициалы для аватара
    const getInitials = () => {
        if (expert.firstName && expert.lastName) {
            return `${expert.firstName[0]}${expert.lastName[0]}`.toUpperCase();
        }
        if (expert.firstName) {
            return expert.firstName[0].toUpperCase();
        }
        return "E";
    };

    // Форматируем дату регистрации
    const formatDate = (date) => {
        if (!date) return "Nedávno";
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${month}.${year}`;
    };

    // Определяем цвет бейджа роли
    const getRoleBadgeClass = () => {
        if (expert.role === "admin") return "expert-card__role-badge--admin";
        return "expert-card__role-badge--expert";
    };

    // Получаем текст роли
    const getRoleText = () => {
        if (expert.role === "admin") return "Admin";
        return "Expert";
    };

    // Форматируем рейтинг
    const rating = expert.rating || 0;
    const formattedRating = rating.toFixed(1);

    return (
        <Link href={`/forum/experts/${expert.slug}`} className="expert-card">
            <div className="expert-card__content">
                {/* Аватар и основная информация */}
                <div className="expert-card__header">
                    <div className="expert-card__avatar-wrapper">
                        {expert.avatar ? (
                            <img
                                src={expert.avatar}
                                alt={`${expert.firstName} ${expert.lastName}`}
                                className="expert-card__avatar-image"
                            />
                        ) : (
                            <div className="expert-card__avatar-placeholder">
                                {getInitials()}
                            </div>
                        )}
                        {expert.isVerified && (
                            <div className="expert-card__verified">
                                <VerifiedIcon sx={{ fontSize: 20 }} />
                            </div>
                        )}
                    </div>

                    <div className="expert-card__info">
                        <h3 className="expert-card__name">
                            {expert.firstName} {expert.lastName}
                        </h3>

                        {/* Рейтинг */}
                        {/* <div className="expert-card__rating">
                            <StarIcon className="expert-card__rating-icon" />
                            <span className="expert-card__rating-value">
                                {formattedRating}
                            </span>
                        </div> */}

                        {/* Бейдж роли */}
                        <span
                            className={`expert-card__role-badge ${getRoleBadgeClass()}`}
                        >
                            {getRoleText()}
                        </span>
                    </div>
                </div>

                {/* Разделитель */}
                <div className="expert-card__divider" />

                {/* Статистика */}
                <div className="expert-card__stats">
                    <div className="expert-card__stat">
                        <QuestionAnswerIcon className="expert-card__stat-icon" />
                        <div className="expert-card__stat-content">
                            <span className="expert-card__stat-value">
                                {expert.totalAnswers || 0}
                            </span>
                            <span className="expert-card__stat-label">Odpovedí</span>
                        </div>
                    </div>

                    <div className="expert-card__stat">
                        <EmojiEventsIcon className="expert-card__stat-icon" />
                        <div className="expert-card__stat-content">
                            <span className="expert-card__stat-value">
                                {expert.totalQuestions || 0}
                            </span>
                            <span className="expert-card__stat-label">Otázok</span>
                        </div>
                    </div>

                    <div className="expert-card__stat">
                        <CalendarTodayIcon className="expert-card__stat-icon" />
                        <div className="expert-card__stat-content">
                            <span className="expert-card__stat-value">
                                {formatDate(expert.createdAt)}
                            </span>
                            <span className="expert-card__stat-label">Člen od</span>
                        </div>
                    </div>
                </div>

                {/* CTA кнопка */}
                <div className="expert-card__footer">
                    <span className="expert-card__cta">
                        Zobraziť profil
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}