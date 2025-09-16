// Файл: src/features/ForgotPasswordPage/PasswordStep/PasswordStep.jsx

"use client";

import { useState, useEffect, useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./PasswordStep.scss";

export default function PasswordStep({ email, code, onSuccess, onBack }) {
  // Собственный useActionState для resetPasswordAction
  const [formState, formAction, isPending] = useActionState(
    resetPasswordAction,
    {
      success: false,
      error: null,
      message: null,
      fieldErrors: null,
      step: null,
    }
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Отслеживаем успешный сброс пароля
  useEffect(() => {
    if (formState?.success && formState?.step === "success") {
      onSuccess();
    }
  }, [formState?.success, formState?.step, onSuccess]);

  return (
    <div className="password-step">
      {/* Email & Code recap */}
      <div className="password-step__recap">
        <div className="password-step__recap-item">
          <span className="password-step__recap-label">Email:</span>
          <span className="password-step__recap-value">{email}</span>
        </div>
        <div className="password-step__recap-item">
          <span className="password-step__recap-label">Kód:</span>
          <span className="password-step__recap-value">{code}</span>
          <button
            type="button"
            onClick={onBack}
            className="password-step__change-btn"
            disabled={isPending}
          >
            Zmeniť
          </button>
        </div>
      </div>

      {/* Success message */}
      {formState?.message && !formState?.error && (
        <div className="password-step__success">{formState.message}</div>
      )}

      {/* Password form */}
      <form action={formAction} className="password-step__form">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="code" value={code} />

        {/* General error */}
        {formState?.error && (
          <div className="password-step__error">{formState.error}</div>
        )}

        <div className="password-step__field">
          <label htmlFor="newPassword" className="password-step__label">
            Nové heslo *
          </label>
          <div className="password-step__password-field">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Zadajte nové heslo"
              className={`password-step__input ${
                formState?.fieldErrors?.newPassword
                  ? "password-step__input--error"
                  : ""
              }`}
              disabled={isPending}
              autoComplete="new-password"
              autoFocus
              minLength={6}
              required
              aria-describedby={
                formState?.fieldErrors?.newPassword
                  ? "newPassword-error"
                  : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-step__password-toggle"
              disabled={isPending}
              aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
            >
              {showPassword ? (
                <VisibilityOffIcon sx={{ fontSize: "18px" }} />
              ) : (
                <VisibilityIcon sx={{ fontSize: "18px" }} />
              )}
            </button>
          </div>
          {formState?.fieldErrors?.newPassword && (
            <div id="newPassword-error" className="password-step__field-error">
              {formState.fieldErrors.newPassword}
            </div>
          )}
          <div className="password-step__field-help">
            Heslo musí mať aspoň 6 znakov
          </div>
        </div>

        <div className="password-step__field">
          <label htmlFor="confirmPassword" className="password-step__label">
            Potvrdiť nové heslo *
          </label>
          <div className="password-step__password-field">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Zopakujte nové heslo"
              className={`password-step__input ${
                formState?.fieldErrors?.confirmPassword
                  ? "password-step__input--error"
                  : ""
              }`}
              disabled={isPending}
              autoComplete="new-password"
              minLength={6}
              required
              aria-describedby={
                formState?.fieldErrors?.confirmPassword
                  ? "confirmPassword-error"
                  : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-step__password-toggle"
              disabled={isPending}
              aria-label={
                showConfirmPassword ? "Skryť heslo" : "Zobraziť heslo"
              }
            >
              {showConfirmPassword ? (
                <VisibilityOffIcon sx={{ fontSize: "18px" }} />
              ) : (
                <VisibilityIcon sx={{ fontSize: "18px" }} />
              )}
            </button>
          </div>
          {formState?.fieldErrors?.confirmPassword && (
            <div
              id="confirmPassword-error"
              className="password-step__field-error"
            >
              {formState.fieldErrors.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="password-step__submit"
          aria-busy={isPending}
        >
          {isPending ? "Obnovovanie hesla..." : "Obnoviť heslo"}
        </button>
      </form>

      {/* Footer */}
      <div className="password-step__footer">
        <button
          type="button"
          onClick={onBack}
          className="password-step__back-btn"
          disabled={isPending}
        >
          ← Späť k overeniu kódu
        </button>
      </div>
    </div>
  );
}
