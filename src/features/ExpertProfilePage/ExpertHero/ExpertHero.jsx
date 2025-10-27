// Файл: src/features/ExpertProfilePage/ExpertHero/ExpertHero.jsx

"use client";

import "./ExpertHero.scss";

// Icons
import VerifiedIcon from "@mui/icons-material/Verified";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { decodeHtmlEntities } from "@/src/utils/decodeHtmlEntities";
import { useState } from "react";
import ExpertContacts from "@/src/components/ExpertContacts/ExpertContacts";

export default function ExpertHero({ expert }) {
    const [showFullBio, setShowFullBio] = useState(false);
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

    // Полное имя
    const fullName = `${expert.firstName || ""} ${expert.lastName || ""}`.trim();

    // Вычисляем количество дней на форуме
    const getDaysOnForum = () => {
        if (!expert.createdAt) return 0;
        const createdDate = new Date(expert.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Определяем бейдж роли
    const getRoleBadge = () => {
        if (expert.role === "admin") {
            return (
                <div className="expert-hero__role-badge expert-hero__role-badge--admin">
                    <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
                    <span>Administrátor</span>
                </div>
            );
        }
        return (
            <div className="expert-hero__role-badge expert-hero__role-badge--expert">
                <WorkspacePremiumIcon sx={{ fontSize: 16 }} />
                <span>Certifikovaný Expert</span>
            </div>
        );
    };


    // Логика для биографии
    const getBioContent = () => {
        if (!expert.bio) return null;

        const bioLength = expert.bio.length;
        const shouldTruncate = bioLength > 600;

        if (!shouldTruncate) {
            // Если текст короткий, показываем полностью
            return expert.bio.split("\n").map((paragraph, index) =>
                paragraph.trim() ? (
                    <p key={index}>{decodeHtmlEntities(paragraph)}</p>
                ) : (
                    <br key={index} />
                )
            );
        }

        // Если текст длинный
        if (showFullBio) {
            // Показываем полный текст
            return expert.bio.split("\n").map((paragraph, index) =>
                paragraph.trim() ? (
                    <p key={index}>{decodeHtmlEntities(paragraph)}</p>
                ) : (
                    <br key={index} />
                )
            );
        } else {
            // Показываем обрезанный текст
            const truncatedBio = expert.bio.substring(0, 580);

            // Разбиваем обрезанный текст по параграфам
            const paragraphs = truncatedBio.split("\n");

            return (
                <>
                    {paragraphs.map((paragraph, index) => {
                        // Последний параграф - добавляем троеточие
                        if (index === paragraphs.length - 1) {
                            return paragraph.trim() ? (
                                <p key={index}>{decodeHtmlEntities(paragraph)}...</p>
                            ) : null;
                        }
                        // Остальные параграфы как обычно
                        return paragraph.trim() ? (
                            <p key={index}>{decodeHtmlEntities(paragraph)}</p>
                        ) : (
                            <br key={index} />
                        );
                    })}
                </>
            );
        }
    };

    return (
        <div className="expert-hero" itemScope itemType="https://schema.org/Person">
            <div className="container">
                <div className="expert-hero__wrapper">
                    {/* ЛЕВАЯ КОЛОНКА: Аватар, Имя, Роль, Статистика */}
                    <div className="expert-hero__box">
                        <div className="expert-hero__left">
                            {/* Аватар с верификацией */}
                            <div className="expert-hero__avatar-wrapper">
                                {expert.avatar ? (
                                    <img
                                        src={expert.avatar}
                                        alt={fullName}
                                        className="expert-hero__avatar-image"
                                        itemProp="image"
                                    />
                                ) : (
                                    <div className="expert-hero__avatar-placeholder">
                                        {getInitials()}
                                    </div>
                                )}
                                {expert.isVerified && (
                                    <div className="expert-hero__verified-badge">
                                        <VerifiedIcon sx={{ fontSize: 28 }} />
                                    </div>
                                )}
                            </div>

                            {/* Информация */}
                            <div className="expert-hero__info">
                                <h1 className="expert-hero__name" itemProp="name">{fullName}</h1>

                                {/* Роль */}
                                {getRoleBadge()}

                                {/* Статистика */}
                                <div className="expert-hero__stats">
                                    <div className="expert-hero__stat-item">
                                        <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                        <span>{getDaysOnForum()} dní</span>
                                    </div>
                                    <div className="expert-hero__stat-item">
                                        <QuestionAnswerIcon sx={{ fontSize: 18 }} />
                                        <span>{expert.totalAnswers || 0} odpovedí</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {expert.contacts && <ExpertContacts contacts={expert.contacts} />}
                    </div>

                    {/* ПРАВАЯ КОЛОНКА: Кнопка и Биография */}
                    <div className="expert-hero__right">

                        {expert.bio && (
                            <div className="expert-hero__bio" itemProp="description">
                                {getBioContent()}
                                {expert.bio.length > 600 && (
                                    <button
                                        onClick={() => setShowFullBio(!showFullBio)}
                                        className="expert-hero__bio-toggle"
                                    >
                                        {showFullBio ? "Ukázať menej" : "Čítať viac"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}