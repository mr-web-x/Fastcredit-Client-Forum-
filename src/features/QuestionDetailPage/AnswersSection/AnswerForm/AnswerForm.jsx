// Файл: src/features/QuestionDetailPage/AnswersSection/AnswerForm/AnswerForm.jsx

"use client";

import { useState, useRef } from "react";
import { useOptimisticForm } from "@/src/hooks/useOptimisticUpdates";
import "./AnswerForm.scss";

export default function AnswerForm({ question, user, onSubmit, onCancel }) {
  const textareaRef = useRef(null);

  // Используем наш хук для управления формой
  const form = useOptimisticForm({
    content: "",
  });

  // Обработчик отправки
  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = form.values.content.trim();
    if (!content || content.length < 50) {
      form.setError("content", "Odpoveď musí mať aspoň 50 znakov");
      return;
    }

    if (content.length > 5000) {
      form.setError("content", "Odpoveď môže mať maximálne 5000 znakov");
      return;
    }

    try {
      await form.submit(async (values) => await onSubmit(values));
    } catch (error) {
      console.error("Answer submission failed:", error);
    }
  };

  const characterCount = form.values.content.length;
  const isValid = characterCount >= 50 && characterCount <= 5000;

  return (
    <div className="answer-form">
      {/* Заголовок */}
      <div className="answer-form__header">
        <h3>Vaša odpoveď</h3>
      </div>

      <form onSubmit={handleSubmit} className="answer-form__form">
        {/* Textarea */}
        <div className="answer-form__input-container">
          <textarea
            ref={textareaRef}
            className={`answer-form__textarea ${
              form.errors.content ? "answer-form__textarea--error" : ""
            }`}
            value={form.values.content}
            onChange={(e) => form.setValue("content", e.target.value)}
            placeholder="Napíšte svoju podrobnú odpoveď... (minimálne 50 znakov)"
            rows={6}
            disabled={form.isSubmitting}
          />

          {/* Счетчик символов */}
          <div
            className={`answer-form__character-count ${
              !isValid ? "answer-form__character-count--invalid" : ""
            }`}
          >
            {characterCount}/5000
            {characterCount < 50 && (
              <span className="answer-form__character-help">
                Potrebných ešte {50 - characterCount} znakov
              </span>
            )}
          </div>
        </div>

        {/* Ошибки */}
        {form.errors.content && (
          <div className="answer-form__error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {form.errors.content}
          </div>
        )}

        {form.errors.general && (
          <div className="answer-form__error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {form.errors.general}
          </div>
        )}

        {/* Footer с кнопками */}
        <div className="answer-form__footer">
          <button
            type="button"
            onClick={onCancel}
            className="answer-form__cancel-btn"
            disabled={form.isSubmitting}
          >
            Zrušiť
          </button>

          <button
            type="submit"
            className="answer-form__submit-btn"
            disabled={
              !form.values.content.trim() || !isValid || form.isSubmitting
            }
          >
            {form.isSubmitting ? "Odosiela sa..." : "Odoslať odpoveď"}
          </button>
        </div>
      </form>
    </div>
  );
}
