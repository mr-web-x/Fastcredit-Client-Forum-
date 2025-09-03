// Файл: src/features/RegisterPage/VerificationForm/VerificationForm.jsx

"use client";

import { useState, useEffect, useActionState } from "react";
import { verifyEmailAction, sendVerificationAction } from "@/app/actions/auth";
import "./VerificationForm.scss";

export default function VerificationForm({ email, onSuccess, onBackToForm }) {
  // Собственный useActionState для verifyEmailAction
  const [verifyState, verifyAction, isVerifyPending] = useActionState(
    verifyEmailAction,
    {
      success: false,
      error: null,
      message: null,
      fieldErrors: null,
      step: null,
    }
  );

  // Отдельный useActionState для resend кода
  const [resendState, resendAction, isResendPending] = useActionState(
    sendVerificationAction,
    {
      success: false,
      error: null,
      message: null,
      fieldErrors: null,
    }
  );

  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Отслеживаем успешную верификацию
  useEffect(() => {
    if (verifyState?.success && verifyState?.step === "success") {
      onSuccess();
    }
  }, [verifyState?.success, verifyState?.step, onSuccess]);

  // Handle resend success
  useEffect(() => {
    if (resendState?.success) {
      setResendTimer(60);
      setCanResend(false);
    }
  }, [resendState?.success]);

  // Optimized timer
  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="verification-form">
      {/* Email recap */}
      <div className="verification-form__email-recap">
        <span className="verification-form__email-label">Email:</span>
        <span className="verification-form__email-value">{email}</span>
        <button
          type="button"
          onClick={onBackToForm}
          className="verification-form__change-email"
          disabled={isVerifyPending || isResendPending}
        >
          Zmeniť
        </button>
      </div>

      {/* Success message from resend */}
      {resendState?.success && (
        <div className="verification-form__success-message">
          Kód bol odoslaný na váš email. Skontrolujte si schránku aj spam
          priečinok.
        </div>
      )}

      {/* Verify form - ПРАВИЛЬНО с прямым action */}
      <form action={verifyAction} className="verification-form__form">
        <input type="hidden" name="email" value={email} />

        {/* Verify errors */}
        {verifyState?.error && (
          <div className="verification-form__error">{verifyState.error}</div>
        )}

        {/* Success message */}
        {verifyState?.message && !verifyState?.error && (
          <div className="verification-form__success">
            {verifyState.message}
          </div>
        )}

        <div className="verification-form__field">
          <label htmlFor="code" className="verification-form__label">
            Overovací kód *
          </label>
          <input
            id="code"
            type="text"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            placeholder="Zadajte 6-miestny kód"
            className={`verification-form__input ${
              verifyState?.fieldErrors?.code
                ? "verification-form__input--error"
                : ""
            }`}
            disabled={isVerifyPending}
            maxLength={6}
            autoFocus
            required
            aria-describedby={
              verifyState?.fieldErrors?.code ? "code-error" : undefined
            }
          />
          {verifyState?.fieldErrors?.code && (
            <div id="code-error" className="verification-form__field-error">
              {verifyState.fieldErrors.code}
            </div>
          )}
          <div className="verification-form__field-help">
            Zadajte kód ktorý ste dostali v emaili
          </div>
        </div>

        <button
          type="submit"
          disabled={code.length < 4 || isVerifyPending}
          className="verification-form__submit"
          aria-busy={isVerifyPending}
        >
          {isVerifyPending ? "Overovanie..." : "Overiť kód"}
        </button>
      </form>

      {/* Resend section */}
      <div className="verification-form__resend">
        {resendState?.error && (
          <div className="verification-form__error">{resendState.error}</div>
        )}

        <p className="verification-form__resend-text">
          Nedostali ste kód?{" "}
          {canResend ? (
            <form action={resendAction} style={{ display: "inline" }}>
              <input type="hidden" name="email" value={email} />
              <button
                type="submit"
                className="verification-form__resend-btn"
                disabled={isResendPending}
                aria-busy={isResendPending}
              >
                {isResendPending ? "Odosielanie..." : "Odoslať znova"}
              </button>
            </form>
          ) : (
            <span className="verification-form__resend-timer">
              Odoslať znova za {resendTimer}s
            </span>
          )}
        </p>
      </div>

      {/* Back button */}
      <div className="verification-form__footer">
        <button
          type="button"
          onClick={onBackToForm}
          className="verification-form__back-btn"
          disabled={isVerifyPending || isResendPending}
        >
          ← Späť na registráciu
        </button>
      </div>
    </div>
  );
}
