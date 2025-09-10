// Файл: src/features/QuestionDetailPage/QuestionContent/QuestionContent.jsx

"use client";

import { useState } from "react";
import { updateQuestionAction } from "@/app/actions/questions";
import "./QuestionContent.scss";

export default function QuestionContent({ question, user, permissions }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(question.content || "");
  const [editedTitle, setEditedTitle] = useState(question.title || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // Проверяем можем ли мы редактировать
  const canEdit = permissions.canEdit;

  // Обработчик начала редактирования
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedTitle(question.title || "");
    setEditedContent(question.content || "");
    setError("");
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(question.title || "");
    setEditedContent(question.content || "");
    setError("");
  };

  // Обработчик сохранения изменений
  const handleSave = async () => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      setError("Názov a obsah otázky sú povinné");
      return;
    }

    if (editedTitle.length < 10) {
      setError("Názov musí mať aspoň 10 znakov");
      return;
    }

    if (editedContent.length < 50) {
      setError("Obsah musí mať aspoň 50 znakov");
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const result = await updateQuestionAction(question._id, {
        title: editedTitle.trim(),
        content: editedContent.trim(),
      });

      if (result.success) {
        setIsEditing(false);
        // Данные обновятся через revalidatePath в action
        // TODO: показать успешное уведомление
      } else {
        setError(result.error || "Nepodarilo sa aktualizovať otázku");
      }
    } catch (error) {
      console.error("Failed to update question:", error);
      setError("Chyba servera pri aktualizácii otázky");
    } finally {
      setIsUpdating(false);
    }
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    }
  };

  return (
    <div className="question-content">
      {isEditing ? (
        // РЕЖИМ РЕДАКТИРОВАНИЯ
        <div className="question-content__editor">
          <div className="question-content__editor-header">
            <h3>Upraviť otázku</h3>
            <p>Upresni svoju otázku, pridaj viac detailov alebo oprav chyby.</p>
          </div>

          {/* Редактирование заголовка */}
          <div className="question-content__field">
            <label htmlFor="edit-title" className="question-content__label">
              Názov otázky
            </label>
            <input
              id="edit-title"
              type="text"
              className="question-content__title-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Stručný a výstižný názov otázky..."
              disabled={isUpdating}
              onKeyDown={handleKeyDown}
            />
            <div className="question-content__field-help">
              Minimálne 10 znakov, maximálne 200 znakov
            </div>
          </div>

          {/* Редактирование контента */}
          <div className="question-content__field">
            <label htmlFor="edit-content" className="question-content__label">
              Obsah otázky
            </label>
            <textarea
              id="edit-content"
              className="question-content__textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Opíšte svoju otázku podrobne..."
              rows={8}
              disabled={isUpdating}
              onKeyDown={handleKeyDown}
            />
            <div className="question-content__field-help">
              Minimálne 50 znakov, maximálne 5000 znakov. Čím viac detailov, tým
              lepšie odpovede dostanete.
            </div>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="question-content__error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {error}
            </div>
          )}

          {/* Кнопки действий */}
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
              disabled={
                !editedTitle.trim() || !editedContent.trim() || isUpdating
              }
            >
              {isUpdating ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Ukladá sa...
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                  </svg>
                  Uložiť
                </>
              )}
            </button>
          </div>

          {/* Подсказка о горячих клавишах */}
          <div className="question-content__shortcuts">
            <span>💡 Ctrl+Enter pre uloženie, Esc pre zrušenie</span>
          </div>
        </div>
      ) : (
        // РЕЖИМ ПРОСМОТРА
        <div className="question-content__display">
          {/* Заголовок с кнопкой редактирования */}
          <div className="question-content__header">
            <h1 className="question-content__title">{question.title}</h1>

            {canEdit && (
              <button
                onClick={handleStartEdit}
                className="question-content__edit-btn"
                title="Upraviť otázku"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Upraviť
              </button>
            )}
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
      )}
    </div>
  );
}
