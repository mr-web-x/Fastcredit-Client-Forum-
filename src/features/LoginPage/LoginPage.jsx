// Файл: src/features/LoginPage/LoginPage.jsx
"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation"; // ✅ Оставляем только useRouter
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import GoogleAuthButton from "@/src/components/GoogleAuthButton/GoogleAuthButton";
import "./LoginPage.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function LoginPage({ redirectTo = "/forum" }) {
  const router = useRouter();
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
      const timerId = setTimeout(() => {
        router.replace(redirectTo);
      }, 1000);

      // Очистка таймера при размонтировании компонента
      return () => clearTimeout(timerId);
    }
  }, [formState?.success, router, redirectTo]);

  const handleGoogleSuccess = ({ user }) => {
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

            {/* Content */}
            <div className="login-page__content">
              {/* Google OAuth */}
              <GoogleAuthButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />

              <div className="login-page__divider">
                <span>alebo</span>
              </div>

              {/* Login Form */}
              <form action={formAction} className="login-page__form">
                {/* General error */}
                {formState?.error && (
                  <div className="login-page__error">{formState.error}</div>
                )}

                {/* Success message */}
                {formState?.message && !formState?.error && (
                  <div className="login-page__success">{formState.message}</div>
                )}

                {/* Email/Username field */}
                <div className="login-page__field">
                  <label htmlFor="login" className="login-page__label">
                    Email alebo používateľské meno *
                  </label>
                  <input
                    id="login"
                    type="text"
                    name="login"
                    placeholder="Zadajte email alebo používateľské meno"
                    className={`login-page__input ${
                      formState?.fieldErrors?.login
                        ? "login-page__input--error"
                        : ""
                    }`}
                    disabled={isPending}
                    autoComplete="username"
                    required
                  />
                  {formState?.fieldErrors?.login && (
                    <div className="login-page__field-error">
                      {formState.fieldErrors.login}
                    </div>
                  )}
                </div>

                {/* Password field */}
                <div className="login-page__field">
                  <label htmlFor="password" className="login-page__label">
                    Heslo *
                  </label>
                  <div className="login-page__password-field">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Zadajte heslo"
                      className={`login-page__input ${
                        formState?.fieldErrors?.password
                          ? "login-page__input--error"
                          : ""
                      }`}
                      disabled={isPending}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-page__password-toggle"
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon sx={{ fontSize: "14px" }} />
                      ) : (
                        <VisibilityIcon sx={{ fontSize: "14px" }} />
                      )}
                    </button>
                  </div>
                  {formState?.fieldErrors?.password && (
                    <div className="login-page__field-error">
                      {formState.fieldErrors.password}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="login-page__submit"
                  disabled={isPending}
                >
                  {isPending ? "Prihlasovanie..." : "Prihlásiť sa"}
                </button>

                {/* Forgot password link */}
                <div className="login-page__forgot">
                  <Link
                    href={`/forum/forgot-password${
                      redirectTo !== "/"
                        ? `?next=${encodeURIComponent(redirectTo)}`
                        : ""
                    }`}
                    className="login-page__forgot-link"
                  >
                    Zabudli ste heslo?
                  </Link>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="login-page__footer">
              <p className="login-page__register-link">
                Nemáte účet?{" "}
                <Link
                  href={`/forum/register${
                    redirectTo !== "/"
                      ? `?next=${encodeURIComponent(redirectTo)}`
                      : ""
                  }`}
                >
                  Registrovať sa
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
