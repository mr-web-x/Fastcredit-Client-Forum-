"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/src/services/client";
import GoogleAuthButton from "@/src/components/GoogleAuthButton/GoogleAuthButton";
import "./RegisterPage.scss";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState("form"); // form, verification, success
  const [verification, setVerification] = useState({
    code: "",
    loading: false,
    canResend: false,
    resendTimer: 0,
  });

  // Проверки доступности (debounced)
  const [availability, setAvailability] = useState({
    email: { checking: false, available: null, message: "" },
    username: { checking: false, available: null, message: "" },
  });

  // Редирект если уже залогинен
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const redirectTo = searchParams.get("next") || "/";
      router.replace(redirectTo);
    }
  }, [router, searchParams]);

  // Таймер для повторной отправки кода
  useEffect(() => {
    let timer;
    if (verification.resendTimer > 0) {
      timer = setTimeout(() => {
        setVerification((prev) => ({
          ...prev,
          resendTimer: prev.resendTimer - 1,
        }));
      }, 1000);
    } else if (verification.resendTimer === 0 && step === "verification") {
      setVerification((prev) => ({ ...prev, canResend: true }));
    }
    return () => clearTimeout(timer);
  }, [verification.resendTimer, step]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Real-time валидация для паролей
    if (name === "password" || name === "confirmPassword") {
      validatePasswords(
        name === "password" ? newValue : formData.password,
        name === "confirmPassword" ? newValue : formData.confirmPassword
      );
    }

    // Debounced проверка доступности
    if (name === "email" || name === "username") {
      debouncedAvailabilityCheck(name, newValue);
    }
  };

  const validatePasswords = (password, confirmPassword) => {
    const newErrors = { ...errors };

    if (password && password.length < 6) {
      newErrors.password = "Heslo musí mať aspoň 6 znakov";
    } else {
      delete newErrors.password;
    }

    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Heslá sa nezhodujú";
    } else {
      delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
  };

  // Debounced availability check
  const debouncedAvailabilityCheck = (() => {
    const timeouts = {};
    return (field, value) => {
      clearTimeout(timeouts[field]);

      if (!value.trim()) {
        setAvailability((prev) => ({
          ...prev,
          [field]: { checking: false, available: null, message: "" },
        }));
        return;
      }

      setAvailability((prev) => ({
        ...prev,
        [field]: { checking: true, available: null, message: "" },
      }));

      timeouts[field] = setTimeout(async () => {
        try {
          const checkMethod =
            field === "email"
              ? authService.checkEmailAvailability
              : authService.checkUsernameAvailability;

          await checkMethod(value);

          // Если метод не бросил ошибку, значит доступно
          setAvailability((prev) => ({
            ...prev,
            [field]: {
              checking: false,
              available: true,
              message:
                field === "email"
                  ? "Email je dostupný"
                  : "Používateľské meno je dostupné",
            },
          }));
        } catch (error) {
          setAvailability((prev) => ({
            ...prev,
            [field]: {
              checking: false,
              available: false,
              message: error.message || `${field} nie je dostupné`,
            },
          }));
        }
      }, 500);
    };
  })();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email je povinný";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Neplatný formát emailu";
    } else if (availability.email.available === false) {
      newErrors.email = "Tento email sa už používa";
    }

    if (!formData.password) {
      newErrors.password = "Heslo je povinné";
    } else if (formData.password.length < 6) {
      newErrors.password = "Heslo musí mať aspoň 6 znakov";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Potvrďte heslo";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Heslá sa nezhodujú";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Meno je povinné";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Priezvisko je povinné";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Používateľské meno je povinné";
    } else if (formData.username.length < 3) {
      newErrors.username = "Používateľské meno musí mať aspoň 3 znaky";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Používateľské meno môže obsahovať len písmená, číslice a podčiarkovník";
    } else if (availability.username.available === false) {
      newErrors.username = "Toto používateľské meno sa už používa";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Musíte súhlasiť s podmienkami použitia";
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const registerData = {
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
      };

      await authService.register(registerData);

      // Переходим к верификации email
      setStep("verification");
      setVerification((prev) => ({
        ...prev,
        resendTimer: 60,
        canResend: false,
      }));
    } catch (error) {
      if (error.status === 409) {
        setErrors({
          general:
            "Používateľ s týmto emailom alebo používateľským menom už existuje",
        });
      } else if (error.status === 429) {
        setErrors({ general: "Príliš veľa pokusov. Skúste neskôr." });
      } else {
        setErrors({ general: error?.message || "Nepodarilo sa zaregistrovať" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!verification.code.trim()) {
      setErrors({ code: "Zadajte overovací kód" });
      return;
    }

    setVerification((prev) => ({ ...prev, loading: true }));
    setErrors({});

    try {
      await authService.verifyEmail(formData.email, verification.code);
      setStep("success");

      // Редирект через 3 секунды
      setTimeout(() => {
        const redirectTo = searchParams.get("next") || "/";
        router.replace(redirectTo);
      }, 3000);
    } catch (error) {
      if (error.status === 400) {
        setErrors({ code: "Neplatný alebo expirovaný kód" });
      } else {
        setErrors({ code: error?.message || "Nepodarilo sa overiť email" });
      }
    } finally {
      setVerification((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleResendCode = async () => {
    if (!verification.canResend) return;

    setVerification((prev) => ({ ...prev, loading: true }));

    try {
      await authService.sendVerificationCode(formData.email);
      setVerification((prev) => ({
        ...prev,
        loading: false,
        canResend: false,
        resendTimer: 60,
      }));
      setErrors({});
    } catch (error) {
      setErrors({ general: error?.message || "Nepodarilo sa odoslať kód" });
      setVerification((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleGoogleSuccess = () => {
    const redirectTo = searchParams.get("next") || "/";
    router.replace(redirectTo);
  };

  const handleGoogleError = (err) => {
    setErrors({ general: err?.message || "Chyba pri registrácii cez Google" });
  };

  const getPasswordStrength = () => {
    const password = formData.password;
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

  // Render krokov
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
                  <strong>{formData.email}</strong>
                </p>
              </div>

              <form
                onSubmit={handleVerifyEmail}
                className="register-page__form"
              >
                {errors.general && (
                  <div className="register-page__error register-page__error--general">
                    {errors.general}
                  </div>
                )}

                <div className="register-page__field">
                  <label className="register-page__label">
                    Overovací kód *
                  </label>
                  <input
                    type="text"
                    value={verification.code}
                    onChange={(e) =>
                      setVerification((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    placeholder="Zadajte 6-miestny kód"
                    className={`register-page__input ${
                      errors.code ? "register-page__input--error" : ""
                    }`}
                    disabled={verification.loading}
                    maxLength={6}
                    autoFocus
                  />
                  {errors.code && (
                    <span className="register-page__error">{errors.code}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verification.loading}
                  className="register-page__submit"
                >
                  {verification.loading ? "Overovanie..." : "Overiť email"}
                </button>
              </form>

              <div className="register-page__verification-footer">
                <p className="register-page__resend-text">
                  Nedostali ste kód?{" "}
                  {verification.canResend ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="register-page__resend-btn"
                      disabled={verification.loading}
                    >
                      Odoslať znova
                    </button>
                  ) : (
                    <span className="register-page__resend-timer">
                      Odoslať znova za {verification.resendTimer}s
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

  // Главная форма регистрации
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

            <form onSubmit={handleRegister} className="register-page__form">
              {errors.general && (
                <div className="register-page__error register-page__error--general">
                  {errors.general}
                </div>
              )}

              <div className="register-page__row">
                <div className="register-page__field">
                  <label className="register-page__label">Meno *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Vaše meno"
                    className={`register-page__input ${
                      errors.firstName ? "register-page__input--error" : ""
                    }`}
                    disabled={loading}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <span className="register-page__error">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="register-page__field">
                  <label className="register-page__label">Priezvisko *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Vaše priezvisko"
                    className={`register-page__input ${
                      errors.lastName ? "register-page__input--error" : ""
                    }`}
                    disabled={loading}
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <span className="register-page__error">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              <div className="register-page__field">
                <label className="register-page__label">Email *</label>
                <div className="register-page__input-with-status">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="napr. jan@example.com"
                    className={`register-page__input ${
                      errors.email ? "register-page__input--error" : ""
                    } ${
                      availability.email.available === true
                        ? "register-page__input--success"
                        : ""
                    }`}
                    disabled={loading}
                    autoComplete="email"
                  />
                  <div className="register-page__input-status">
                    {availability.email.checking && (
                      <span className="register-page__spinner">⏳</span>
                    )}
                    {availability.email.available === true && (
                      <span className="register-page__success">✅</span>
                    )}
                    {availability.email.available === false && (
                      <span className="register-page__error-icon">❌</span>
                    )}
                  </div>
                </div>
                {errors.email && (
                  <span className="register-page__error">{errors.email}</span>
                )}
                {!errors.email && availability.email.message && (
                  <span
                    className={`register-page__availability ${
                      availability.email.available
                        ? "register-page__availability--success"
                        : "register-page__availability--error"
                    }`}
                  >
                    {availability.email.message}
                  </span>
                )}
              </div>

              <div className="register-page__field">
                <label className="register-page__label">
                  Používateľské meno *
                </label>
                <div className="register-page__input-with-status">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="napr. jan123"
                    className={`register-page__input ${
                      errors.username ? "register-page__input--error" : ""
                    } ${
                      availability.username.available === true
                        ? "register-page__input--success"
                        : ""
                    }`}
                    disabled={loading}
                    autoComplete="username"
                  />
                  <div className="register-page__input-status">
                    {availability.username.checking && (
                      <span className="register-page__spinner">⏳</span>
                    )}
                    {availability.username.available === true && (
                      <span className="register-page__success">✅</span>
                    )}
                    {availability.username.available === false && (
                      <span className="register-page__error-icon">❌</span>
                    )}
                  </div>
                </div>
                {errors.username && (
                  <span className="register-page__error">
                    {errors.username}
                  </span>
                )}
                {!errors.username && availability.username.message && (
                  <span
                    className={`register-page__availability ${
                      availability.username.available
                        ? "register-page__availability--success"
                        : "register-page__availability--error"
                    }`}
                  >
                    {availability.username.message}
                  </span>
                )}
              </div>

              <div className="register-page__field">
                <label className="register-page__label">Heslo *</label>
                <div className="register-page__password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Vytvorte si bezpečné heslo"
                    className={`register-page__input ${
                      errors.password ? "register-page__input--error" : ""
                    }`}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="register-page__password-toggle"
                    disabled={loading}
                    aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {formData.password && !errors.password && (
                  <div className="register-page__password-strength">
                    <div className="register-page__strength-bar">
                      <div
                        className="register-page__strength-fill"
                        style={{
                          width: `${
                            getPasswordStrength()?.level === "weak"
                              ? 33
                              : getPasswordStrength()?.level === "medium"
                              ? 66
                              : 100
                          }%`,
                          backgroundColor: getPasswordStrength()?.color,
                        }}
                      ></div>
                    </div>
                    <span
                      className="register-page__strength-text"
                      style={{ color: getPasswordStrength()?.color }}
                    >
                      {getPasswordStrength()?.text}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <span className="register-page__error">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="register-page__field">
                <label className="register-page__label">Potvrdiť heslo *</label>
                <div className="register-page__password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Zopakujte heslo"
                    className={`register-page__input ${
                      errors.confirmPassword
                        ? "register-page__input--error"
                        : ""
                    }`}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="register-page__password-toggle"
                    disabled={loading}
                    aria-label={
                      showConfirmPassword ? "Skryť heslo" : "Zobraziť heslo"
                    }
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="register-page__error">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="register-page__field register-page__field--checkbox">
                <label className="register-page__checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="register-page__checkbox"
                    disabled={loading}
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
                {errors.agreeToTerms && (
                  <span className="register-page__error">
                    {errors.agreeToTerms}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="register-page__submit"
              >
                {loading ? "Registrovanie..." : "Zaregistrovať sa"}
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
