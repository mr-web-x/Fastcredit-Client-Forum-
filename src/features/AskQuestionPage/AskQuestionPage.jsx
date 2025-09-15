// Файл: src/features/AskQuestionPage/AskQuestionPage.jsx

"use client";

import { useActionState } from "react";
import { createQuestionAction } from "@/app/actions/questions";
import "./AskQuestionPage.scss";

export default function AskQuestionPage({ user }) {
  const [state, formAction, isPending] = useActionState(createQuestionAction, {
    success: false,
    error: null,
    message: null,
    fieldErrors: null,
    questionSlug: null,
  });

  return (
    <div className="ask-question-page">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="ask-question-page__breadcrumbs">
          <a href="/" className="ask-question-page__breadcrumb-link">
            FastCredit
          </a>
          <span className="ask-question-page__breadcrumb-separator">›</span>
          <a href="/forum" className="ask-question-page__breadcrumb-link">
            Fórum
          </a>
          <span className="ask-question-page__breadcrumb-separator">›</span>
          <span className="ask-question-page__breadcrumb-current">
            Nová otázka
          </span>
        </nav>

        {/* Заголовок страницы */}
        <div className="ask-question-page__header">
          <h1 className="ask-question-page__title">Zadať novú otázku</h1>
          <p className="ask-question-page__subtitle">
            Spýtajte sa našich expertov na finančné otázky a získajte
            profesionálne poradenstvo
          </p>
        </div>

        {/* Success message */}
        {state?.success && (
          <div className="ask-question-page__success-banner">
            <div className="ask-question-page__success-content">
              <span className="ask-question-page__success-icon">✅</span>
              <div>
                <strong>Otázka bola úspešne vytvorená!</strong>
                <p>{state.message}</p>
                {state.questionSlug && (
                  <a
                    href={`/forum/questions/${state.questionSlug}`}
                    className="ask-question-page__success-link"
                  >
                    Zobraziť otázku →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Форма создания вопроса */}
        <form action={formAction} className="ask-question-page__form">
          {/* Общая ошибка */}
          {state?.error && (
            <div className="ask-question-page__error-banner">
              <span className="ask-question-page__error-icon">⚠️</span>
              <div>
                <strong>Chyba pri vytváraní otázky</strong>
                <p>{state.error}</p>
              </div>
            </div>
          )}

          {/* Заголовок вопроса */}
          <div className="ask-question-page__field">
            <label htmlFor="title" className="ask-question-page__label">
              Názov otázky *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Ako získať úver s negatívnou históriou?"
              className={`ask-question-page__input ${
                state?.fieldErrors?.title
                  ? "ask-question-page__input--error"
                  : ""
              }`}
              disabled={isPending}
              maxLength={200}
              required
            />
            {state?.fieldErrors?.title && (
              <div className="ask-question-page__field-error">
                {state.fieldErrors.title}
              </div>
            )}
            <div className="ask-question-page__field-help">
              Maximálne 200 znakov. Buďte konkrétni a jasní.
            </div>
          </div>

          {/* Категория */}
          <div className="ask-question-page__field">
            <label htmlFor="category" className="ask-question-page__label">
              Kategória *
            </label>
            <select
              id="category"
              name="category"
              className={`ask-question-page__select ${
                state?.fieldErrors?.category
                  ? "ask-question-page__select--error"
                  : ""
              }`}
              disabled={isPending}
              required
            >
              <option value="" disabled>
                Vyberte kategóriu
              </option>
              <option value="expert">Otázka pre experta</option>
              <option value="lawyer">Otázka pre advokáta</option>
            </select>
            {state?.fieldErrors?.category && (
              <div className="ask-question-page__field-error">
                {state.fieldErrors.category}
              </div>
            )}
          </div>

          {/* Приоритет */}
          <div className="ask-question-page__field">
            <label className="ask-question-page__label">Priorita</label>
            <div className="ask-question-page__radio-group">
              <label className="ask-question-page__radio-option">
                <input
                  type="radio"
                  name="priority"
                  value="medium"
                  defaultChecked
                  disabled={isPending}
                />
                <span className="ask-question-page__radio-label">Normálna</span>
              </label>
              <label className="ask-question-page__radio-option">
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  disabled={isPending}
                />
                <span className="ask-question-page__radio-label">Vysoká</span>
              </label>
              <label className="ask-question-page__radio-option">
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  disabled={isPending}
                />
                <span className="ask-question-page__radio-label">Urgentná</span>
              </label>
            </div>
          </div>

          {/* Содержимое вопроса */}
          <div className="ask-question-page__field">
            <label htmlFor="content" className="ask-question-page__label">
              Podrobný popis otázky *
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Opíšte svoju situáciu podrobne. Čím viac informácií poskytnete, tým lepšie vám experti budú môcť poradiť..."
              className={`ask-question-page__textarea ${
                state?.fieldErrors?.content
                  ? "ask-question-page__textarea--error"
                  : ""
              }`}
              disabled={isPending}
              rows={8}
              minLength={50}
              maxLength={5000}
              required
            />
            {state?.fieldErrors?.content && (
              <div className="ask-question-page__field-error">
                {state.fieldErrors.content}
              </div>
            )}
            <div className="ask-question-page__field-help">
              Minimálne 50 znakov, maximálne 5000 znakov
            </div>
          </div>

          {/* Кнопка отправки */}
          <div className="ask-question-page__actions">
            <button
              type="submit"
              disabled={isPending}
              className={`ask-question-page__submit-btn ${
                isPending ? "ask-question-page__submit-btn--loading" : ""
              }`}
            >
              {isPending ? (
                <>
                  <span className="ask-question-page__loading-spinner"></span>
                  Vytvára sa...
                </>
              ) : (
                <>
                  <span>📤</span>
                  Publikovať otázku
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
