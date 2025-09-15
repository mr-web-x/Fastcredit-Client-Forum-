// Файл: src/features/RegisterPage/RegistrationForm/RegistrationForm.jsx

"use client";

import { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import "./RegistrationForm.scss";

export default function RegistrationForm({ onSuccess }) {
  // Собственный useActionState для registerAction
  const [formState, formAction, isPending] = useActionState(registerAction, {
    success: false,
    error: null,
    message: null,
    fieldErrors: null,
    step: null,
    email: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Отслеживаем успешную регистрацию
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
    <form action={formAction} className="registration-form">
      {/* Общая ошибка */}
      {formState?.error && (
        <div className="registration-form__error registration-form__error--general">
          {formState.error}
        </div>
      )}

      {/* Success сообщение */}
      {formState?.message && !formState?.error && (
        <div className="registration-form__success">{formState.message}</div>
      )}

      <div className="registration-form__row">
        <div className="registration-form__field">
          <label htmlFor="firstName" className="registration-form__label">
            Meno *
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="Vaše meno"
            className={`registration-form__input ${
              formState?.fieldErrors?.firstName
                ? "registration-form__input--error"
                : ""
            }`}
            disabled={isPending}
            autoComplete="given-name"
            required
            aria-describedby={
              formState?.fieldErrors?.firstName ? "firstName-error" : undefined
            }
          />
          {formState?.fieldErrors?.firstName && (
            <div
              id="firstName-error"
              className="registration-form__field-error"
            >
              {formState.fieldErrors.firstName}
            </div>
          )}
        </div>

        <div className="registration-form__field">
          <label htmlFor="lastName" className="registration-form__label">
            Priezvisko *
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Vaše priezvisko"
            className={`registration-form__input ${
              formState?.fieldErrors?.lastName
                ? "registration-form__input--error"
                : ""
            }`}
            disabled={isPending}
            autoComplete="family-name"
            required
            aria-describedby={
              formState?.fieldErrors?.lastName ? "lastName-error" : undefined
            }
          />
          {formState?.fieldErrors?.lastName && (
            <div id="lastName-error" className="registration-form__field-error">
              {formState.fieldErrors.lastName}
            </div>
          )}
        </div>
      </div>

      <div className="registration-form__field">
        <label htmlFor="email" className="registration-form__label">
          Email *
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="napr. jan@example.com"
          className={`registration-form__input ${
            formState?.fieldErrors?.email
              ? "registration-form__input--error"
              : ""
          }`}
          disabled={isPending}
          autoComplete="email"
          required
          aria-describedby={
            formState?.fieldErrors?.email ? "email-error" : undefined
          }
        />
        {formState?.fieldErrors?.email && (
          <div id="email-error" className="registration-form__field-error">
            {formState.fieldErrors.email}
          </div>
        )}
      </div>

      <div className="registration-form__field">
        <label htmlFor="username" className="registration-form__label">
          Používateľské meno *
        </label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="napr. jan123"
          className={`registration-form__input ${
            formState?.fieldErrors?.username
              ? "registration-form__input--error"
              : ""
          }`}
          disabled={isPending}
          autoComplete="username"
          pattern="[a-zA-Z0-9_]+"
          minLength={3}
          required
          aria-describedby={
            formState?.fieldErrors?.username ? "username-error" : undefined
          }
        />
        {formState?.fieldErrors?.username && (
          <div id="username-error" className="registration-form__field-error">
            {formState.fieldErrors.username}
          </div>
        )}
      </div>

      <div className="registration-form__field">
        <label htmlFor="password" className="registration-form__label">
          Heslo *
        </label>
        <div className="registration-form__password-field">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Vytvorte si bezpečné heslo"
            className={`registration-form__input ${
              formState?.fieldErrors?.password
                ? "registration-form__input--error"
                : ""
            }`}
            disabled={isPending}
            autoComplete="new-password"
            minLength={6}
            required
            aria-describedby={
              formState?.fieldErrors?.password ? "password-error" : undefined
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="registration-form__password-toggle"
            disabled={isPending}
            aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {formState?.fieldErrors?.password && (
          <div id="password-error" className="registration-form__field-error">
            {formState.fieldErrors.password}
          </div>
        )}
      </div>

      <div className="registration-form__field">
        <label htmlFor="confirmPassword" className="registration-form__label">
          Potvrdiť heslo *
        </label>
        <div className="registration-form__password-field">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Zopakujte heslo"
            className={`registration-form__input ${
              formState?.fieldErrors?.confirmPassword
                ? "registration-form__input--error"
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
            className="registration-form__password-toggle"
            disabled={isPending}
            aria-label={showConfirmPassword ? "Skryť heslo" : "Zobraziť heslo"}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {formState?.fieldErrors?.confirmPassword && (
          <div
            id="confirmPassword-error"
            className="registration-form__field-error"
          >
            {formState.fieldErrors.confirmPassword}
          </div>
        )}
      </div>

      <div className="registration-form__field registration-form__field--checkbox">
        <label className="registration-form__checkbox-label">
          <input
            type="checkbox"
            name="agreeToTerms"
            className="registration-form__checkbox"
            disabled={isPending}
            required
            aria-describedby={
              formState?.fieldErrors?.agreeToTerms
                ? "agreeToTerms-error"
                : undefined
            }
          />
          <span className="registration-form__checkbox-text">
            Súhlasím s{" "}
            <Link href="/forum/terms" className="registration-form__link">
              podmienkami použitia
            </Link>{" "}
            a{" "}
            <Link href="/forum/privacy" className="registration-form__link">
              ochranou osobných údajov
            </Link>
          </span>
        </label>
        {formState?.fieldErrors?.agreeToTerms && (
          <div
            id="agreeToTerms-error"
            className="registration-form__field-error"
          >
            {formState.fieldErrors.agreeToTerms}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="registration-form__submit"
        aria-busy={isPending}
      >
        {isPending ? "Registrovanie..." : "Zaregistrovať sa"}
      </button>
    </form>
  );
}
