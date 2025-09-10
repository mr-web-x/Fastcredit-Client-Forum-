// Файл: src/features/QuestionDetailPage/AnswersSection/AnswersList/AnswersList.jsx

"use client";

import { useState } from "react";
import AnswerItem from "../AnswerItem/AnswerItem";
import "./AnswersList.scss";

export default function AnswersList({
  answers = [],
  question,
  user,
  permissions,
  onAnswerLike,
  onAcceptAnswer,
}) {
  const [expandedAnswers, setExpandedAnswers] = useState(new Set());

  // Группировка ответов
  const bestAnswer = answers.find((answer) => answer.isBest);
  const otherAnswers = answers.filter((answer) => !answer.isBest);

  // Показать/скрыть полный текст ответа
  const toggleAnswerExpansion = (answerId) => {
    const newExpanded = new Set(expandedAnswers);
    if (newExpanded.has(answerId)) {
      newExpanded.delete(answerId);
    } else {
      newExpanded.add(answerId);
    }
    setExpandedAnswers(newExpanded);
  };

  // Проверка длины ответа для сокращения
  const shouldTruncateAnswer = (content) => {
    return content && content.length > 500; // Если больше 500 символов
  };

  // Получение превью текста
  const getPreviewContent = (content, isExpanded) => {
    if (!content) return "";

    if (!shouldTruncateAnswer(content) || isExpanded) {
      return content;
    }

    return content.substring(0, 400) + "...";
  };

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
      {/* Лучший ответ */}
      {bestAnswer && (
        <div className="answers-list__best-section">
          <div className="answers-list__section-header">
            <h4 className="answers-list__section-title">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Najlepšia odpoveď
            </h4>
            <span className="answers-list__section-badge">
              Vybraná autorom otázky
            </span>
          </div>

          <AnswerItem
            answer={bestAnswer}
            question={question}
            user={user}
            permissions={permissions}
            onLike={() => onAnswerLike(bestAnswer._id)}
            onAcceptAnswer={() => onAcceptAnswer(bestAnswer._id)}
            isExpanded={expandedAnswers.has(bestAnswer._id)}
            shouldTruncate={shouldTruncateAnswer(bestAnswer.content)}
            previewContent={getPreviewContent(
              bestAnswer.content,
              expandedAnswers.has(bestAnswer._id)
            )}
            onToggleExpansion={() => toggleAnswerExpansion(bestAnswer._id)}
            isBest={true}
          />
        </div>
      )}

      {/* Разделитель между лучшим и остальными ответами */}
      {bestAnswer && otherAnswers.length > 0 && (
        <div className="answers-list__divider">
          <span className="answers-list__divider-text">
            Ostatné odpovede ({otherAnswers.length})
          </span>
        </div>
      )}

      {/* Остальные ответы */}
      {otherAnswers.length > 0 && (
        <div className="answers-list__other-section">
          {otherAnswers.map((answer, index) => (
            <AnswerItem
              key={answer._id}
              answer={answer}
              question={question}
              user={user}
              permissions={permissions}
              onLike={() => onAnswerLike(answer._id)}
              onAcceptAnswer={() => onAcceptAnswer(answer._id)}
              isExpanded={expandedAnswers.has(answer._id)}
              shouldTruncate={shouldTruncateAnswer(answer.content)}
              previewContent={getPreviewContent(
                answer.content,
                expandedAnswers.has(answer._id)
              )}
              onToggleExpansion={() => toggleAnswerExpansion(answer._id)}
              isBest={false}
              isLast={index === otherAnswers.length - 1}
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

          {answers.filter((a) => a.author?.role === "expert").length > 0 && (
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
                {answers.filter((a) => a.author?.role === "expert").length} od
                expertov
              </span>
            </div>
          )}

          <div className="answers-list__stat-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>
              {answers.reduce(
                (total, answer) => total + (answer.likes || 0),
                0
              )}{" "}
              lajkov celkovo
            </span>
          </div>
        </div>

        {/* Информация для автора вопроса */}
        {user && permissions.canAcceptAnswer && !bestAnswer && (
          <div className="answers-list__author-tip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span>
              Môžete označiť jednu odpoveď ako najlepšiu kliknutím na ✓
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
