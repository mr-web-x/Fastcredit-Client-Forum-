// Файл: src/features/RegisterPage/SuccessForm/SuccessForm.jsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./SuccessForm.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function SuccessForm({
  email,
  onBackToVerification,
  redirectTo,
}) {
  const router = useRouter();

  // Auto redirect после 5 секунд
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.replace(redirectTo);
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [router, redirectTo]);

  return (
    <div className="success-form">
      <div className="success-form__content">
        <div className="success-form__icon">
          <CheckCircleIcon />
        </div>

        <div className="success-form__message">
          <h2 className="success-form__congratulations">Blahoželáme!</h2>
          <p className="success-form__description">
            Váš účet bol úspešne vytvorený a overený. Môžete sa teraz prihlásiť
            a začať používať FastCredit fórum.
          </p>
        </div>

        <div className="success-form__account-info">
          <div className="success-form__email-info">
            <span className="success-form__email-label">Váš účet:</span>
            <span className="success-form__email-value">{email}</span>
          </div>
        </div>

        <div className="success-form__benefits">
          <h3 className="success-form__benefits-title">
            Čo môžete teraz robiť:
          </h3>
          <ul className="success-form__benefits-list">
            <li>Pokládate otázky finančným expertom</li>
            <li>Získajte odborné rady zdarma</li>
            <li>Participujte v diskusiách o financiách</li>
            <li>Prístup k exkluzívnemu obsahu</li>
          </ul>
        </div>

        <div className="success-form__actions">
          <Link
            href={
              redirectTo === "/"
                ? "/forum/login"
                : `/forum/login?next=${encodeURIComponent(redirectTo)}`
            }
            className="success-form__login-btn"
          >
            Prihlásiť sa teraz
          </Link>

          <p className="success-form__auto-redirect">
            Automaticky presmerujeme za 5 sekúnd...
          </p>
        </div>
      </div>

      <div className="success-form__footer">
        <p className="success-form__help-text">
          Máte problémy s prihlásením?{" "}
          <button
            type="button"
            onClick={onBackToVerification}
            className="success-form__back-link"
          >
            Skúsiť overiť email znova
          </button>
        </p>

        <div className="success-form__contact">
          <p className="success-form__contact-text">
            Potrebujete pomoc?{" "}
            <Link href="/kontakty.html" className="success-form__contact-link">
              Kontaktujte nás
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
