// Файл: src/features/QuestionDetailPage/QuestionContent/QuestionContent.jsx

"use client";

import "./QuestionContent.scss";

export default function QuestionContent({ question }) {
  return (
    <div className="question-content">
      <div className="question-content__display">
        {/* Заголовок с кнопкой редактирования */}
        <div className="question-content__header">
          <h1 className="question-content__title">{question.title}</h1>
        </div>

        {/* Контент вопроса */}
        <div className="question-content__body">
          <div className="question-content__text">
            {question.content ? (
              question.content
                .split("\n")
                .map((paragraph, index) =>
                  paragraph.trim() ? (
                    <p key={index}>{paragraph}</p>
                  ) : (
                    <br key={index} />
                  )
                )
            ) : (
              <p className="question-content__text--empty">
                Obsah otázky nebol zadaný.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
