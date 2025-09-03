"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import GoogleAuthButton from "@/src/components/GoogleAuthButton/GoogleAuthButton";
import "./LoginPage.scss";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  // Правильное использование useActionState с isPending
  const [formState, formAction, isPending] = useActionState(loginAction, {
    success: false,
    message: null,
    error: null,
    fieldErrors: null,
  });

  // Обработка успешного входа и редиректа
  useEffect(() => {
    if (formState?.success) {
      const redirectTo = searchParams.get("next") || "/";
      const timerId = setTimeout(() => {
        router.replace(redirectTo);
      }, 1000);

      // Очистка таймера при размонтировании компонента
      return () => clearTimeout(timerId);
    }
  }, [formState?.success, router, searchParams]);

  const handleGoogleSuccess = ({ user }) => {
    const redirectTo = searchParams.get("next") || "/";
    router.replace(redirectTo);
  };

  const handleGoogleError = (error) => {
    console.error("[LoginPage] Google auth error:", error);
  };

  // Показываем success состояние
  if (formState?.success) {
    return (
      <section className="login-page">
        <div className="container">
          <div className="login-page__wrapper">
            <div className="login-page__card">
              <div className="login-page__header">
                <h1 className="login-page__title">Prihlásenie úspešné!</h1>
                <p className="login-page__subtitle">
                  Presmerúvame vás do systému...
                </p>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "var(--status-success-color)",
                  fontSize: "48px",
                }}
              >
                ✅
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="login-page">
      <div className="container">
        <div className="login-page__wrapper">
          <div className="login-page__card">
            <div className="login-page__header">
              <h1 className="login-page__title">Prihlásenie</h1>
              <p className="login-page__subtitle">
                Prihláste sa do svojho účtu na FastCredit fóre
              </p>
            </div>

            {/* Google OAuth Button */}
            <div className="login-page__google-container">
              <GoogleAuthButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            <div className="login-page__divider">
              <span>alebo</span>
            </div>

            {/* Server Action Form */}
            <form action={formAction} className="login-page__form">
              {/* Общая ошибка от Server Action */}
              {formState?.error && (
                <div className="login-page__error login-page__error--general">
                  {formState.error}
                </div>
              )}

              {/* Success сообщение (если нужно показать без редиректа) */}
              {formState?.message && !formState?.error && (
                <div className="login-page__success">{formState.message}</div>
              )}

              <div className="login-page__field">
                <label htmlFor="login" className="login-page__label">
                  Email alebo používateľské meno *
                </label>
                <input
                  id="login"
                  type="text"
                  name="login"
                  placeholder="napr. jan@example.com"
                  className="login-page__input"
                  disabled={isPending}
                  autoComplete="username"
                  required
                  aria-describedby={
                    formState?.fieldErrors?.login ? "login-error" : undefined
                  }
                />
                {/* Ошибка для конкретного поля */}
                {formState?.fieldErrors?.login && (
                  <div id="login-error" className="login-page__field-error">
                    {formState.fieldErrors.login}
                  </div>
                )}
              </div>

              <div className="login-page__field">
                <label htmlFor="password" className="login-page__label">
                  Heslo *
                </label>
                <div className="login-page__password-field">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Vaše heslo"
                    className="login-page__input"
                    disabled={isPending}
                    autoComplete="current-password"
                    required
                    minLength={6}
                    aria-describedby={
                      formState?.fieldErrors?.password
                        ? "password-error"
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-page__password-toggle"
                    disabled={isPending}
                    aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* Ошибка для конкретного поля */}
                {formState?.fieldErrors?.password && (
                  <div id="password-error" className="login-page__field-error">
                    {formState.fieldErrors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="login-page__submit"
                aria-busy={isPending}
              >
                {isPending ? "Prihlasovanie..." : "Prihlásiť sa"}
              </button>
            </form>

            <div className="login-page__footer">
              <Link href="/forgot-password" className="login-page__link">
                Zabudli ste heslo?
              </Link>
              <div className="login-page__register">
                <span>Nemáte účet? </span>
                <Link
                  href="/register"
                  className="login-page__link login-page__link--primary"
                >
                  Zaregistrujte sa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
