// Файл: app/questions/[slug]/loading.js

export default function QuestionLoading() {
  return (
    <div className="question-detail-loading">
      <div className="container">
        {/* Breadcrumbs skeleton */}
        <nav className="question-detail-loading__breadcrumbs">
          <div className="skeleton skeleton--text skeleton--sm"></div>
          <span>›</span>
          <div className="skeleton skeleton--text skeleton--sm"></div>
          <span>›</span>
          <div className="skeleton skeleton--text skeleton--sm"></div>
        </nav>

        {/* Header skeleton */}
        <div className="question-detail-loading__header">
          <div className="skeleton skeleton--text skeleton--lg question-detail-loading__title"></div>
          <div className="question-detail-loading__meta">
            <div className="skeleton skeleton--circle skeleton--sm"></div>
            <div className="skeleton skeleton--text skeleton--md"></div>
            <div className="skeleton skeleton--text skeleton--sm"></div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="question-detail-loading__content">
          {/* Main area */}
          <div className="question-detail-loading__main">
            {/* Question content */}
            <div className="question-detail-loading__question">
              <div className="skeleton skeleton--text skeleton--full"></div>
              <div className="skeleton skeleton--text skeleton--full"></div>
              <div className="skeleton skeleton--text skeleton--lg"></div>
              <div className="question-detail-loading__tags">
                <div className="skeleton skeleton--pill"></div>
                <div className="skeleton skeleton--pill"></div>
                <div className="skeleton skeleton--pill"></div>
              </div>
            </div>

            {/* Answers skeleton */}
            <div className="question-detail-loading__answers">
              <div className="skeleton skeleton--text skeleton--md question-detail-loading__answers-title"></div>
              
              {/* Answer items */}
              {[1, 2, 3].map(i => (
                <div key={i} className="question-detail-loading__answer">
                  <div className="question-detail-loading__answer-header">
                    <div className="skeleton skeleton--circle skeleton--md"></div>
                    <div className="skeleton skeleton--text skeleton--md"></div>
                  </div>
                  <div className="skeleton skeleton--text skeleton--full"></div>
                  <div className="skeleton skeleton--text skeleton--full"></div>
                  <div className="skeleton skeleton--text skeleton--lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="question-detail-loading__sidebar">
            <div className="question-detail-loading__stats">
              <div className="skeleton skeleton--text skeleton--md"></div>
              <div className="skeleton skeleton--text skeleton--sm"></div>
              <div className="skeleton skeleton--text skeleton--sm"></div>
              <div className="skeleton skeleton--text skeleton--sm"></div>
            </div>
            
            <div className="question-detail-loading__similar">
              <div className="skeleton skeleton--text skeleton--md"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton skeleton--text skeleton--lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .question-detail-loading {
          min-height: calc(100vh - 120px);
          padding: 24px 0;
          background: var(--background);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .question-detail-loading__breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .question-detail-loading__header {
          margin-bottom: 32px;
          padding: 24px;
          background: var(--white);
          border-radius: 16px;
          box-shadow: var(--shadow-card);
        }

        .question-detail-loading__title {
          margin-bottom: 16px;
        }

        .question-detail-loading__meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .question-detail-loading__content {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
          align-items: start;
        }

        .question-detail-loading__main {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .question-detail-loading__question {
          background: var(--white);
          padding: 24px;
          border-radius: 16px;
          box-shadow: var(--shadow-card);
        }

        .question-detail-loading__tags {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .question-detail-loading__answers {
          background: var(--white);
          padding: 24px;
          border-radius: 16px;
          box-shadow: var(--shadow-card);
        }

        .question-detail-loading__answers-title {
          margin-bottom: 24px;
        }

        .question-detail-loading__answer {
          padding: 20px 0;
          border-bottom: 1px solid var(--card-border-light);
        }

        .question-detail-loading__answer:last-child {
          border-bottom: none;
        }

        .question-detail-loading__answer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .question-detail-loading__sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .question-detail-loading__stats,
        .question-detail-loading__similar {
          background: var(--white);
          padding: 20px;
          border-radius: 16px;
          box-shadow: var(--shadow-card);
        }

        /* Skeleton styles */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton--text {
          height: 16px;
        }

        .skeleton--sm {
          width: 80px;
        }

        .skeleton--md {
          width: 120px;
        }

        .skeleton--lg {
          width: 200px;
        }

        .skeleton--full {
          width: 100%;
        }

        .skeleton--circle {
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }

        .skeleton--pill {
          width: 60px;
          height: 24px;
          border-radius: 12px;
        }

        @keyframes loading {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .question-detail-loading__content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .question-detail-loading__header,
          .question-detail-loading__question,
          .question-detail-loading__answers,
          .question-detail-loading__stats,
          .question-detail-loading__similar {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

// ================================================================
// Файл: app/questions/[slug]/not-found.js

import Link from "next/link";
import { basePath } from "@/src/constants/config";

export default function QuestionNotFound() {
  return (
    <div className="question-not-found">
      <div className="container">
        <div className="question-not-found__content">
          {/* 404 Icon */}
          <div className="question-not-found__icon">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="question-not-found__title">
            Otázka nenájdená
          </h1>
          
          <p className="question-not-found__description">
            Požadovaná otázka neexistuje alebo bola odstránená. 
            Možno sa pomýlili v adrese alebo otázka už nie je dostupná.
          </p>

          {/* Actions */}
          <div className="question-not-found__actions">
            <Link 
              href={`${basePath}/questions`} 
              className="question-not-found__btn question-not-found__btn--primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Všetky otázky
            </Link>
            
            <Link 
              href={`${basePath}/ask`} 
              className="question-not-found__btn question-not-found__btn--secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Zadať otázku
            </Link>
          </div>

          {/* Help Text */}
          <div className="question-not-found__help">
            <p>
              <strong>Hľadáte niečo konkrétne?</strong><br/>
              Skúste vyhľadať podobné otázky alebo sa opýtajte našich expertov.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .question-not-found {
          min-height: calc(100vh - 120px);
          padding: 60px 0;
          background: var(--background);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .question-not-found__content {
          text-align: center;
          background: var(--white);
          padding: 48px 32px;
          border-radius: 20px;
          box-shadow: var(--shadow-card);
        }

        .question-not-found__icon {
          color: var(--accent);
          margin-bottom: 24px;
          opacity: 0.8;
        }

        .question-not-found__title {
          font-size: 32px;
          font-weight: 800;
          color: var(--black);
          margin: 0 0 16px 0;
        }

        .question-not-found__description {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 32px 0;
        }

        .question-not-found__actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .question-not-found__btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .question-not-found__btn--primary {
          background: var(--accentGradient);
          color: var(--white);
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-card-hover);
          }
        }

        .question-not-found__btn--secondary {
          background: var(--background);
          color: var(--accent);
          border: 2px solid var(--accent-border-light);
          
          &:hover {
            background: var(--accent-bg-light);
            border-color: var(--accent);
          }
        }

        .question-not-found__help {
          padding: 20px;
          background: var(--background);
          border-radius: 12px;
          border-left: 4px solid var(--accent);
        }

        .question-not-found__help p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .question-not-found__help strong {
          color: var(--black);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .question-not-found {
            padding: 40px 0;
          }

          .question-not-found__content {
            padding: 32px 20px;
          }

          .question-not-found__title {
            font-size: 28px;
          }

          .question-not-found__actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}