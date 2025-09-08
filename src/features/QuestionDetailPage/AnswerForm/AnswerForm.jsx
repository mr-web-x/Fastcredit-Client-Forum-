// Файл: src/features/QuestionDetailPage/AnswerForm/AnswerForm.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import "./AnswerForm.scss";

export default function AnswerForm({
  question,
  user,
  onSubmit,
  onCancel,
  initialContent = "",
}) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [errors, setErrors] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved"); // saved, saving, error

  const textareaRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Автофокус при открытии формы
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Загружаем черновик из localStorage если есть
    const draftKey = `answer-draft-${question._id || question.id}-${user._id}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !initialContent) {
      setContent(savedDraft);
      setIsDraft(true);
    }
  }, [question._id, question.id, user._id, initialContent]);

  // Автосохранение черновика
  useEffect(() => {
    if (content.trim() && content !== initialContent) {
      setAutoSaveStatus("saving");

      // Очищаем предыдущий таймер
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Устанавливаем новый таймер на 2 секунды
      autoSaveTimeoutRef.current = setTimeout(() => {
        try {
          const draftKey = `answer-draft-${question._id || question.id}-${
            user._id
          }`;
          localStorage.setItem(draftKey, content);
          setAutoSaveStatus("saved");
          setIsDraft(true);
        } catch (error) {
          setAutoSaveStatus("error");
          console.error("Failed to save draft:", error);
        }
      }, 2000);
    }

    // Cleanup
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, question._id, question.id, user._id, initialContent]);

  // Валидация
  const validateForm = () => {
    const newErrors = {};

    if (!content.trim()) {
      newErrors.content = "Obsah odpovede je povinný";
    } else if (content.trim().length < 50) {
      newErrors.content = "Odpoveď musí mať aspoň 50 znakov";
    } else if (content.trim().length > 10000) {
      newErrors.content = "Odpoveď môže mať maximálne 10 000 znakov";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        content: content.trim(),
        questionId: question._id || question.id,
      });

      // Очищаем черновик после успешной отправки
      const draftKey = `answer-draft-${question._id || question.id}-${
        user._id
      }`;
      localStorage.removeItem(draftKey);
      setIsDraft(false);

      // Очищаем форму
      setContent("");
      setErrors({});
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setErrors({ submit: "Nepodarilo sa odoslať odpoveď. Skúste to znovu." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    if (content.trim() && content !== initialContent) {
      if (confirm("Naozaj chcete zrušiť? Neuložené zmeny sa stratia.")) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  // Очистка черновика
  const handleClearDraft = () => {
    if (confirm("Naozaj chcete vymazať uložený koncept?")) {
      setDraftContent("");
      setContent("");
      setIsDraft(false);
    }
  };

  // Вставка форматирования
  const insertFormatting = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newContent);

    // Восстанавливаем фокус и позицию курсора
    setTimeout(() => {
      textarea.focus();
      const newCursorPos =
        start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Обработчик горячих клавиш
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (!isSubmitting) handleSubmit(e);
          break;
        case "b":
          e.preventDefault();
          insertFormatting("**", "**");
          break;
        case "i":
          e.preventDefault();
          insertFormatting("*", "*");
          break;
        case "k":
          e.preventDefault();
          insertFormatting("[", "](url)");
          break;
      }
    }
  };

  // Рендер статуса автосохранения
  const renderAutoSaveStatus = () => {
    switch (autoSaveStatus) {
      case "saving":
        return (
          <span className="answer-form__autosave answer-form__autosave--saving">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Ukladá sa...
          </span>
        );
      case "saved":
        return content.trim() ? (
          <span className="answer-form__autosave answer-form__autosave--saved">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Uložené
          </span>
        ) : null;
      case "error":
        return (
          <span className="answer-form__autosave answer-form__autosave--error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            Chyba ukladania
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="answer-form">
      <div className="answer-form__header">
        <div className="answer-form__title-section">
          <h3 className="answer-form__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Vaša expertná odpoveď
          </h3>
          <div className="answer-form__meta">
            {renderAutoSaveStatus()}
            {isDraft && (
              <button
                type="button"
                onClick={handleClearDraft}
                className="answer-form__clear-draft"
                title="Vymazať uložený koncept"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
                Vymazať koncept
              </button>
            )}
          </div>
        </div>

        <div className="answer-form__question-context">
          <h4>Otázka:</h4>
          <p>"{question.title}"</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="answer-form__form">
        {/* Toolbar */}
        <div className="answer-form__toolbar">
          <div className="answer-form__formatting">
            <button
              type="button"
              onClick={() => insertFormatting("**", "**")}
              className="answer-form__format-btn"
              title="Tučné (Ctrl+B)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => insertFormatting("*", "*")}
              className="answer-form__format-btn"
              title="Kurzíva (Ctrl+I)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
              </svg>
            </button>

            <div className="answer-form__separator"></div>

            <button
              type="button"
              onClick={() => insertFormatting("- ", "")}
              className="answer-form__format-btn"
              title="Zoznam"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => insertFormatting("[", "](url)")}
              className="answer-form__format-btn"
              title="Odkaz (Ctrl+K)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => insertFormatting("> ", "")}
              className="answer-form__format-btn"
              title="Citácia"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
              </svg>
            </button>
          </div>

          <div className="answer-form__view-toggle">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`answer-form__toggle-btn ${
                !showPreview ? "answer-form__toggle-btn--active" : ""
              }`}
            >
              Editovať
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`answer-form__toggle-btn ${
                showPreview ? "answer-form__toggle-btn--active" : ""
              }`}
            >
              Náhľad
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="answer-form__content">
          {showPreview ? (
            <div className="answer-form__preview">
              {content.trim() ? (
                <div
                  className="answer-form__preview-content"
                  dangerouslySetInnerHTML={{
                    __html: content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(
                        /\[(.*?)\]\((.*?)\)/g,
                        '<a href="$2" target="_blank" rel="noopener">$1</a>'
                      )
                      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
                      .replace(/^- (.+)$/gm, "<li>$1</li>")
                      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
                      .replace(/\n/g, "<br>"),
                  }}
                />
              ) : (
                <div className="answer-form__preview-empty">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                  </svg>
                  <p>Napíšte svoju odpoveď pre zobrazenie náhľadu</p>
                </div>
              )}
            </div>
          ) : (
            <div className="answer-form__editor">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Napíšte svoju expertná odpoveď... 

Tipy:
• Buďte jasní a konkrétni
• Uveďte príklady alebo odkazy na zdroje  
• Používajte Markdown formátovanie (** tučné **, * kurzíva *)
• Ctrl+Enter pre odoslanie"
                className={`answer-form__textarea ${
                  errors.content ? "answer-form__textarea--error" : ""
                }`}
                disabled={isSubmitting}
                rows={12}
              />

              {errors.content && (
                <div className="answer-form__error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {errors.content}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Character Count */}
        <div className="answer-form__stats">
          <span
            className={`answer-form__char-count ${
              content.length > 10000
                ? "answer-form__char-count--error"
                : content.length > 8000
                ? "answer-form__char-count--warning"
                : ""
            }`}
          >
            {content.length} / 10 000 znakov
          </span>

          {content.trim() && (
            <span className="answer-form__word-count">
              {content.trim().split(/\s+/).length} slov
            </span>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="answer-form__submit-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div className="answer-form__actions">
          <div className="answer-form__help">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span>
              Vaša odpoveď bude viditeľná všetkým používateľom po schválení.
            </span>
          </div>

          <div className="answer-form__buttons">
            <button
              type="button"
              onClick={handleCancel}
              className="answer-form__cancel"
              disabled={isSubmitting}
            >
              Zrušiť
            </button>

            <button
              type="submit"
              className="answer-form__submit"
              disabled={isSubmitting || !content.trim() || content.length < 50}
            >
              {isSubmitting ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="answer-form__spinner"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v6z" />
                  </svg>
                  Odosiela sa...
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  Odoslať odpoveď
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
