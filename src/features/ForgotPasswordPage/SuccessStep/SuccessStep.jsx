// Файл: src/features/ForgotPasswordPage/SuccessStep/SuccessStep.jsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import "./SuccessStep.scss";

export default function SuccessStep({ onBackToPassword }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto redirect після 5 секунд
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      const redirectTo = searchParams.get("next") || "/forum/login";
      router.replace(redirectTo);
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [router, searchParams]);

  return (
    <div className="success-step">
      <div className="success-step__content">
        <div className="success-step__icon">
          <CheckCircleIcon />
        </div>

        <div className="success-step__message">
          <h2 className="success-step__title">Heslo obnovené!</h2>
          <p className="success-step__description">
            Vaše heslo bolo úspešne zmenené. Teraz sa môžete prihlásiť so svojím
            novým heslom.
          </p>
        </div>

        <div className="success-step__security-info">
          <div className="success-step__security-icon"><LockIcon/></div>
          <p className="success-step__security-text">
            Z bezpečnostných dôvodov boli všetky vaše aktívne relácie ukončené.
            Budete sa musieť prihlásiť znovu na všetkých zariadeniach.
          </p>
        </div>

        <div className="success-step__actions">
          <Link href="/forum/login" className="success-step__login-btn">
            Prihlásiť sa s novým heslom
          </Link>

          <p className="success-step__auto-redirect">
            Automaticky presmerujeme na prihlásenie za 5 sekúnd...
          </p>
        </div>
      </div>

      <div className="success-step__footer">
        <p className="success-step__help-text">
          Stále máte problémy s prihlásením?{" "}
          <button
            type="button"
            onClick={onBackToPassword}
            className="success-step__back-link"
          >
            Skúsiť obnoviť heslo znova
          </button>
        </p>

        <div className="success-step__contact">
          <p className="success-step__contact-text">
            Potrebujete ďalšiu pomoc?{" "}
            <a href="/kontakty.html" className="success-step__contact-link">
              Kontaktujte podporu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
