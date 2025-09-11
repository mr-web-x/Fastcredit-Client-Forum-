// Файл: src/features/QuestionDetailPage/AnswersSection/AnswersSection.jsx

"use client";

import { useState } from "react";
import AnswerForm from "./AnswerForm/AnswerForm";
import AnswersList from "./AnswersList/AnswersList";
import "./AnswersSection.scss";

export default function AnswersSection({
  answers = [],
  question,
  user,
  permissions,
}) {
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);
  const hasAnswers = answers.length > 0;
  const hasUserAnswer = answers.some(
    (answer) => answer.expert?._id === user?.id
  );
  const canAnswer = permissions.canAnswer && !hasUserAnswer;
  const isNotExpert = user && !permissions.canAnswer; // Пользователь есть, но не эксперт
  const alreadyAnswered = user && permissions.canAnswer && hasUserAnswer; // Эксперт уже ответил

  return (
    <div className="answers-section">
      {/* Заголовок секции */}
      <div className="answers-section__header">
        <div className="answers-section__title-area">
          <h2 className="answers-section__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
            </svg>
            Odpovede {hasAnswers && `(${answers.length})`}
          </h2>
        </div>

        {/* Кнопка добавления ответа */}
        {canAnswer && !isAnswerFormOpen && (
          <button
            onClick={() => setIsAnswerFormOpen(true)}
            className="answers-section__add-btn"
            title="Pridať odpoveď"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Odpovedať
          </button>
        )}
      </div>

      {/* Форма ответа */}
      {canAnswer && isAnswerFormOpen && (
        <div className="answers-section__form">
          <AnswerForm
            question={question}
            onCancel={() => setIsAnswerFormOpen(false)}
          />
        </div>
      )}

      {/* Информация о правах на ответы */}
      {!canAnswer && (
        <div className="answers-section__permission-info">
          <div className="answers-section__permission-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div>
              {hasUserAnswer ? (
                // Эксперт уже ответил
                <>
                  <h4>Už ste odpovedali na túto otázku</h4>
                  <p>
                    Na jednu otázku môžete odpovedať iba raz. Svoju odpoveď
                    môžete upraviť kliknutím na tlačidlo "Upraviť".
                  </p>
                </>
              ) : (
                // Не эксперт
                <>
                  <h4>Iba experti môžu odpovedať</h4>
                  <p>
                    Na otázky môžu odpovedať iba overení experti a právnici. Ak
                    ste expert v tejto oblasti, môžete sa prihlásiť ako poradca.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Список ответов */}
      {hasAnswers ? (
        <div className="answers-section__list">
          <AnswersList
            answers={answers}
            question={question}
            user={user}
            permissions={permissions}
          />
        </div>
      ) : (
        <div className="answers-section__empty">
          <div className="answers-section__empty-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
            </svg>
            <h3>Zatiaľ žiadne odpovede</h3>
            <p>
              {canAnswer
                ? "Buďte prvý, kto odpovie na túto otázku!"
                : "Čaká sa na odpovede od expertov."}
            </p>

            {canAnswer && !isAnswerFormOpen && (
              <button
                onClick={() => setIsAnswerFormOpen(true)}
                className="answers-section__empty-cta"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Pridať prvú odpoveď
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
