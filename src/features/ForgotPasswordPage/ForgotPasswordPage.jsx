// Файл: src/features/ForgotPasswordPage/ForgotPasswordPage.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import EmailStep from "./EmailStep/EmailStep";
import CodeStep from "./CodeStep/CodeStep";
import PasswordStep from "./PasswordStep/PasswordStep";
import SuccessStep from "./SuccessStep/SuccessStep";
import "./ForgotPasswordPage.scss";

export default function ForgotPasswordPage() {
  // Локальный state для управления шагами
  const [step, setStep] = useState("email"); // email, code, password, success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  // Callbacks для переходов между шагами
  const handleEmailSuccess = (userEmail) => {
    setEmail(userEmail);
    setStep("code");
  };

  const handleCodeSuccess = (userCode) => {
    setCode(userCode);
    setStep("password");
  };

  const handlePasswordSuccess = () => {
    setStep("success");
  };

  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
    setCode("");
  };

  const handleBackToCode = () => {
    setStep("code");
    setCode("");
  };

  const handleBackToPassword = () => {
    setStep("password");
  };

  return (
    <section className="forgot-password-page">
      <div className="container">
        <div className="forgot-password-page__wrapper">
          <div className="forgot-password-page__card">
            
            {/* Header */}
            <div className="forgot-password-page__header">
              <h1 className="forgot-password-page__title">
                {step === "email" && "Zabudnuté heslo"}
                {step === "code" && "Overte kód z emailu"}
                {step === "password" && "Vytvorte nové heslo"}
                {step === "success" && "Heslo obnovené!"}
              </h1>
              <p className="forgot-password-page__subtitle">
                {step === "email" && "Zadajte svoj email a pošleme vám kód na obnovenie hesla"}
                {step === "code" && `Odoslali sme kód na ${email}`}
                {step === "password" && "Vytvorte si nové bezpečné heslo"}
                {step === "success" && "Vaše heslo bolo úspešne zmenené"}
              </p>
            </div>

            {/* Progress indicator - only show for multi-step flow */}
            {step !== "success" && (
              <div className="forgot-password-page__progress">
                <div
                  className={`forgot-password-page__step ${
                    step === "email" ? "active" : 
                    (step === "code" || step === "password") ? "completed" : ""
                  }`}
                >
                  <span className="forgot-password-page__step-number">1</span>
                  <span className="forgot-password-page__step-label">Email</span>
                </div>
                <div
                  className={`forgot-password-page__step ${
                    step === "code" ? "active" : 
                    step === "password" ? "completed" : ""
                  }`}
                >
                  <span className="forgot-password-page__step-number">2</span>
                  <span className="forgot-password-page__step-label">Kód</span>
                </div>
                <div
                  className={`forgot-password-page__step ${
                    step === "password" ? "active" : ""
                  }`}
                >
                  <span className="forgot-password-page__step-number">3</span>
                  <span className="forgot-password-page__step-label">
                    Nové heslo
                  </span>
                </div>
              </div>
            )}

            {/* Step Components - каждый со своим useActionState */}
            {step === "email" && (
              <EmailStep onSuccess={handleEmailSuccess} />
            )}

            {step === "code" && (
              <CodeStep
                email={email}
                onSuccess={handleCodeSuccess}
                onBackToEmail={handleBackToEmail}
              />
            )}

            {step === "password" && (
              <PasswordStep
                email={email}
                code={code}
                onSuccess={handlePasswordSuccess}
                onBackToCode={handleBackToCode}
              />
            )}

            {step === "success" && (
              <SuccessStep
                onBackToPassword={handleBackToPassword}
              />
            )}

            {/* Footer - only show on email step */}
            {step === "email" && (
              <div className="forgot-password-page__footer">
                <Link href="/login" className="forgot-password-page__link">
                  ← Späť na prihlásenie
                </Link>

                <div className="forgot-password-page__register">
                  <span>Nemáte účet? </span>
                  <Link
                    href="/register"
                    className="forgot-password-page__link forgot-password-page__link--primary"
                  >
                    Zaregistrujte sa
                  </Link>
                </div>
              </div>
            )}

            {/* Security note - show on all steps except success */}
            {step !== "success" && (
              <div className="forgot-password-page__security-note">
                <div className="forgot-password-page__security-icon">🔒</div>
                <p>
                  Kód na obnovenie hesla je platný len 15 minút z bezpečnostných
                  dôvodov. Po zmene hesla budú všetky vaše aktívne relácie
                  ukončené.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}