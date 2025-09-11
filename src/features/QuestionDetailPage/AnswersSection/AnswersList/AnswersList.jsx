// Файл: src/features/QuestionDetailPage/AnswersSection/AnswersList/AnswersList.jsx

"use client";

import AnswerItem from "../AnswerItem/AnswerItem";
import "./AnswersList.scss";

export default function AnswersList({
  answers = [],
  question,
  user,
  permissions,
}) {
  if (answers.length === 0) {
    return (
      <div className="answers-list answers-list--empty">
        <div className="answers-list__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
          </svg>
          <h4>Zatiaľ žiadne odpovede</h4>
          <p>Buďte prvý, kto odpovie na túto otázku!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="answers-list">
      {/* Остальные ответы */}
      {answers.length > 0 && (
        <div className="answers-list__other-section">
          {answers.map((answer) => (
            <AnswerItem
              key={answer._id}
              answer={answer}
              question={question}
              user={user}
              permissions={permissions}
            />
          ))}
        </div>
      )}

      {/* Статистика в конце */}
      <div className="answers-list__footer">
        <div className="answers-list__stats">
          <div className="answers-list__stat-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
            </svg>
            <span>
              {answers.length} {answers.length === 1 ? "odpoveď" : "odpovedí"}
            </span>
          </div>

          {answers.filter((a) => a.expert?.role === "expert").length > 0 && (
            <div className="answers-list__stat-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>
                {answers.filter((a) => a.expert?.role === "expert").length} od
                expertov
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
