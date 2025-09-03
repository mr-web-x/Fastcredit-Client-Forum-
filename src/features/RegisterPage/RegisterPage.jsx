// Файл: src/features/RegisterPage/RegisterPage.jsx

"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  registerAction,
  sendVerificationAction,
  verifyEmailAction,
} from "@/app/actions/auth";
import GoogleAuthButton from "@/src/components/GoogleAuthButton/GoogleAuthButton";
import { basePath } from "@/src/constants/config";
import "./RegisterPage.scss";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form states для разных Server Actions
  const [registerState, registerFormAction] = useActionState(
    registerAction,
    null
  );
  const [verifyState, verifyFormAction] = useActionState(
    verifyEmailAction,
    null
  );
  const [resendState, resendFormAction] = useActionState(
    sendVerificationAction,
    null
  );

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState("form"); // form, verification, success
  const [registrationEmail, setRegistrationEmail] = useState("");

  // Resend timer
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Handle registration success -> switch to verification
  useEffect(() => {
    if (registerState?.success && registerState?.step === "verification") {
      setRegistrationEmail(registerState.email);
      setStep("verification");
      setResendTimer(60);
      setCanResend(false);
    }
  }, [registerState]);

  // Handle verification success -> switch to success
  useEffect(() => {
    if (verifyState?.success && verifyState?.step === "success") {
      setStep("success");
      // Auto redirect после 3 секунд
      setTimeout(() => {
        const redirectTo = searchParams.get("next") || `${basePath}/`;
        router.replace(redirectTo);
      }, 3000);
    }
  }, [verifyState, router, searchParams]);

  // Resend timer countdown
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && step === "verification") {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, step]);

  // Handle resend code success
  useEffect(() => {
    if (resendState?.success) {
      setResendTimer(60);
      setCanResend(false);
    }
  }, [resendState]);

  // Form submission handlers
  const handleRegisterSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await registerFormAction(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (formData) => {
    // Добавляем email в form data
    formData.append("email", registrationEmail);
    setIsSubmitting(true);
    try {
      await verifyFormAction(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    const formData = new FormData();
    formData.append("email", registrationEmail);
    await resendFormAction(formData);
  };

  const handleGoogleSuccess = ({ user }) => {
    const redirectTo = searchParams.get("next") || "/";
    router.replace(redirectTo);
  };

  const handleGoogleError = (error) => {
    console.error("[RegisterPage] Google auth error:", error);
  };

  const getPasswordStrength = (password) => {
    if (!password) return null;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 2)
      return { level: "weak", text: "Slabé", color: "#dc3545" };
    if (strength <= 3)
      return { level: "medium", text: "Stredné", color: "#ffc107" };
    return { level: "strong", text: "Silné", color: "#28a745" };
  };

  // VERIFICATION STEP
  if (step === "verification") {
    return (
      <section className="register-page">
        <div className="container">
          <div className="register-page__wrapper">
            <div className="register-page__card">
              <div className="register-page__header">
                <h1 className="register-page__title">Overte svoj email</h1>
                <p className="register-page__subtitle">
                  Odoslali sme overovací kód na adresu{" "}
                  <strong>{registrationEmail}</strong>
                </p>
              </div>

              <form action={handleVerifySubmit} className="register-page__form">
                {verifyState?.error && (
                  <div className="register-page__error register-page__error--general">
                    {verifyState.error}
                  </div>
                )}

                <div className="register-page__field">
                  <label className="register-page__label">
                    Overovací kód *
                  </label>
                  <input
                    type="text"
                    name="code"
                    placeholder="Zadajte 6-miestny kód"
                    className={`register-page__input ${
                      verifyState?.error ? "register-page__input--error" : ""
                    }`}
                    disabled={isSubmitting}
                    maxLength={6}
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="register-page__submit"
                >
                  {isSubmitting ? "Overovanie..." : "Overiť email"}
                </button>
              </form>

              <div className="register-page__verification-footer">
                {resendState?.error && (
                  <div className="register-page__error">
                    {resendState.error}
                  </div>
                )}
                {resendState?.success && (
                  <div className="register-page__success">
                    {resendState.message}
                  </div>
                )}

                <p className="register-page__resend-text">
                  Nedostali ste kód?{" "}
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="register-page__resend-btn"
                      disabled={isSubmitting}
                    >
                      Odoslať znova
                    </button>
                  ) : (
                    <span className="register-page__resend-timer">
                      Odoslať znova za {resendTimer}s
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // SUCCESS STEP
  if (step === "success") {
    return (
      <section className="register-page">
        <div className="container">
          <div className="register-page__wrapper">
            <div className="register-page__card register-page__card--success">
              <div className="register-page__header">
                <div className="register-page__success-icon">✅</div>
                <h1 className="register-page__title">Registrácia úspešná!</h1>
                <p className="register-page__subtitle">
                  Váš účet bol úspešne vytvorený a overený. Presmerúvame vás...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // MAIN REGISTRATION FORM
  return (
    <section className="register-page">
      <div className="container">
        <div className="register-page__wrapper">
          <div className="register-page__card">
            <div className="register-page__header">
              <h1 className="register-page__title">Registrácia</h1>
              <p className="register-page__subtitle">
                Vytvorte si účet na FastCredit fóre
              </p>
            </div>

            <div className="register-page__google-container">
              <GoogleAuthButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            <div className="register-page__divider">
              <span>alebo</span>
            </div>

            <form action={handleRegisterSubmit} className="register-page__form">
              {registerState?.error && (
                <div className="register-page__error register-page__error--general">
                  {registerState.error}
                </div>
              )}

              {registerState?.errors && (
                <div className="register-page__error register-page__error--general">
                  Opravte chyby vo formulári
                </div>
              )}

              <div className="register-page__row">
                <div className="register-page__field">
                  <label className="register-page__label">Meno *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Vaše meno"
                    className={`register-page__input ${
                      registerState?.errors?.firstName
                        ? "register-page__input--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                    autoComplete="given-name"
                    required
                  />
                  {registerState?.errors?.firstName && (
                    <span className="register-page__error">
                      {registerState.errors.firstName}
                    </span>
                  )}
                </div>

                <div className="register-page__field">
                  <label className="register-page__label">Priezvisko *</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Vaše priezvisko"
                    className={`register-page__input ${
                      registerState?.errors?.lastName
                        ? "register-page__input--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                    autoComplete="family-name"
                    required
                  />
                  {registerState?.errors?.lastName && (
                    <span className="register-page__error">
                      {registerState.errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              <div className="register-page__field">
                <label className="register-page__label">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="napr. jan@example.com"
                  className={`register-page__input ${
                    registerState?.errors?.email
                      ? "register-page__input--error"
                      : ""
                  }`}
                  disabled={isSubmitting}
                  autoComplete="email"
                  required
                />
                {registerState?.errors?.email && (
                  <span className="register-page__error">
                    {registerState.errors.email}
                  </span>
                )}
              </div>

              <div className="register-page__field">
                <label className="register-page__label">
                  Používateľské meno *
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="napr. jan123"
                  className={`register-page__input ${
                    registerState?.errors?.username
                      ? "register-page__input--error"
                      : ""
                  }`}
                  disabled={isSubmitting}
                  autoComplete="username"
                  pattern="[a-zA-Z0-9_]+"
                  minLength={3}
                  required
                />
                {registerState?.errors?.username && (
                  <span className="register-page__error">
                    {registerState.errors.username}
                  </span>
                )}
              </div>

              <div className="register-page__field">
                <label className="register-page__label">Heslo *</label>
                <div className="register-page__password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Vytvorte si bezpečné heslo"
                    className={`register-page__input ${
                      registerState?.errors?.password
                        ? "register-page__input--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="register-page__password-toggle"
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {registerState?.errors?.password && (
                  <span className="register-page__error">
                    {registerState.errors.password}
                  </span>
                )}
              </div>

              <div className="register-page__field">
                <label className="register-page__label">Potvrdiť heslo *</label>
                <div className="register-page__password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Zopakujte heslo"
                    className={`register-page__input ${
                      registerState?.errors?.confirmPassword
                        ? "register-page__input--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="register-page__password-toggle"
                    disabled={isSubmitting}
                    aria-label={
                      showConfirmPassword ? "Skryť heslo" : "Zobraziť heslo"
                    }
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {registerState?.errors?.confirmPassword && (
                  <span className="register-page__error">
                    {registerState.errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="register-page__field register-page__field--checkbox">
                <label className="register-page__checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    className="register-page__checkbox"
                    disabled={isSubmitting}
                    required
                  />
                  <span className="register-page__checkbox-text">
                    Súhlasím s{" "}
                    <Link href="/terms" className="register-page__link">
                      podmienkami použitia
                    </Link>{" "}
                    a{" "}
                    <Link href="/privacy" className="register-page__link">
                      ochranou osobných údajov
                    </Link>
                  </span>
                </label>
                {registerState?.errors?.agreeToTerms && (
                  <span className="register-page__error">
                    {registerState.errors.agreeToTerms}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="register-page__submit"
              >
                {isSubmitting ? "Registrovanie..." : "Zaregistrovať sa"}
              </button>
            </form>

            <div className="register-page__footer">
              <div className="register-page__login">
                <span>Už máte účet? </span>
                <Link
                  href="/login"
                  className="register-page__link register-page__link--primary"
                >
                  Prihláste sa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
