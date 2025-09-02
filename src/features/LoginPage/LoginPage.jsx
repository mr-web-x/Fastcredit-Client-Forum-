"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/src/services/client";
import GoogleAuthButton from "@/src/components/GoogleAuthButton/GoogleAuthButton";
import "./LoginPage.scss";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const redirectTo = searchParams.get("next") || "/";
      router.replace(redirectTo);
    }
  }, [router, searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.login.trim())
      newErrors.login = "Email alebo používateľské meno je povinné";
    if (!formData.password) newErrors.password = "Heslo je povinné";
    else if (formData.password.length < 6)
      newErrors.password = "Heslo musí mať aspoň 6 znakov";
    return newErrors;
  };

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await authService.login(formData);
      if (res?.user) authService.setUserData(res.user);
      const redirectTo = searchParams.get("next") || "/";
      router.replace(redirectTo);
    } catch (error) {
      if (error.status === 401)
        setErrors({ general: "Nesprávne prihlasovacie údaje" });
      else if (error.status === 403)
        setErrors({ general: "Váš účet nie je aktívny. Skontrolujte email." });
      else if (error.status === 429)
        setErrors({ general: "Príliš veľa pokusov. Skúste neskôr." });
      else setErrors({ general: error?.message || "Nepodarilo sa prihlásiť" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    const redirectTo = searchParams.get("next") || "/";
    router.replace(redirectTo);
  };

  const handleGoogleError = (err) => {
    setErrors({ general: err?.message || "Ошибка входа через Google" });
  };

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

            {/* КАСТОМНАЯ КНОПКА GOOGLE (popup) */}
            <div className="login-page__google-container">
              <GoogleAuthButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            <div className="login-page__divider">
              <span>alebo</span>
            </div>

            <form onSubmit={handleLocalLogin} className="login-page__form">
              {errors.general && (
                <div className="login-page__error login-page__error--general">
                  {errors.general}
                </div>
              )}

              <div className="login-page__field">
                <label className="login-page__label">
                  Email alebo používateľské meno *
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  placeholder="napr. jan@example.com"
                  className={`login-page__input ${
                    errors.login ? "login-page__input--error" : ""
                  }`}
                  disabled={loading}
                  autoComplete="username"
                />
                {errors.login && (
                  <span className="login-page__error">{errors.login}</span>
                )}
              </div>

              <div className="login-page__field">
                <label className="login-page__label">Heslo *</label>
                <div className="login-page__password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Vaše heslo"
                    className={`login-page__input ${
                      errors.password ? "login-page__input--error" : ""
                    }`}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-page__password-toggle"
                    disabled={loading}
                    aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <span className="login-page__error">{errors.password}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-page__submit"
              >
                {loading ? "Prihlasovanie..." : "Prihlásiť sa"}
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
