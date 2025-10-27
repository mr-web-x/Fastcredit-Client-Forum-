// Файл: src/features/ExpertsPage/ExpertsPage.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import "./ExpertsPage.scss";
import ExpertCard from "./ExpertCard/ExpertCard";
import Pagination from "@/src/components/Pagination/Pagination";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SortIcon from "@mui/icons-material/Sort";

export default function ExpertsPage({
    initialExperts = [],
    initialPagination = null,
    initialFilters = {},
    error = null,
}) {
    const [sortBy, setSortBy] = useState(initialFilters.sortBy || "rating");
    const [sortOrder, setSortOrder] = useState(
        initialFilters.sortOrder || "-1"
    );

    // Вычисляем общую статистику
    const totalExperts = initialPagination?.totalItems || 0;
    const averageRating =
        initialExperts.length > 0
            ? (
                initialExperts.reduce((sum, expert) => sum + (expert.rating || 0), 0) /
                initialExperts.length
            ).toFixed(1)
            : "0.0";
    const totalAnswers = initialExperts.reduce(
        (sum, expert) => sum + (expert.totalAnswers || 0),
        0
    );

    // Создание URL с параметрами сортировки
    const createSortUrl = (newSortBy, newSortOrder) => {
        const params = new URLSearchParams();
        if (initialFilters.page > 1) {
            params.set("page", "1"); // При смене сортировки возвращаемся на первую страницу
        }
        if (newSortBy !== "rating") {
            params.set("sortBy", newSortBy);
        }
        if (newSortOrder !== "-1") {
            params.set("sortOrder", newSortOrder);
        }
        const queryString = params.toString();
        return `/forum/experts${queryString ? `?${queryString}` : ""}`;
    };

    // Обработчик изменения сортировки
    const handleSortChange = (e) => {
        const newSortBy = e.target.value;
        setSortBy(newSortBy);
        window.location.href = createSortUrl(newSortBy, sortOrder);
    };

    return (
        <div className="experts-page">
            {/* Breadcrumbs */}
            <div className="container">
                <nav className="experts-page__breadcrumbs" aria-label="Breadcrumb">
                    <Link href="/forum" className="experts-page__breadcrumb-link">
                        <HomeIcon sx={{ fontSize: 16 }} />
                        <span>Domov</span>
                    </Link>
                    <span className="experts-page__breadcrumb-separator">
                        <ChevronRightIcon sx={{ fontSize: 16 }} />
                    </span>
                    <span className="experts-page__breadcrumb-current">Experti</span>
                </nav>
            </div>

            {/* Hero секция */}
            <div className="container">
                <div className="experts-page__hero">
                    <div className="experts-page__hero-content">
                        <h1 className="experts-page__title">
                            <PeopleIcon sx={{ fontSize: 40 }} />
                            Naši Experti
                        </h1>
                        <p className="experts-page__subtitle">
                            Overení finanční odborníci pripravení vám pomôcť s finančnými
                            otázkami
                        </p>
                    </div>

                    {/* Статистика */}
                    <div className="experts-page__stats">
                        <div className="experts-page__stat-card">
                            <PeopleIcon className="experts-page__stat-icon" />
                            <div className="experts-page__stat-content">
                                <span className="experts-page__stat-value">{totalExperts}</span>
                                <span className="experts-page__stat-label">Expertov</span>
                            </div>
                        </div>

                        <div className="experts-page__stat-card">
                            <StarIcon className="experts-page__stat-icon" />
                            <div className="experts-page__stat-content">
                                <span className="experts-page__stat-value">
                                    {averageRating}★
                                </span>
                                <span className="experts-page__stat-label">
                                    Priemerný rating
                                </span>
                            </div>
                        </div>

                        <div className="experts-page__stat-card">
                            <QuestionAnswerIcon className="experts-page__stat-icon" />
                            <div className="experts-page__stat-content">
                                <span className="experts-page__stat-value">{totalAnswers}</span>
                                <span className="experts-page__stat-label">Odpovedí</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Контент */}
            <div className="container">
                {/* Ошибка */}
                {error && (
                    <div className="experts-page__error">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                {/* Сортировка */}
                {/* <div className="experts-page__controls">
                    <div className="experts-page__sort">
                        <SortIcon sx={{ fontSize: 18 }} />
                        <span className="experts-page__sort-label">Zoradiť podľa:</span>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="experts-page__sort-select"
                        >
                            <option value="rating">Ratingu (najlepší)</option>
                            <option value="totalAnswers">Počtu odpovedí</option>
                            <option value="createdAt">Dátumu registrácie</option>
                            <option value="firstName">Mena (A-Z)</option>
                        </select>
                    </div>
                </div> */}

                {/* Список экспертов */}
                {initialExperts.length > 0 ? (
                    <>
                        <div className="experts-page__grid">
                            {initialExperts.map((expert) => (
                                <ExpertCard key={expert._id} expert={expert} />
                            ))}
                        </div>

                        {/* Пагинация */}
                        {initialPagination && initialPagination.total > 1 && (
                            <Pagination
                                pagination={initialPagination}
                                currentFilters={initialFilters}
                                basePath="/forum/experts"
                            />
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="experts-page__empty">
                        <PeopleIcon sx={{ fontSize: 64, opacity: 0.3 }} />
                        <h3>Momentálne nie sú k dispozícii žiadni experti</h3>
                        <p>Skúste to znovu neskôr alebo sa vráťte na hlavnú stránku.</p>
                        <Link href="/forum" className="experts-page__empty-link">
                            Späť na hlavnú
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}