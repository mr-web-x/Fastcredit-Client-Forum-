// Файл: src/features/ProfilePage/ProfilePage.jsx
"use client";

import Link from "next/link";
import "./ProfilePage.scss";

export default function ProfilePage({ user, latestQuestion }) {
  return (
    <div className="profile-page">
      {/* Секция с последним вопросом */}
      <div className="profile-page__section">
        <div className="profile-page__last-question__top">
          <h2 className="profile-page__section-title">
            <span className="profile-page__section-icon">❓</span>
            Posledná otázka
          </h2>

          <div className="profile-page__questions-actions">
            <Link
              href="/ask"
              className="profile-page__action-button profile-page__action-button--primary"
            >
              Zadať novú otázku
            </Link>
            {latestQuestion && (
              <Link
                href="/profile/my-questions"
                className="profile-page__action-button"
              >
                Zobraziť všetky otázky
              </Link>
            )}
          </div>
        </div>

        {latestQuestion ? (
          <div className="profile-page__latest-question">
            <h3 className="profile-page__question-title">
              {latestQuestion.title}
            </h3>
            <p className="profile-page__question-preview">
              {latestQuestion.content.substring(0, 150)}...
            </p>
            <div className="profile-page__question-meta">
              <span className="profile-page__question-date">
                {new Date(latestQuestion.createdAt).toLocaleDateString("sk-SK")}
              </span>
              <span className="profile-page__question-answers">
                {latestQuestion.answersCount} odpovedí
              </span>
              <span className="profile-page__question-likes">
                {latestQuestion.likesCount} páči sa
              </span>
            </div>
            <Link
              href={`/questions/${latestQuestion._id}`}
              className="profile-page__question-link"
            >
              Zobraziť celú otázku →
            </Link>
          </div>
        ) : (
          <div className="profile-page__no-questions">
            <div className="profile-page__no-questions-icon">❓</div>
            <h3 className="profile-page__no-questions-title">
              Zatiaľ ste nezadali žiadne otázky
            </h3>
            <p className="profile-page__no-questions-text">
              Začnite sa pýtať a získajte odpovede od našich expertov
            </p>
            <Link href="/ask" className="profile-page__ask-button">
              Zadať prvú otázku
            </Link>
          </div>
        )}
      </div>

      {/* Двухколоночный контент - только статистика и информация о роли */}
      <div className="profile-page__two-columns">
        {/* Левая колонка - Информация о роли */}
        <div className="profile-page__column">
          <div className="profile-page__info-card">
            <h3 className="profile-page__info-title">
              <span className="profile-page__info-icon">👤</span>
              Informácie o role
            </h3>
            <div className="profile-page__role-info">
              <div className="profile-page__current-role">
                <span className="profile-page__role-label">Aktuálna rola:</span>
                <span
                  className={`profile-page__role-badge profile-page__role-badge--${user.role}`}
                >
                  {user.role === "user" && "Používateľ"}
                  {user.role === "expert" && "Expert"}
                  {user.role === "moderator" && "Moderátor"}
                  {user.role === "admin" && "Administrátor"}
                </span>
              </div>

              <div className="profile-page__role-description">
                {user.role === "user" && (
                  <p>Môžete sa pýtať otázky a komentovať odpovede expertov.</p>
                )}
                {user.role === "expert" && (
                  <p>
                    Môžete odpovedať na otázky v svojej oblasti expertise a
                    pomáhať ostatným používateľom.
                  </p>
                )}
                {user.role === "moderator" && (
                  <p>Máte práva na moderovanie obsahu a správu komunity.</p>
                )}
                {user.role === "admin" && (
                  <p>Máte plné práva na správu fóra a všetkých používateľov.</p>
                )}
              </div>

              {user.role === "user" && (
                <div className="profile-page__role-tip">
                  <span className="profile-page__tip-icon">💡</span>
                  <p>
                    Chcete sa stať expertom? Aktívne odpovedajte na otázky a
                    pomáhajte komunite.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Правая колонка - Статистика */}
        <div className="profile-page__column">
          <div className="profile-page__info-card profile-page__info-card--statistic">
            <h3 className="profile-page__info-title">
              <span className="profile-page__info-icon">📊</span>
              Štatistiky účtu
            </h3>
            <div className="profile-page__stats-grid">
              <div className="profile-page__stat">
                <span className="profile-page__stat-value">
                  {user.questionsCount || 0}
                </span>
                <span className="profile-page__stat-label">Otázok</span>
              </div>
              <div className="profile-page__stat">
                <span className="profile-page__stat-value">
                  {user.answersCount || 0}
                </span>
                <span className="profile-page__stat-label">Odpovedí</span>
              </div>
              <div className="profile-page__stat">
                <span className="profile-page__stat-value">
                  {user.likesReceived || 0}
                </span>
                <span className="profile-page__stat-label">Páči sa mi</span>
              </div>
              <div className="profile-page__stat">
                <span className="profile-page__stat-value">
                  {user.reputation || 0}
                </span>
                <span className="profile-page__stat-label">Reputácia</span>
              </div>
            </div>

            <div className="profile-page__stats-footer">
              <Link href="/profile/stats" className="profile-page__stats-link">
                📈 Detailné štatistiky →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="profile-page__quick-actions">
        <h3 className="profile-page__actions-title">Rýchle akcie</h3>
        <div className="profile-page__actions-grid">
          <Link href="/profile/my-data" className="profile-page__action-card">
            <span className="profile-page__action-text">Upraviť profil</span>
          </Link>

          <Link
            href="/profile/my-questions"
            className="profile-page__action-card"
          >
            <span className="profile-page__action-text">Moje otázky</span>
          </Link>

          <Link href="/ask" className="profile-page__action-card">
            <span className="profile-page__action-text">Nová otázka</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
