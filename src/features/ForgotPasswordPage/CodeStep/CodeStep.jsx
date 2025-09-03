// Файл: src/features/ForgotPasswordPage/CodeStep/CodeStep.jsx

"use client";

import { useState, useEffect, useActionState } from "react";
import { verifyResetCodeAction } from "@/app/actions/auth";
import "./CodeStep.scss";

export default function CodeStep({ email, onSuccess, onBack }) {
  // Собственный useActionState для verifyResetCodeAction
  const [formState, formAction, isPending] = useActionState(
    verifyResetCodeAction,
    {
      success: false,
      error: null,
      message: null,
      fieldErrors: null,
      step: null,
      code: null,
    }
  );

  const [code, setCode] = useState("");

  // Отслеживаем успешную верификацию кода
  useEffect(() => {
    if (
      formState?.success &&
      formState?.step === "password" &&
      formState?.code
    ) {
      onSuccess(formState.code);
    }
  }, [formState?.success, formState?.step, formState?.code, onSuccess]);

  return (
    <div className="code-step">
      {/* Email recap */}
      <div className="code-step__email-recap">
        <span className="code-step__email-label">Email:</span>
        <span className="code-step__email-value">{email}</span>
        <button
          type="button"
          onClick={onBack}
          className="code-step__change-email"
          disabled={isPending}
        >
          Zmeniť
        </button>
      </div>

      {/* Form */}
      <form action={formAction} className="code-step__form">
        <input type="hidden" name="email" value={email} />

        {/* Errors */}
        {formState?.error && (
          <div className="code-step__error">{formState.error}</div>
        )}

        {/* Success message */}
        {formState?.message && !formState?.error && (
          <div className="code-step__success">{formState.message}</div>
        )}

        <div className="code-step__field">
          <label htmlFor="code" className="code-step__label">
            Overovací kód *
          </label>
          <input
            id="code"
            type="text"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            placeholder="Zadajte 6-miestny kód"
            className={`code-step__input ${
              formState?.fieldErrors?.code ? "code-step__input--error" : ""
            }`}
            disabled={isPending}
            maxLength={6}
            autoFocus
            required
            aria-describedby={
              formState?.fieldErrors?.code ? "code-error" : undefined
            }
          />
          {formState?.fieldErrors?.code && (
            <div id="code-error" className="code-step__field-error">
              {formState.fieldErrors.code}
            </div>
          )}
          <div className="code-step__field-help">
            Zadajte kód ktorý ste dostali v emaili
          </div>
        </div>

        <button
          type="submit"
          disabled={code.length < 4 || isPending}
          className="code-step__submit"
          aria-busy={isPending}
        >
          {isPending ? "Overovanie..." : "Overiť kód"}
        </button>
      </form>

      {/* Back button */}
      <div className="code-step__footer">
        <button
          type="button"
          onClick={onBack}
          className="code-step__back-btn"
          disabled={isPending}
        >
          ← Späť na zadanie emailu
        </button>
      </div>
    </div>
  );
}
