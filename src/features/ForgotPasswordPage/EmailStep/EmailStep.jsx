// Файл: src/features/ForgotPasswordPage/EmailStep/EmailStep.jsx

"use client";

import { useEffect, useActionState } from "react";
import { forgotPasswordAction } from "@/app/actions/auth";
import "./EmailStep.scss";

export default function EmailStep({ onSuccess }) {
  // Собственный useActionState для forgotPasswordAction
  const [formState, formAction, isPending] = useActionState(
    forgotPasswordAction,
    {
      success: false,
      error: null,
      message: null,
      fieldErrors: null,
      step: null,
      email: null,
    }
  );

  // Отслеживаем успешную отправку кода
  useEffect(() => {
    if (
      formState?.success &&
      formState?.step === "verification" &&
      formState?.email
    ) {
      onSuccess(formState.email);
    }
  }, [formState?.success, formState?.step, formState?.email, onSuccess]);

  return (
    <div className="email-step">
      <form action={formAction} className="email-step__form">
        {/* Общая ошибка */}
        {formState?.error && (
          <div className="email-step__error email-step__error--general">
            {formState.error}
          </div>
        )}

        {/* Success сообщение */}
        {formState?.message && !formState?.error && (
          <div className="email-step__success">{formState.message}</div>
        )}

        <div className="email-step__field">
          <label htmlFor="email" className="email-step__label">
            Emailová adresa *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="napr. jan@example.com"
            className={`email-step__input ${
              formState?.fieldErrors?.email ? "email-step__input--error" : ""
            }`}
            disabled={isPending}
            autoComplete="email"
            autoFocus
            required
            aria-describedby={
              formState?.fieldErrors?.email ? "email-error" : undefined
            }
          />
          {formState?.fieldErrors?.email && (
            <div id="email-error" className="email-step__field-error">
              {formState.fieldErrors.email}
            </div>
          )}
          <div className="email-step__field-help">
            Zadajte email, ktorý ste použili pri registrácii
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="email-step__submit"
          aria-busy={isPending}
        >
          {isPending ? "Odosielanie..." : "Odoslať kód"}
        </button>
      </form>
    </div>
  );
}
