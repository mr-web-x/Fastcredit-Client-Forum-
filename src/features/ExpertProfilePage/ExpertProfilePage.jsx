// Файл: src/features/ExpertProfilePage/ExpertProfilePage.jsx

"use client";

import Link from "next/link";
import "./ExpertProfilePage.scss";
import ExpertHero from "./ExpertHero/ExpertHero";
import ExpertAnswers from "./ExpertAnswers/ExpertAnswers";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleIcon from "@mui/icons-material/People";

export default function ExpertProfilePage({ user = null, expert, error = null }) {
    if (!expert) {
        return (
            <div className="expert-profile-page">
                <div className="container">
                    <div className="expert-profile-page__error-state">
                        <h2>Expert nebol nájdený</h2>
                        <p>Požadovaný expert neexistuje alebo bol odstránený.</p>
                        <Link href="/forum/experts" className="expert-profile-page__back-link">
                            Späť na zoznam expertov
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const fullName = `${expert.firstName || ""} ${expert.lastName || ""}`.trim();

    return (
        <div className="expert-profile-page">
            {/* Breadcrumbs */}
            <div className="container">
                <nav className="expert-profile-page__breadcrumbs" aria-label="Breadcrumb">
                    <Link href="/forum" className="expert-profile-page__breadcrumb-link">
                        <HomeIcon sx={{ fontSize: 16 }} />
                        <span>Domov</span>
                    </Link>
                    <span className="expert-profile-page__breadcrumb-separator">
                        <ChevronRightIcon sx={{ fontSize: 16 }} />
                    </span>
                    <Link href="/forum/experts" className="expert-profile-page__breadcrumb-link">
                        <PeopleIcon sx={{ fontSize: 16 }} />
                        <span>Experti</span>
                    </Link>
                    <span className="expert-profile-page__breadcrumb-separator">
                        <ChevronRightIcon sx={{ fontSize: 16 }} />
                    </span>
                    <span className="expert-profile-page__breadcrumb-current">
                        {fullName}
                    </span>
                </nav>
            </div>

            {/* Ошибка */}
            {error && (
                <div className="container">
                    <div className="expert-profile-page__error">
                        <span>⚠️ {error}</span>
                    </div>
                </div>
            )}

            {/* Hero секция */}
            <ExpertHero expert={expert} />

            {/* Список вопросов */}
            <div className="expert-profile-page__content">
                <div className="container">
                    <ExpertAnswers
                        answers={expert.recentAnswers}
                        expertName={expert.firstName || fullName}
                    />
                </div>
            </div>

            {/* CTA блок */}
            <div className="expert-profile-page__cta">
                <div className="container">
                    <div className="expert-profile-page__cta-content">
                        <h2 className="expert-profile-page__cta-title">
                            Máte otázku pre {expert.firstName}?
                        </h2>
                        <p className="expert-profile-page__cta-text">
                            Položte svoju otázku a získajte odbornú odpoveď od nášho
                            certifikovaného experta
                        </p>
                        <Link href="/forum/ask" className="expert-profile-page__cta-button btn">
                            Položiť otázku
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}