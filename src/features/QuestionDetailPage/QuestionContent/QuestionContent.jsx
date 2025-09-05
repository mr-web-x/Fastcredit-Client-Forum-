// Файл: src/features/QuestionDetailPage/QuestionContent/QuestionContent.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { basePath } from "@/src/constants/config";
import "./QuestionContent.scss";

export default function QuestionContent({ question, user, permissions }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(question.content || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Обработчик сохранения изменений
  const handleSave = async () => {
    if (!editedContent.trim() || isUpdating) return;

    setIsUpdating(true);
    try {
      // Здесь будет API вызов для обновления вопроса
      // await questionsService.updateQuestion(question._id, { content: editedContent });

      // Обновляем локальное состояние
      question.content = editedContent;
      setIsEditing(false);

      // Можно показать success toast
      console.log("Question updated successfully");
    } catch (error) {
      console.error("Failed to update question:", error);
      // Можно показать error toast
    } finally {
      setIsUpdating(false);
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    setEditedContent(question.content || "");
    setIsEditing(false);
  };

  // Функция для безопасного рендеринга HTML контента
  const renderContent = (content) => {
    if (!content) return null;

    // В реальном проекте здесь должна быть санитизация HTML
    // Для примера используем простой dangerouslySetInnerHTML
    return {
      __html: content,
    };
  };

  // Извлечение тегов из контента или отдельного поля
  const getTags = () => {
    // Если теги хранятся отдельно
    if (question.tags && Array.isArray(question.tags)) {
      return question.tags;
    }

    // Или извлекаем из категории
    const tags = [];
    if (question.category) {
      tags.push(question.category);
    }

    // Можно добавить автоматические теги на основе контента
    const content = question.content?.toLowerCase() || "";
    if (content.includes("úver") || content.includes("pôžička")) {
      tags.push("úvery");
    }
    if (content.includes("banka") || content.includes("účet")) {
      tags.push("banky");
    }
    if (content.includes("poistenie") || content.includes("poistka")) {
      tags.push("poistenie");
    }
    if (content.includes("investícia") || content.includes("sporenie")) {
      tags.push("investície");
    }

    return [...new Set(tags)]; // Убираем дубликаты
  };

  const tags = getTags();

  return (
    <div className="question-content">
      {/* Content Header */}
      <div className="question-content__header">
        <h2 className="question-content__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
          </svg>
          Obsah otázky
        </h2>

        {permissions.canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="question-content__edit-btn"
            title="Upraviť obsah otázky"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Upraviť
          </button>
        )}
      </div>

      {/* Content Body */}
      <div className="question-content__body">
        {isEditing ? (
          <div className="question-content__editor">
            <div className="question-content__editor-header">
              <h3>Upraviť obsah otázky</h3>
              <p>
                Upresni svoju otázku, pridaj viac detailov alebo oprav chyby.
              </p>
            </div>

            <textarea
              className="question-content__textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Opíšte svoju otázku podrobne..."
              rows={8}
              disabled={isUpdating}
            />

            <div className="question-content__editor-footer">
              <div className="question-content__editor-help">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span>
                  Buďte jasní a konkrétni vo svojom popise. Čím viac detailov,
                  tým lepšie odpovede dostanete.
                </span>
              </div>

              <div className="question-content__editor-actions">
                <button
                  onClick={handleCancel}
                  className="question-content__cancel-btn"
                  disabled={isUpdating}
                >
                  Zrušiť
                </button>
                <button
                  onClick={handleSave}
                  className="question-content__save-btn"
                  disabled={!editedContent.trim() || isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="question-content__loading"
                      >
                        <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6z" />
                      </svg>
                      Ukladanie...
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                      </svg>
                      Uložiť zmeny
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="question-content__text">
            {question.content ? (
              <div
                className="question-content__html"
                dangerouslySetInnerHTML={renderContent(question.content)}
              />
            ) : (
              <div className="question-content__empty">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                </svg>
                <p>Táto otázka nemá podrobný popis.</p>
                {permissions.canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="question-content__add-description"
                  >
                    Pridať popis
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="question-content__tags">
          <h3 className="question-content__tags-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 2 2 2h11c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
            </svg>
            Súvisiace témy
          </h3>
          <div className="question-content__tags-list">
            {tags.map((tag, index) => (
              <Link
                key={index}
                href={`${basePath}/questions?tag=${encodeURIComponent(tag)}`}
                className="question-content__tag"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 2 2 2h11c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
                </svg>
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Question Metadata */}
      <div className="question-content__metadata">
        <div className="question-content__metadata-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          <span>
            Vytvorené{" "}
            {new Date(question.createdAt).toLocaleDateString("sk-SK", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {question.updatedAt && question.updatedAt !== question.createdAt && (
          <div className="question-content__metadata-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            <span>
              Upravené{" "}
              {new Date(question.updatedAt).toLocaleDateString("sk-SK", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        <div className="question-content__metadata-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          <span>{question.views || 0} zobrazení</span>
        </div>

        {question.lastActivity && (
          <div className="question-content__metadata-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
            </svg>
            <span>
              Posledná aktivita{" "}
              {new Date(question.lastActivity).toLocaleDateString("sk-SK", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
