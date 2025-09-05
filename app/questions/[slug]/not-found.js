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
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="question-not-found__title">Otázka nenájdená</h1>

          <p className="question-not-found__description">
            Požadovaná otázka neexistuje alebo bola odstránená. Možno sa
            pomýlili v adrese alebo otázka už nie je dostupná.
          </p>

          {/* Actions */}
          <div className="question-not-found__actions">
            <Link
              href={`${basePath}/questions`}
              className="question-not-found__btn question-not-found__btn--primary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Všetky otázky
            </Link>

            <Link
              href={`${basePath}/ask`}
              className="question-not-found__btn question-not-found__btn--secondary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Zadať otázku
            </Link>
          </div>

          {/* Help Text */}
          <div className="question-not-found__help">
            <p>
              <strong>Hľadáte niečo konkrétne?</strong>
              <br />
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

          .question-not-found__btn {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .question-not-found__content {
            padding: 24px 16px;
          }

          .question-not-found__title {
            font-size: 24px;
          }

          .question-not-found__btn {
            padding: 10px 20px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
